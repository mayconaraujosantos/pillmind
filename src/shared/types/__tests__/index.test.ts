import type { Nullable, Optional } from '../index';

describe('Shared Types', () => {
  describe('Nullable<T>', () => {
    it('should allow null values', () => {
      const nullableString: Nullable<string> = null;
      const nullableNumber: Nullable<number> = null;

      expect(nullableString).toBeNull();
      expect(nullableNumber).toBeNull();
    });

    it('should allow defined values', () => {
      const nullableString: Nullable<string> = 'test';
      const nullableNumber: Nullable<number> = 42;

      expect(nullableString).toBe('test');
      expect(nullableNumber).toBe(42);
    });

    it('should work with complex types', () => {
      interface TestObject {
        id: number;
        name: string;
      }

      const nullableObject: Nullable<TestObject> = null;
      const definedObject: Nullable<TestObject> = { id: 1, name: 'test' };

      expect(nullableObject).toBeNull();
      expect(definedObject).toEqual({ id: 1, name: 'test' });
    });
  });

  describe('Optional<T>', () => {
    it('should allow undefined values', () => {
      const optionalString: Optional<string> = undefined;
      const optionalNumber: Optional<number> = undefined;

      expect(optionalString).toBeUndefined();
      expect(optionalNumber).toBeUndefined();
    });

    it('should allow defined values', () => {
      const optionalString: Optional<string> = 'test';
      const optionalNumber: Optional<number> = 42;

      expect(optionalString).toBe('test');
      expect(optionalNumber).toBe(42);
    });

    it('should work with complex types', () => {
      interface TestObject {
        id: number;
        name: string;
      }

      const optionalObject: Optional<TestObject> = undefined;
      const definedObject: Optional<TestObject> = { id: 1, name: 'test' };

      expect(optionalObject).toBeUndefined();
      expect(definedObject).toEqual({ id: 1, name: 'test' });
    });
  });

  describe('Type combinations', () => {
    it('should work with nested nullable and optional types', () => {
      type ComplexType = Optional<Nullable<string>>;

      const undefinedValue: ComplexType = undefined;
      const nullValue: ComplexType = null;
      const stringValue: ComplexType = 'test';

      expect(undefinedValue).toBeUndefined();
      expect(nullValue).toBeNull();
      expect(stringValue).toBe('test');
    });
  });
});
