// Application configuration
export const config = {
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.pillmind.com',
    timeout: 30000,
  },
  nodeRed: {
    host: process.env.EXPO_PUBLIC_NODERED_HOST || '192.168.1.13',
    port: process.env.EXPO_PUBLIC_NODERED_PORT || '1880',
    authUrl: process.env.EXPO_PUBLIC_NODERED_AUTH_URL || 'http://192.168.1.13:1880/api/auth',
  },
  app: {
    name: process.env.EXPO_PUBLIC_APP_NAME || 'PillMind',
    version: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
  },
  development: {
    logLevel: process.env.EXPO_PUBLIC_LOG_LEVEL || 'info',
  },
};
