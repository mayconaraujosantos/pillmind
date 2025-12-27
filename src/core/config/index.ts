// Application configuration
export const config = {
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.pillmind.com',
    timeout: 30000,
  },
  app: {
    name: 'PillMind',
    version: '1.0.0',
  },
};
