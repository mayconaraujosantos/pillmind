import { APP_NAME, APP_VERSION } from '../index';

describe('Shared Constants', () => {
  describe('APP_NAME', () => {
    it('should have correct value', () => {
      expect(APP_NAME).toBe('PillMind');
    });

    it('should be a string', () => {
      expect(typeof APP_NAME).toBe('string');
    });

    it('should not be empty', () => {
      expect(APP_NAME.length).toBeGreaterThan(0);
    });
  });

  describe('APP_VERSION', () => {
    it('should have correct value', () => {
      expect(APP_VERSION).toBe('1.0.0');
    });

    it('should be a string', () => {
      expect(typeof APP_VERSION).toBe('string');
    });

    it('should follow semantic versioning format', () => {
      const semverRegex = /^\d+\.\d+\.\d+$/;
      expect(APP_VERSION).toMatch(semverRegex);
    });

    it('should not be empty', () => {
      expect(APP_VERSION.length).toBeGreaterThan(0);
    });
  });

  describe('Constants integrity', () => {
    it('should export all expected constants', () => {
      expect(APP_NAME).toBeDefined();
      expect(APP_VERSION).toBeDefined();
    });

    it('should have consistent app name across constants', () => {
      expect(APP_NAME).toEqual('PillMind');
    });
  });
});
