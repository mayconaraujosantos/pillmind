import { config } from '@core/config';

const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '[::1]']);

/** Hostnames que o telefone não resolve ou não alcança; reescrevemos para o host da API/LAN. */
const UNREACHABLE_MINIO_HOSTNAMES = new Set(['minio', 'host.docker.internal']);

function needsMinioHostRewrite(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (LOOPBACK_HOSTS.has(h)) {
    return true;
  }
  return UNREACHABLE_MINIO_HOSTNAMES.has(h);
}

/**
 * MinIO costuma devolver URL com 127.0.0.1 ou hostname Docker (minio).
 * No celular isso não alcança o MinIO — troca o host pelo da API/LAN.
 * Usa o protocolo da própria URL da imagem (http do MinIO), não o da API,
 * para não gerar https://IP:9000 quando a API é HTTPS e o bucket é só HTTP.
 */
export function resolveProfilePictureUrlForDevice(
  url: string | undefined | null
): string | undefined {
  if (url == null || url === '') {
    return undefined;
  }
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (!needsMinioHostRewrite(parsed.hostname)) {
      return trimmed;
    }

    const explicit = config.media.minioPublicBaseUrl?.trim();
    if (explicit) {
      const normalized = explicit.replace(/\/$/, '');
      const base = new URL(
        normalized.includes('://') ? normalized : `http://${normalized}`
      );
      return `${base.origin}${parsed.pathname}${parsed.search}`;
    }

    if (!shouldInferMinioHostFromApi()) {
      return trimmed;
    }

    const api = new URL(config.api.baseUrl);
    const portPart = parsed.port
      ? parseInt(parsed.port, 10)
      : config.media.minioInferredPort;
    const proto = parsed.protocol || 'http:';
    const origin =
      portPart === 80 || portPart === 443
        ? `${proto}//${api.hostname}`
        : `${proto}//${api.hostname}:${portPart}`;
    return `${origin}${parsed.pathname}${parsed.search}`;
  } catch {
    return trimmed;
  }
}

function shouldInferMinioHostFromApi(): boolean {
  try {
    const host = new URL(config.api.baseUrl).hostname.toLowerCase();
    if (host === '10.0.2.2') {
      return true;
    }
    if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) {
      return true;
    }
    if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) {
      return true;
    }
    const m = host.match(/^172\.(\d{1,3})\.\d{1,3}\.\d{1,3}$/);
    if (m) {
      const second = parseInt(m[1], 10);
      return second >= 16 && second <= 31;
    }
    return false;
  } catch {
    return false;
  }
}
