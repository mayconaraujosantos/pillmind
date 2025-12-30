import { isValidEmail, isValidPhone } from '../validators';

describe('validators', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.email@domain.org',
        'user.name+tag@example.co.uk',
        'x@y.z',
        'test123@domain123.com',
      ];

      validEmails.forEach((email) => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid',
        'user@',
        '@domain.com',
        'user.domain.com',
        'user@domain',
        'user space@domain.com',
        'user@@domain.com',
        '',
      ];

      invalidEmails.forEach((email) => {
        expect(isValidEmail(email)).toBe(false);
      });
    });

    it('should handle edge cases', () => {
      expect(isValidEmail(' user@domain.com ')).toBe(false); // spaces
      expect(isValidEmail('user@domain..com')).toBe(false); // double dots
      expect(isValidEmail('a@b.c')).toBe(true); // minimal valid email
    });
  });

  describe('isValidPhone', () => {
    it('should validate correct phone numbers', () => {
      const validPhones = [
        '1234567890', // 10 digits
        '12345678901', // 11 digits
        '(11) 99999-9999', // formatted
        '11 99999-9999', // formatted with space
        '11999999999', // 11 digits no formatting
      ];

      validPhones.forEach((phone) => {
        expect(isValidPhone(phone)).toBe(true);
      });
    });

    it('should reject invalid phone numbers', () => {
      const invalidPhones = [
        '123456789', // 9 digits (too short)
        '123456789012', // 12 digits (too long)
        'abcd567890', // letters
        '123-456-7890-1', // too long with formatting
        '', // empty
        '123', // too short
      ];

      invalidPhones.forEach((phone) => {
        expect(isValidPhone(phone)).toBe(false);
      });
    });

    it('should handle formatted phone numbers correctly', () => {
      expect(isValidPhone('(11) 9 9999-9999')).toBe(true);
      expect(isValidPhone('+55 11 99999-9999')).toBe(true);
      expect(isValidPhone('11-99999-9999')).toBe(true);
    });
  });
});
