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
 * Resolve URLs de imagens de medicamentos para que funcionem no dispositivo móvel.
 * MinIO costuma devolver URL com 127.0.0.1 ou hostname Docker (minio).
 * No celular isso não alcança o MinIO — troca o host pelo da API/LAN.
 */
export function resolveMedicineImageUrlForDevice(
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

    // Usar configuração explícita do MinIO se disponível
    const explicit = config.media.minioPublicBaseUrl?.trim();
    
    if (explicit) {
      const normalized = explicit.replace(/\/$/, '');
      const base = new URL(
        normalized.includes('://') ? normalized : `http://${normalized}`
      );
      const resolvedUrl = `${base.origin}${parsed.pathname}${parsed.search}`;
      return resolvedUrl;
    }

    // Fallback: tentar usar o backend primeiro, se falhar usar MinIO direto
    const api = new URL(config.api.baseUrl);
    
    // Primeiro tentar o backend (proxy): manter URL original se host já está correto
    if (!needsMinioHostRewrite(api.hostname)) {
      return trimmed;
    }
    
    // Se precisar reescrever, tentar backend primeiro
    const backendUrl = `${api.origin}${parsed.pathname}${parsed.search}`;
    return backendUrl;
  } catch (error) {
    console.warn('Error resolving medicine image URL:', error);
    return trimmed;
  }
}