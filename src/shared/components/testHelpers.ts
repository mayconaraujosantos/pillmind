// Shared test helpers to reduce duplication in component tests
// Common test data to reduce duplication
export const TEST_DATA = {
  button: {
    title: 'Click me',
    onPress: jest.fn(),
  },
  input: {
    placeholder: 'Enter text',
    label: 'Email',
    error: 'Invalid email',
  },
  header: {
    userName: 'John Doe',
    userAvatar: 'avatar-url',
  },
} as const;
