# 🤝 Contributing to Onboarding Feature

> Guia para contribuir de forma profissional com o sistema de onboarding

## 📋 Overview

Este guia estabelece padrões e convenções para manter a qualidade profissional do código do onboarding.

## 🎯 Princípios de Design

### Clean Architecture

- **domain/**: Regras de negócio puras
- **presentation/**: UI e lógica de apresentação
- **Sem dependências circulares**

### Code Style

- **TypeScript Strict**: Tipos explícitos sempre
- **Functional Components**: React.FC<Props> ou function Component()
- **Custom Hooks**: Para lógica complexa reutilizável
- **Immutability**: Evitar mutação de objetos

## 🛠️ Adicionando Componentes

### 1. Estrutura de Arquivo

```typescript
// src/features/onboarding/presentation/components/MyNewComponent.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';
import { getOnboardingColors } from '../constants/onboarding.constants';

interface MyNewComponentProps {
  /**
   * Propriedade obrigatória bem documentada
   */
  requiredProp: string;

  /**
   * Propriedade opcional com valor padrão
   * @default false
   */
  optionalProp?: boolean;

  /**
   * Callback para interação
   */
  onAction?: (value: string) => void;
}

/**
 * Componente para [descrever funcionalidade]
 *
 * @example
 * <MyNewComponent
 *   requiredProp="value"
 *   onAction={(value) => console.log(value)}
 * />
 */
export const MyNewComponent: React.FC<MyNewComponentProps> = ({
  requiredProp,
  optionalProp = false,
  onAction
}) => {
  const theme = useColorScheme();
  const colors = getOnboardingColors(theme);

  return (
    <View style={styles.container}>
      {/* Implementação */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Usar adaptiveSpacing quando possível
  },
});
```

### 2. Exportar no Index

```typescript
// src/features/onboarding/presentation/components/index.ts
export { MyNewComponent } from './MyNewComponent';
```

### 3. Adicionar Testes

```typescript
// src/features/onboarding/presentation/components/__tests__/MyNewComponent.test.tsx

import { render, fireEvent } from '@testing-library/react-native';
import { MyNewComponent } from '../MyNewComponent';

describe('MyNewComponent', () => {
  it('should render correctly with required props', () => {
    const { getByText } = render(
      <MyNewComponent requiredProp="test" />
    );

    expect(getByText('test')).toBeDefined();
  });

  it('should call onAction when interacted', () => {
    const mockAction = jest.fn();

    const { getByTestId } = render(
      <MyNewComponent
        requiredProp="test"
        onAction={mockAction}
      />
    );

    fireEvent.press(getByTestId('action-button'));
    expect(mockAction).toHaveBeenCalledWith('expected-value');
  });
});
```

## 🪝 Adicionando Custom Hooks

### 1. Estrutura de Hook

```typescript
// src/features/onboarding/presentation/hooks/useMyNewHook.ts

import { useState, useCallback, useEffect } from 'react';
import { logger } from '@shared/utils/logger';
import { TIMING_CONSTANTS } from '../constants/storage.constants';

interface UseMyNewHookOptions {
  autoStart?: boolean;
  timeout?: number;
}

interface UseMyNewHookResult {
  data: DataType | null;
  loading: boolean;
  error: string | null;
  execute: () => Promise<void>;
  reset: () => void;
}

/**
 * Hook para [descrever funcionalidade]
 *
 * @param options - Opções de configuração
 * @returns Estado e funções para controle
 *
 * @example
 * const { data, loading, execute } = useMyNewHook({
 *   autoStart: true,
 *   timeout: 5000
 * });
 */
export const useMyNewHook = (
  options: UseMyNewHookOptions = {}
): UseMyNewHookResult => {
  const { autoStart = false, timeout = TIMING_CONSTANTS.AUTH_TIMEOUT } =
    options;

  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      logger.debug('useMyNewHook', 'Starting execution');

      // Implementação
      const result = await performOperation();

      setData(result);
      logger.info('useMyNewHook', 'Execution successful');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      logger.error('useMyNewHook', 'Execution failed', { error: errorMessage });
    } finally {
      setLoading(false);
    }
  }, [loading, timeout]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (autoStart) {
      execute();
    }
  }, [autoStart, execute]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};
```

### 2. Testes de Hook

```typescript
// src/features/onboarding/presentation/hooks/__tests__/useMyNewHook.test.ts

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useMyNewHook } from '../useMyNewHook';

describe('useMyNewHook', () => {
  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useMyNewHook());

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should execute operation successfully', async () => {
    const { result } = renderHook(() => useMyNewHook());

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeDefined();
    expect(result.current.error).toBeNull();
  });
});
```

## 🔧 Modificando Componentes Existentes

### 1. Backwards Compatibility

- ✅ **Sempre** mantenha compatibilidade com props existentes
- ✅ Use propriedades opcionais para novas funcionalidades
- ✅ Deprecate em vez de remover imediatamente

```typescript
interface ComponentProps {
  // ✅ Prop existente - manter
  existingProp: string;

  // ✅ Nova prop opcional
  newOptionalProp?: boolean;

  /**
   * @deprecated Use `newOptionalProp` instead. Will be removed in v2.0.0
   */
  oldProp?: boolean;
}
```

### 2. Testes de Regressão

- ✅ Execute **TODOS** os testes existentes
- ✅ Adicione testes para nova funcionalidade
- ✅ Teste com diferentes combinações de props

```bash
# Executar testes do componente específico
npm test -- MyComponent.test.tsx

# Executar todos os testes relacionados
npm test -- src/features/onboarding/presentation/components
```

## ✨ Boas Práticas

### Performance

```typescript
// ✅ Use useMemo para cálculos caros
const expendiveValue = useMemo(() => {
  return performHeavyCalculation(data);
}, [data]);

// ✅ Use useCallback para funções passadas como props
const handlePress = useCallback(
  (value: string) => {
    onPress?.(value);
  },
  [onPress]
);

// ✅ Use React.memo para componentes puros
export const PureComponent = React.memo<Props>(({ prop1, prop2 }) => {
  // Implementação
});
```

### Error Handling

```typescript
import { createError, formatErrorMessage } from '../utils/onboarding.utils';

try {
  await riskyOperation();
} catch (error) {
  // ✅ Use error utilities
  const formattedError = formatErrorMessage(error);
  const structuredError = createError(
    'OPERATION_FAILED',
    formattedError,
    { originalError: error },
    true // retryable
  );

  logger.error('ComponentName', 'Operation failed', { error: structuredError });
}
```

### Accessibility

```typescript
// ✅ Sempre adicione propriedades de acessibilidade
<TouchableOpacity
  accessibilityRole="button"
  accessibilityLabel="Botão para criar conta"
  accessibilityHint="Toque para abrir o formulário de registro"
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
>
  <Text>Criar Conta</Text>
</TouchableOpacity>
```

### Logging

```typescript
import { logger } from '@shared/utils/logger';

// ✅ Use logging estruturado
logger.debug('ComponentName', 'User interaction', {
  action: 'button_press',
  buttonId: 'signup',
  userId: user?.id,
});

logger.info('ComponentName', 'Operation completed', {
  duration: Date.now() - startTime,
  result: 'success',
});

logger.error('ComponentName', 'Operation failed', {
  error: errorMessage,
  context: { userId, formData },
});
```

## 📊 Validação e Types

### Usar Tipos Centralizados

```typescript
// ✅ Import de types.ts
import { OnboardingPhase, AuthMethod, ErrorResponse } from '../../types';

// ❌ Não redefina tipos já existentes
interface LocalAuthResponse { ... } // Evite isso
```

### Validação de Dados

```typescript
import { validateSignUpForm, validateEmail } from '../utils/onboarding.utils';

// ✅ Use funções de validação centralizadas
const validation = validateSignUpForm({ email, password, name });

if (!validation.isValid) {
  setErrors(validation.errors);
  return;
}
```

## 🧪 Testes

### Conventions

```typescript
describe('ComponentName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when renderizando', () => {
    it('should display required elements', () => {
      // Teste básico de renderização
    });

    it('should apply correct styles for dark theme', () => {
      // Teste de tema
    });
  });

  describe('when interacting', () => {
    it('should call callback on button press', () => {
      // Teste de interação
    });

    it('should handle loading state correctly', () => {
      // Teste de estado
    });
  });

  describe('when error occurs', () => {
    it('should display error message', () => {
      // Teste de error handling
    });
  });
});
```

### Test Data

```typescript
// ✅ Use constantes de teste
import {
  TEST_DATA,
  MOCK_AUTH_RESPONSE,
} from '../../../__tests__/test-constants';

// ✅ Não hard-code dados
const mockUser = TEST_DATA;
const mockResponse = MOCK_AUTH_RESPONSE;
```

## 📝 Documentação

### JSDoc Comments

````typescript
/**
 * Descrição concisa do componente/hook
 *
 * @param prop1 - Descrição da prop obrigatória
 * @param prop2 - Descrição da prop opcional
 * @returns O que o hook/função retorna
 *
 * @example
 * ```tsx
 * <Component
 *   prop1="value"
 *   prop2={false}
 *   onAction={(data) => console.log(data)}
 * />
 * ```
 *
 * @see {@link RelatedComponent} - Link para componente relacionado
 * @since 1.0.0
 */
````

## 🚀 Checklist de PR

Antes de submeter um Pull Request:

- [ ] ✅ **Testes**: Todos os testes passando
- [ ] ✅ **Lint**: Sem erros de ESLint
- [ ] ✅ **Types**: TypeScript sem erros
- [ ] ✅ **Performance**: Verificado com React DevTools
- [ ] ✅ **Accessibility**: Testado com TalkBack/VoiceOver
- [ ] ✅ **Responsive**: Testado em phone/tablet/landscape
- [ ] ✅ **Documentation**: README atualizado se necessário
- [ ] ✅ **Breaking Changes**: Documentadas e justificadas

---

## 🎯 Code Review

### O que Reviewers Verificam

1. **Architecture**: Segue Clean Architecture?
2. **Performance**: Usa memoization quando apropriado?
3. **Type Safety**: TypeScript strict sem any?
4. **Test Coverage**: Cenários principais cobertos?
5. **Accessibility**: Labels e roles corretos?
6. **Error Handling**: Trata erros apropriadamente?
7. **Logging**: Logs estruturados e úteis?
8. **Documentation**: JSDoc e README atualizados?

### Exemplo de Bom Feedback

````
🔍 **Performance**: Considere usar `useMemo` na linha 45 para evitar recálculo desnecessário.

💡 **Sugestão**:
```typescript
const colors = useMemo(() => getOnboardingColors(theme), [theme]);
````

📚 **Docs**: Adicionar exemplo de uso no JSDoc seria útil para futuros desenvolvedores.

```

---

> 💡 **Dúvidas?** Consulte exemplos nos componentes existentes ou abra uma discussion no repo.
```
