# Testing Setup Guide

Este diretório contém configurações compartilhadas para testes em todo o projeto.

## Como usar

### 1. **Render Helpers Globais** (em `jest.setup.js`)

Todos os `render` helpers estão disponíveis globalmente sem imports:

#### `renderWithTheme(component)`

```tsx
// Renderiza com ThemeProvider
const { getByText } = renderWithTheme(<MyComponent />);
```

#### `renderWithProviders(component)`

```tsx
// Renderiza com ThemeProvider + AuthProvider (mais comum)
const { getByText } = renderWithProviders(<MyComponent />);
```

#### `renderWithCustomProviders(component, providers)`

```tsx
// Renderiza com providers customizados
const { getByText } = renderWithCustomProviders(<MyComponent />, [
  (children) => <ThemeProvider>{children}</ThemeProvider>,
  (children) => <AuthProvider>{children}</AuthProvider>,
  (children) => <OtherProvider>{children}</OtherProvider>,
]);
```

### 2. **Mocks Comuns** (em `mocks.ts`)

Importar de `src/shared/testing/mocks.ts`:

```tsx
import {
  createMockUseAuth,
  createMockUseTranslation,
  createMockUseOnboardingScroll,
  createMockAuthResponse,
  createMockError,
} from 'src/shared/testing/mocks';
```

#### Exemplo completo:

```tsx
// ❌ ANTES (repetido em vários arquivos)
jest.mock('@features/onboarding/presentation/hooks/useAuth', () => ({
  useAuth: jest.fn(() => ({
    logout: jest.fn(() => ({ success: true })),
    signIn: jest.fn(),
    signUp: jest.fn(),
    loading: false,
    error: null,
  })),
}));

// ✅ DEPOIS
jest.mock('@features/onboarding/presentation/hooks/useAuth', () => ({
  useAuth: jest.fn(() => createMockUseAuth()),
}));

// Ou com customizações:
jest.mock('@features/onboarding/presentation/hooks/useAuth', () => ({
  useAuth: jest.fn(() =>
    createMockUseAuth({
      loading: true,
      error: 'Custom error',
    })
  ),
}));
```

## Mocks Globais Automáticos

Os seguintes mocks já estão configurados globalmente (sem necessidade de setup em cada arquivo):

- ✅ `@react-native-async-storage/async-storage` - Mock completo
- ✅ `react-native/Libraries/Utilities/useColorScheme` - Retorna 'light'
- ✅ `react-native/Libraries/Utilities/Appearance` - Mock completo
- ✅ `react-native-safe-area-context` - SafeAreaProvider e useSafeAreaInsets
- ✅ `@testing-library/jest-native` - Matchers estendidos

## Exemplos de Refatoração

### Exemplo 1: OnboardingContainer.test.tsx

**Antes:**

```tsx
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaProvider: ({ children }) =>
      React.createElement(React.Fragment, null, children),
    useSafeAreaInsets: () => ({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }),
  };
});

jest.mock('../../hooks/useOnboardingScroll', () => ({
  useOnboardingScroll: jest.fn(() => ({
    currentStep: 0,
    handleScroll: jest.fn(),
  })),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <WithThemeProvider>
      <AuthProvider>{component}</AuthProvider>
    </WithThemeProvider>
  );
};
```

**Depois:**

```tsx
import { createMockUseOnboardingScroll } from 'src/__tests__/setup/mocks';

jest.mock('../../hooks/useOnboardingScroll', () => ({
  useOnboardingScroll: jest.fn(() => createMockUseOnboardingScroll()),
}));

// Usar renderWithProviders globalmente - sem definir localmente!
```

### Exemplo 2: AccountScreen.test.tsx

**Antes:**

```tsx
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaProvider: ({ children }) =>
      React.createElement(React.Fragment, null, children),
    useSafeAreaInsets: () => ({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }),
  };
});

jest.mock('@features/onboarding/presentation/hooks/useAuth', () => ({
  useAuth: jest.fn(() => ({
    logout: jest.fn(() => ({ success: true })),
    signIn: jest.fn(),
    signUp: jest.fn(),
    loading: false,
    error: null,
  })),
}));

jest.mock('@shared/i18n', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'account.title': 'Profile',
        // ... muitas linhas
      };
      return translations[key];
    },
  })),
}));
```

**Depois:**

```tsx
import {
  createMockUseAuth,
  createMockUseTranslation,
} from 'src/__tests__/setup/mocks';

jest.mock('@features/onboarding/presentation/hooks/useAuth', () => ({
  useAuth: jest.fn(() => createMockUseAuth()),
}));

jest.mock('@shared/i18n', createMockUseTranslation());
```

## Benefícios

✅ **DRY Principle**: Não repetir código de mock em vários arquivos
✅ **Manutenibilidade**: Atualizar mock em um único lugar
✅ **Consistência**: Todos os testes usam mesma estrutura
✅ **Legibilidade**: Código de teste mais limpo e focado no teste em si
✅ **Documentação**: Helpers nomeados documentam sua intenção

## Adicionar novos Mocks

1. Edite `src/__tests__/setup/mocks.ts`
2. Adicione função `createMock<Name>` seguindo padrão existente
3. Exporte a função
4. Use em seus testes

Exemplo:

```tsx
export const createMockMediaRecorder = (overrides = {}) => ({
  start: jest.fn(),
  stop: jest.fn(),
  ondataavailable: jest.fn(),
  ...overrides,
});
```
