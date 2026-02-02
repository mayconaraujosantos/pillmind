import { expectKeys } from '../testUtils';

describe('testUtils', () => {
  it('should validate expected keys', () => {
    expect(() => expectKeys(['a', 'b'], ['a'])).not.toThrow();
  });
});
