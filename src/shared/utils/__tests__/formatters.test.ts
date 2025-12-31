import { formatDate, formatTime } from '../formatters';

describe('formatters', () => {
  describe('formatDate', () => {
    it('should format date correctly in pt-BR format', () => {
      const testDate = new Date('2023-12-25T10:30:00');
      const result = formatDate(testDate);

      // Check if it follows pt-BR format (dd/mm/yyyy)
      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it('should handle different dates correctly', () => {
      const testDate1 = new Date('2024-01-01T00:00:00');
      const testDate2 = new Date('2024-12-31T23:59:59');

      const result1 = formatDate(testDate1);
      const result2 = formatDate(testDate2);

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result1).not.toBe(result2);
    });
  });

  describe('formatTime', () => {
    it('should format time correctly in pt-BR format', () => {
      const testDate = new Date('2023-12-25T14:30:00');
      const result = formatTime(testDate);

      // Check if it follows HH:MM format
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should handle different times correctly', () => {
      const testDate1 = new Date('2024-01-01T09:15:00');
      const testDate2 = new Date('2024-01-01T21:45:00');

      const result1 = formatTime(testDate1);
      const result2 = formatTime(testDate2);

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result1).not.toBe(result2);
    });

    it('should format midnight correctly', () => {
      const testDate = new Date('2024-01-01T00:00:00');
      const result = formatTime(testDate);

      expect(result).toMatch(/^00:\d{2}$/);
    });
  });
});
