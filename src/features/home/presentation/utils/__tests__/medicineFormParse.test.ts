import {
  normalizeTimeToken,
  parseDoseTimesField,
  parseISODateOnly,
  formatDateInput,
} from '../medicineFormParse';

describe('medicineFormParse', () => {
  it('normalizes time tokens', () => {
    expect(normalizeTimeToken('8:00')).toBe('08:00');
    expect(normalizeTimeToken('23:59')).toBe('23:59');
    expect(normalizeTimeToken('25:00')).toBeNull();
    expect(normalizeTimeToken('bad')).toBeNull();
  });

  it('parses dose times field', () => {
    expect(parseDoseTimesField('08:00, 20:00')).toEqual(['08:00', '20:00']);
    expect(parseDoseTimesField('8:00; 9:30')).toEqual(['08:00', '09:30']);
    expect(parseDoseTimesField('')).toEqual([]);
  });

  it('parses ISO date only', () => {
    const d = parseISODateOnly('2024-06-15');
    expect(d).not.toBeNull();
    expect(d!.getFullYear()).toBe(2024);
    expect(parseISODateOnly('not-a-date')).toBeNull();
  });

  it('formats date for input', () => {
    expect(formatDateInput(new Date(2024, 5, 7))).toBe('2024-06-07');
  });
});
