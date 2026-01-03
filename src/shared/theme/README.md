# Theme System - PillMind

Sistema completo de design do PillMind, incluindo cores, tipografia e componentes estilizados.

## 📚 Documentação

### 🎨 Cores

- **Arquivo**: [styleGuide.ts](styleGuide.ts)
- **Documentação**: [STYLE_GUIDE.md](../../doc/STYLE_GUIDE.md)
- **Exemplos**: [styleGuide.examples.ts](styleGuide.examples.ts)
- **Testes**: [**tests**/styleGuide.test.ts](__tests__/styleGuide.test.ts)

### 🔤 Tipografia

- **Arquivo**: [typography.ts](typography.ts)
- **Documentação**: [TYPOGRAPHY.md](../../doc/TYPOGRAPHY.md)
- **Exemplos**: [typography.examples.ts](typography.examples.ts)
- **Testes**: [**tests**/typography.test.ts](__tests__/typography.test.ts)

### 🎭 Temas

- **Context**: [ThemeContext.tsx](ThemeContext.tsx)
- **Hook**: [useTheme.ts](useTheme.ts)
- **Cores**: [colors.ts](colors.ts)
- **Tipos**: [types.ts](types.ts)

## 🚀 Como Usar

### Importação Básica

```typescript
import { typography, styleGuide, useTheme } from '@shared/theme';
```

### Exemplo: Componente com Tipografia e Cores

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { typography, styleGuide } from '@shared/theme';

const MyComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Título Principal</Text>
      <Text style={styles.body}>Este é um parágrafo de texto.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: styleGuide.neutral[50],
  },
  title: {
    ...typography.heading.h1,
    color: styleGuide.neutral[900],
    marginBottom: 8,
  },
  body: {
    ...typography.body.mRegular,
    color: styleGuide.neutral[700],
  },
});

export default MyComponent;
```

### Exemplo: Usando Theme Context

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@shared/theme';

const ThemedComponent = () => {
  const { colors, isDark } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>
        Tema atual: {isDark ? 'Escuro' : 'Claro'}
      </Text>
    </View>
  );
};
```

## 📦 Estrutura de Arquivos

```
theme/
├── README.md                      # Este arquivo
├── index.ts                       # Exportações principais
├── colors.ts                      # Cores dos temas light/dark
├── styleGuide.ts                  # Sistema de cores completo
├── styleGuide.examples.ts         # Exemplos de uso de cores
├── typography.ts                  # Sistema de tipografia
├── typography.examples.ts         # Exemplos de uso de tipografia
├── ThemeContext.tsx               # Context do tema
├── useTheme.ts                    # Hook para usar o tema
├── types.ts                       # Tipos TypeScript
└── __tests__/
    ├── ThemeContext.test.tsx
    ├── styleGuide.test.ts
    └── typography.test.ts
```

## 🎨 Paletas de Cores

### Primary Blue

```typescript
styleGuide.primaryBlue[500]; // #1256DB - Cor principal
```

### Neutral

```typescript
styleGuide.neutral[900]; // #151515 - Texto escuro
styleGuide.neutral[50]; // #F2F2F2 - Background claro
```

### Status Colors

```typescript
styleGuide.success[500]; // #009E00
styleGuide.error[500]; // #DC0000
styleGuide.warning[500]; // #F6B500
styleGuide.info[500]; // #007BAF
```

## 🔤 Variantes de Tipografia

### Display (Títulos Grandes)

```typescript
typography.display.display1; // 46px, Semibold
typography.display.display2; // 42px, Semibold
typography.display.display3; // 36px, Semibold
```

### Heading (Títulos)

```typescript
typography.heading.h1; // 32px, Bold
typography.heading.h2; // 30px, Semibold
typography.heading.h3; // 24px, Regular
// ... h4 até h8
```

### Body (Texto de Corpo)

```typescript
typography.body.xlRegular; // 20px, Regular
typography.body.xlMedium; // 16px, Medium (150% line height)
typography.body.mRegular; // 14px, Regular
typography.body.xmRegular; // 12px, Regular
```

### Button (Botões)

```typescript
typography.button.lMedium; // 18px, Medium
typography.button.mMedium; // 16px, Medium
typography.button.sMedium; // 14px, Medium
```

### Caption (Legendas)

```typescript
typography.caption.lRegular; // 12px, Regular
typography.caption.mRegular; // 10px, Regular
```

## ✅ Boas Práticas

### Cores

1. Use sempre as cores do `styleGuide` ao invés de valores hardcoded
2. Mantenha contraste adequado para acessibilidade (mínimo 4.5:1)
3. Use a cor base (500) como ponto de partida
4. Use tons mais claros para backgrounds e hover states
5. Use tons mais escuros para pressed states

### Tipografia

1. Use a hierarquia correta de headings (h1 → h2 → h3...)
2. Body M Regular como texto padrão
3. Body XL Medium para textos longos (melhor legibilidade)
4. Caption apenas para informações secundárias
5. Use os estilos de botão especificamente para botões

### Theme

1. Sempre use o `useTheme` hook para acessar cores do tema
2. Teste seu componente em ambos os temas (light/dark)
3. Evite cores hardcoded que não se adaptam ao tema

## 🧪 Testes

Todos os componentes do sistema de design possuem testes completos:

```bash
npm test -- theme
```

- ✅ 239 testes passando
- ✅ Cobertura completa de cores
- ✅ Cobertura completa de tipografia
- ✅ Testes de integração com temas

## 📖 Documentação Adicional

- [Style Guide Completo](../../doc/STYLE_GUIDE.md) - Documentação detalhada de cores
- [Typography Guide](../../doc/TYPOGRAPHY.md) - Documentação detalhada de tipografia
- [Theme System](../../doc/THEME_SYSTEM.md) - Sistema de temas light/dark

## 🔄 Atualizações

**Versão:** 1.0.0
**Última atualização:** Janeiro 2026

---

Para mais informações ou sugestões, consulte a documentação completa ou entre em contato com a equipe de design.
