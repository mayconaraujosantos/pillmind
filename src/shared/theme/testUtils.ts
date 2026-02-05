export const expectKeys = (keys: string[], expected: string[]): void => {
  expected.forEach((key) => {
    expect(keys).toContain(key);
  });
};
