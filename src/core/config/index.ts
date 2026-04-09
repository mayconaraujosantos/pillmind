const parsePort = (raw: string | undefined, fallback: number): number => {
  if (raw == null || raw === '') {
    return fallback;
  }
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

// Application configuration
export const config = {
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.pillmind.com',
    timeout: 30000,
  },
  /**
   * URL pública do MinIO como no backend (MINIO_PUBLIC_BASE_URL), ex. http://192.168.1.7:9000/pillmind
   * Opcional: se vazio, em IPs privados o app deduz o host a partir de EXPO_PUBLIC_API_URL e a porta MinIO.
   */
  media: {
    minioPublicBaseUrl: process.env.EXPO_PUBLIC_MINIO_PUBLIC_BASE_URL || '',
    minioInferredPort: parsePort(process.env.EXPO_PUBLIC_MINIO_PORT, 9000),
  },
  nodeRed: {
    host: process.env.EXPO_PUBLIC_NODERED_HOST || '192.168.1.13',
    port: process.env.EXPO_PUBLIC_NODERED_PORT || '1880',
    authUrl:
      process.env.EXPO_PUBLIC_NODERED_AUTH_URL ||
      'http://192.168.1.13:1880/api/auth',
  },
  app: {
    name: process.env.EXPO_PUBLIC_APP_NAME || 'PillMind',
    version: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
  },
  development: {
    logLevel: process.env.EXPO_PUBLIC_LOG_LEVEL || 'info',
  },
  /** Links legais (opcional). Usados em Perfil → Privacidade / Sobre. */
  legal: {
    privacyPolicyUrl: process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL?.trim() || '',
    termsUrl: process.env.EXPO_PUBLIC_TERMS_URL?.trim() || '',
    websiteUrl: process.env.EXPO_PUBLIC_WEBSITE_URL?.trim() || '',
  },
};
