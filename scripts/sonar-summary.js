#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');

const PROJECT_KEY = 'mayconaraujosantos_pillmind';
const ORGANIZATION = 'mayconaraujosantos';
const COVERAGE_FILE = path.resolve(
  __dirname,
  '..',
  'coverage',
  'coverage-final.json'
);
const MIN_COVERAGE = 80; // percent
const MAX_DUP_DENSITY = 3; // percent

const computeCoveragePct = (data) => {
  const files = Object.values(data).filter((entry) => entry && entry.s);
  if (!files.length) return null;

  let total = 0;
  let covered = 0;

  files.forEach((file) => {
    Object.values(file.s || {}).forEach((count) => {
      total += 1;
      if (count > 0) covered += 1;
    });
  });

  return total > 0 ? (covered / total) * 100 : null;
};

const readCoverage = () => {
  try {
    const raw = fs.readFileSync(COVERAGE_FILE, 'utf-8');
    const data = JSON.parse(raw);
    const totals = data.total || data;
    const pct =
      totals.statements?.pct ?? totals.lines?.pct ?? computeCoveragePct(data);
    return typeof pct === 'number' ? pct : null;
  } catch (err) {
    return null;
  }
};

const fetchSonarMeasures = (token) =>
  new Promise((resolve, reject) => {
    const options = {
      hostname: 'sonarcloud.io',
      path: `/api/measures/component?component=${PROJECT_KEY}&metricKeys=coverage,duplicated_lines_density&organization=${ORGANIZATION}`,
      headers: token
        ? {
            Authorization:
              'Basic ' + Buffer.from(`${token}:`).toString('base64'),
          }
        : {},
    };

    https
      .get(options, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 400) {
            return reject(new Error(`Sonar API status ${res.statusCode}`));
          }
          try {
            const json = JSON.parse(body);
            const measures = Object.fromEntries(
              (json.component?.measures || []).map((m) => [
                m.metric,
                parseFloat(m.value),
              ])
            );
            resolve(measures);
          } catch (err) {
            reject(err);
          }
        });
      })
      .on('error', reject);
  });

const formatPct = (value) =>
  value == null || Number.isNaN(value) ? 'N/A' : `${value.toFixed(2)}%`;

const run = async () => {
  const token = process.env.SONAR_TOKEN;
  const localCoverage = readCoverage();

  let sonarCoverage = null;
  let dupDensity = null;

  if (!token) {
    console.warn('SONAR_TOKEN não definido; métricas remotas serão ignoradas.');
  } else {
    try {
      const measures = await fetchSonarMeasures(token);
      sonarCoverage = measures.coverage;
      dupDensity = measures.duplicated_lines_density;
    } catch (err) {
      console.error('Falha ao obter métricas do SonarCloud:', err.message);
    }
  }

  console.log('--- Resumo de Qualidade ---');
  console.log(
    `Cobertura local (Jest): ${formatPct(
      localCoverage
    )} | alvo >= ${MIN_COVERAGE}% ${
      localCoverage != null && localCoverage >= MIN_COVERAGE ? '✅' : '⚠️'
    }`
  );
  console.log(
    `Cobertura Sonar:       ${formatPct(
      sonarCoverage
    )} | alvo >= ${MIN_COVERAGE}% ${
      sonarCoverage != null && sonarCoverage >= MIN_COVERAGE ? '✅' : '⚠️'
    }`
  );
  console.log(
    `Duplicação Sonar:      ${formatPct(
      dupDensity
    )} | alvo <= ${MAX_DUP_DENSITY}% ${
      dupDensity != null && dupDensity <= MAX_DUP_DENSITY ? '✅' : '⚠️'
    }`
  );

  if (localCoverage == null) {
    console.warn(
      'Cobertura local não encontrada. Rode "npm test -- --coverage" antes.'
    );
  }
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
