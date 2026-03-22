import { config } from '@core/config';

const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '[::1]']);

/**
 * MinIO costuma devolver URL com 127.0.0.1 (MINIO_PUBLIC_BASE_URL no PC).
 * No celular físico isso não alcança o MinIO — troca o host pelo da API/LAN.
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
    if (!LOOPBACK_HOSTS.has(parsed.hostname)) {
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
    const port = config.media.minioInferredPort;
    const origin =
      port === 80 || port === 443
        ? `${api.protocol}//${api.hostname}`
        : `${api.protocol}//${api.hostname}:${port}`;
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
