# Sistema de Temas do PillMind

## Visão Geral

O PillMind implementa um sistema completo de temas que permite aos usuários escolherem entre três modos de aparência:

- **Automático**: Segue a configuração do sistema operacional
- **Claro**: Sempre usa o tema claro
- **Escuro**: Sempre usa o tema escuro

## Estrutura

```
src/shared/theme/
├── index.ts                 # Exportações públicas
├── types.ts                 # Tipos TypeScript
├── colors.ts                # Definição de cores
├── ThemeContext.tsx         # Context Provider
├── useTheme.ts              # Hook customizado
└── __tests__/
    └── ThemeContext.test.tsx
```

## Como Usar

### 1. Usar o Hook `useTheme`

```tsx
import { useTheme } from '@/shared/theme';

const MyComponent = () => {
  const { theme, themeMode, isDark, setThemeMode, toggleTheme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Olá Mundo!</Text>
    </View>
  );
};
```

### 2. Acessar Valores do Tema

O objeto `theme` contém:

#### Cores (`theme.colors`)

- `primary`: Cor primária do app
- `secondary`: Cor secundária
- `background`: Cor de fundo principal
- `surface`: Cor de superfícies (cards, modais)
- `text`: Cor do texto principal
- `textSecondary`: Cor do texto secundário
- `border`: Cor de bordas
- `error`: Cor de erro
- `success`: Cor de sucesso
- `warning`: Cor de aviso
- `info`: Cor de informação
- `disabled`: Cor de elementos desabilitados
- `placeholder`: Cor de placeholders

#### Espaçamento (`theme.spacing`)

- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `xxl`: 48px

#### Border Radius (`theme.borderRadius`)

- `sm`: 4px
- `md`: 8px
- `lg`: 12px
- `xl`: 16px
- `full`: 9999px (totalmente arredondado)

#### Tamanhos de Fonte (`theme.fontSize`)

- `xs`: 12px
- `sm`: 14px
- `md`: 16px
- `lg`: 18px
- `xl`: 20px
- `xxl`: 24px

#### Pesos de Fonte (`theme.fontWeight`)

- `regular`: '400'
- `medium`: '500'
- `semibold`: '600'
- `bold`: '700'

### 3. Mudar o Tema

```tsx
import { useTheme } from '@/shared/theme';

const Settings = () => {
  const { themeMode, setThemeMode, toggleTheme } = useTheme();

  return (
    <>
      <Button onPress={() => setThemeMode('light')}>Tema Claro</Button>

      <Button onPress={() => setThemeMode('dark')}>Tema Escuro</Button>

      <Button onPress={() => setThemeMode('automatic')}>Automático</Button>

      <Button onPress={toggleTheme}>Alternar Tema</Button>
    </>
  );
};
```

### 4. Usar o Componente `ThemeSelector`

```tsx
import { ThemeSelector } from '@/shared/components';

const SettingsScreen = () => {
  return (
    <View>
      <ThemeSelector />
    </View>
  );
};
```

## Características

### Persistência

O tema selecionado é automaticamente salvo no AsyncStorage e restaurado quando o app é reaberto.

### Detecção Automática

Quando o modo "Automático" está ativo, o tema segue a configuração do sistema operacional.

### TypeScript

Totalmente tipado para autocompletar e type-safety.

### Testes

Inclui testes unitários completos para garantir o funcionamento correto.

## Cores do Tema

### Tema Claro

- Primary: `#007AFF`
- Background: `#FFFFFF`
- Surface: `#F2F2F7`
- Text: `#000000`

### Tema Escuro

- Primary: `#0A84FF`
- Background: `#000000`
- Surface: `#1C1C1E`
- Text: `#FFFFFF`

## Exemplo Completo

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/shared/theme';

const ExampleScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Exemplo de Tema
        </Text>

        <Text
          style={[styles.description, { color: theme.colors.textSecondary }]}
        >
          Este card adapta-se ao tema {isDark ? 'escuro' : 'claro'}
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={toggleTheme}
        >
          <Text style={styles.buttonText}>Alternar Tema</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ExampleScreen;
```

## Testes

Execute os testes com:

```bash
npm test -- src/shared/theme/__tests__
```

## Boas Práticas

1. **Sempre use `theme.colors`** ao invés de cores hardcoded
2. **Use os valores de spacing** para consistência
3. **Teste ambos os temas** ao desenvolver novos componentes
4. **Não misture estilos inline com StyleSheet** sem necessidade
5. **Use o hook `useTheme`** em todo componente que precise de estilos adaptativos

## Roadmap

- [ ] Adicionar mais variações de cores (accent, highlight)
- [ ] Suporte para temas personalizados
- [ ] Transições animadas entre temas
- [ ] Modo de alto contraste
- [ ] Persistência de temas por usuário
