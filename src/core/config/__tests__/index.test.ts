import { config } from '../index';

describe('config', () => {
  it('should have correct structure', () => {
    expect(config).toBeDefined();
    expect(config.api).toBeDefined();
    expect(config.app).toBeDefined();
  });

  describe('api configuration', () => {
    it('should have baseUrl and timeout', () => {
      expect(config.api.baseUrl).toBeDefined();
      expect(config.api.timeout).toBe(30000);
      expect(typeof config.api.baseUrl).toBe('string');
      expect(typeof config.api.timeout).toBe('number');
    });

    it('should have valid baseUrl format', () => {
      expect(config.api.baseUrl).toMatch(/^https?:\/\/.+/);
    });

    it('should use environment variable or fallback', () => {
      // Should either be from env var or the fallback URL
      expect(
        config.api.baseUrl === process.env.EXPO_PUBLIC_API_URL ||
          config.api.baseUrl === 'https://api.pillmind.com'
      ).toBe(true);
    });
  });

  describe('app configuration', () => {
    it('should have name and version', () => {
      expect(config.app.name).toBe('PillMind');
      expect(config.app.version).toBe('1.0.0');
    });

    it('should have string values', () => {
      expect(typeof config.app.name).toBe('string');
      expect(typeof config.app.version).toBe('string');
    });
  });
});
