#!/usr/bin/env node

/**
 * Script para corrigir os hooks do Git adicionando fallback para npx lefthook
 * Este script roda após o lefthook install para garantir que o lefthook funcione no Windows
 */

const fs = require('fs');
const path = require('path');

const hooksDir = path.join(__dirname, '..', '.git', 'hooks');
const hooks = ['pre-commit', 'commit-msg', 'prepare-commit-msg'];

hooks.forEach((hookName) => {
  const hookPath = path.join(hooksDir, hookName);

  if (!fs.existsSync(hookPath)) {
    console.log(`⚠️  Hook ${hookName} não encontrado, pulando...`);
    return;
  }

  let content = fs.readFileSync(hookPath, 'utf8');

  // Verifica se o fallback npx já existe
  if (content.includes('elif npx lefthook -h >/dev/null 2>&1')) {
    console.log(`✅ Hook ${hookName} já está corrigido`);
    return;
  }

  // Procura pelo padrão específico: devbox seguido de else + echo
  // Regex para encontrar: devbox ... else\s+echo "Can't find"
  const pattern =
    /(elif devbox run lefthook -h >\/dev\/null 2>&1\s+then\s+devbox run lefthook "\$@"\s+)else(\s+echo "Can't find lefthook in PATH"\s+fi)/s;

  if (pattern.test(content)) {
    // Substitui "else" por "elif npx ... else"
    content = content.replace(
      pattern,
      `$1elif npx lefthook -h >/dev/null 2>&1
    then
      npx lefthook "$@"
    else$2`
    );

    fs.writeFileSync(hookPath, content, { mode: 0o755 });
    console.log(`✅ Hook ${hookName} corrigido com sucesso`);
  } else {
    console.log(
      `⚠️  Não foi possível aplicar correção no hook ${hookName} (padrão não encontrado)`
    );
  }
});

console.log('✨ Correção dos hooks concluída!');
