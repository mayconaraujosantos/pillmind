# Typography System

Sistema completo de tipografia do PillMind usando Roboto como fonte padrão.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Font Weights](#font-weights)
- [Categorias](#categorias)
  - [Display](#display)
  - [Heading](#heading)
  - [Body](#body)
  - [Button](#button)
  - [Caption](#caption)
- [Como Usar](#como-usar)
- [Exemplos](#exemplos)
- [Diretrizes](#diretrizes)

## 🎯 Visão Geral

O sistema de tipografia está organizado em 5 categorias principais:

1. **Display** - Títulos grandes e de destaque (36-46px)
2. **Heading** - Títulos de seções (14-32px)
3. **Body** - Texto de corpo e parágrafos (12-20px)
4. **Button** - Texto em botões (12-24px)
5. **Caption** - Legendas e metadados (10-12px)

Todas as variantes seguem o padrão:

- **Line height**: 120% (exceto Body XL-Medium: 150%)
- **Letter spacing**: 0
- **Font family**: Roboto

## 🔤 Font Weights

| Weight   | Value | Uso                              |
| -------- | ----- | -------------------------------- |
| Regular  | 400   | Texto de corpo padrão            |
| Medium   | 500   | Ênfase média, botões             |
| Semibold | 600   | Subtítulos, destaques            |
| Bold     | 700   | Títulos principais, ênfase forte |

## 📐 Categorias

### Display

Usado para títulos grandes e de destaque em telas principais.

| Variante  | Tamanho | Weight   | Line Height | Uso Recomendado               |
| --------- | ------- | -------- | ----------- | ----------------------------- |
| Display 1 | 46px    | Semibold | 55.2px      | Splash screens, hero sections |
| Display 2 | 42px    | Semibold | 50.4px      | Títulos principais de páginas |
| Display 3 | 36px    | Semibold | 43.2px      | Subtítulos grandes            |

### Heading

Usado para títulos de seções e hierarquia de conteúdo.

| Variante | Tamanho | Weight   | Line Height | Uso Recomendado            |
| -------- | ------- | -------- | ----------- | -------------------------- |
| H1       | 32px    | Bold     | 38.4px      | Título principal da página |
| H2       | 30px    | Semibold | 36px        | Seções principais          |
| H3       | 24px    | Regular  | 28.8px      | Subseções                  |
| H4       | 20px    | Medium   | 24px        | Títulos de cards           |
| H5       | 18px    | Semibold | 21.6px      | Subtítulos pequenos        |
| H6       | 18px    | Medium   | 21.6px      | Alternativa ao H5          |
| H7       | 16px    | Medium   | 19.2px      | Títulos de listas          |
| H8       | 14px    | Semibold | 16.8px      | Títulos mínimos            |

### Body

Usado para texto de corpo, parágrafos e conteúdo principal.

| Variante          | Tamanho | Weight  | Line Height | Uso Recomendado                           |
| ----------------- | ------- | ------- | ----------- | ----------------------------------------- |
| Body XL Regular   | 20px    | Regular | 24px        | Texto grande, leitura confortável         |
| Body XL Medium    | 16px    | Medium  | 24px        | Texto com ênfase média (150% line height) |
| Body XL Regular 2 | 16px    | Regular | 19.2px      | Texto padrão grande                       |
| Body L Bold       | 14px    | Bold    | 16.8px      | Texto com ênfase forte                    |
| Body L Medium     | 14px    | Medium  | 16.8px      | Texto padrão com ênfase                   |
| Body M Regular    | 14px    | Regular | 16.8px      | Texto padrão                              |
| Body XM Medium    | 12px    | Medium  | 14.4px      | Texto pequeno com ênfase                  |
| Body XM Regular   | 12px    | Regular | 14.4px      | Texto pequeno                             |

### Button

Usado para texto em botões e elementos interativos.

| Variante            | Tamanho | Weight  | Line Height | Uso Recomendado           |
| ------------------- | ------- | ------- | ----------- | ------------------------- |
| Button XL Regular   | 24px    | Regular | 28.8px      | Botões muito grandes      |
| Button XL Medium    | 20px    | Medium  | 24px        | Botões grandes com ênfase |
| Button XL Regular 2 | 20px    | Regular | 24px        | Botões grandes            |
| Button L Medium     | 18px    | Medium  | 21.6px      | Botões médios/grandes     |
| Button L Regular    | 18px    | Regular | 21.6px      | Botões médios             |
| Button M Medium     | 16px    | Medium  | 19.2px      | Botões padrão             |
| Button M Regular    | 16px    | Regular | 19.2px      | Botões padrão light       |
| Button S Medium     | 14px    | Medium  | 16.8px      | Botões pequenos           |
| Button S Regular    | 14px    | Regular | 16.8px      | Botões pequenos light     |
| Button XS Medium    | 12px    | Medium  | 14.4px      | Botões muito pequenos     |
| Button XS Regular   | 12px    | Regular | 14.4px      | Botões mínimos            |

### Caption

Usado para textos pequenos, legendas e metadados.

| Variante  | Tamanho | Weight  | Line Height | Uso Recomendado               |
| --------- | ------- | ------- | ----------- | ----------------------------- |
| Caption L | 12px    | Regular | 14.4px      | Legendas padrão               |
| Caption M | 10px    | Regular | 12px        | Legendas pequenas, timestamps |

## 💻 Como Usar

### Importação

```typescript
import { typography } from '@shared/theme';
```

### Uso Básico em React Native

```typescript
import { Text, StyleSheet } from 'react-native';
import { typography } from '@shared/theme';

function MyComponent() {
  return (
    <>
      <Text style={typography.heading.h1}>Título Principal</Text>
      <Text style={typography.body.mRegular}>
        Este é um parágrafo de texto.
      </Text>
    </>
  );
}
```

### Combinando com Cores

```typescript
import { Text, StyleSheet } from 'react-native';
import { typography, styleGuide } from '@shared/theme';

const styles = StyleSheet.create({
  title: {
    ...typography.heading.h1,
    color: styleGuide.neutral[900],
  },
  subtitle: {
    ...typography.heading.h3,
    color: styleGuide.neutral[600],
  },
  body: {
    ...typography.body.mRegular,
    color: styleGuide.neutral[700],
  },
});
```

### Criando Componentes Tipográficos

```typescript
import React from 'react';
import { Text, TextProps } from 'react-native';
import { typography } from '@shared/theme';

interface HeadingProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7' | 'h8';
}

export const Heading: React.FC<HeadingProps> = ({
  variant = 'h1',
  style,
  ...props
}) => {
  return <Text style={[typography.heading[variant], style]} {...props} />;
};

// Uso
<Heading variant="h2">Meu Título</Heading>;
```

## 📝 Exemplos Práticos

### Tela de Login

```typescript
import { View, Text, StyleSheet } from 'react-native';
import { typography, styleGuide } from '@shared/theme';

const LoginScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Bem-vindo</Text>
    <Text style={styles.subtitle}>Entre com sua conta</Text>
    <Text style={styles.label}>E-mail</Text>
    <Text style={styles.helper}>Digite um e-mail válido</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  title: {
    ...typography.display.display3,
    color: styleGuide.neutral[900],
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body.xlRegular,
    color: styleGuide.neutral[600],
    marginBottom: 32,
  },
  label: {
    ...typography.body.lMedium,
    color: styleGuide.neutral[900],
    marginBottom: 8,
  },
  helper: {
    ...typography.caption.lRegular,
    color: styleGuide.neutral[500],
  },
});
```

### Card de Informação

```typescript
import { View, Text, StyleSheet } from 'react-native';
import { typography, styleGuide } from '@shared/theme';

const InfoCard = () => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Lembrete de Medicamento</Text>
    <Text style={styles.cardBody}>Tome seu medicamento às 14:00</Text>
    <Text style={styles.cardTime}>Há 2 horas</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: styleGuide.neutral[50],
    padding: 16,
    borderRadius: 12,
  },
  cardTitle: {
    ...typography.heading.h5,
    color: styleGuide.neutral[900],
    marginBottom: 8,
  },
  cardBody: {
    ...typography.body.mRegular,
    color: styleGuide.neutral[700],
    marginBottom: 12,
  },
  cardTime: {
    ...typography.caption.lRegular,
    color: styleGuide.neutral[500],
  },
});
```

### Botões

```typescript
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { typography, styleGuide } from '@shared/theme';

const PrimaryButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.primaryButton} onPress={onPress}>
    <Text style={styles.primaryButtonText}>{title}</Text>
  </TouchableOpacity>
);

const SecondaryButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.secondaryButton} onPress={onPress}>
    <Text style={styles.secondaryButtonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: styleGuide.primaryBlue[500],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  primaryButtonText: {
    ...typography.button.mMedium,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: styleGuide.primaryBlue[500],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  secondaryButtonText: {
    ...typography.button.mMedium,
    color: styleGuide.primaryBlue[500],
    textAlign: 'center',
  },
});
```

## ✅ Diretrizes de Uso

### Hierarquia Visual

1. **Use Display** para telas de boas-vindas e hero sections
2. **Use H1-H3** para títulos principais de páginas e seções
3. **Use H4-H8** para títulos de cards, listas e subsecções
4. **Use Body** para todo texto de corpo e parágrafos
5. **Use Button** especificamente para botões
6. **Use Caption** para metadados, timestamps e legendas

### Consistência

- Mantenha a mesma hierarquia de headings em todo o app
- Use Body M Regular como texto padrão
- Use Caption para informações secundárias
- Evite pular níveis de heading (ex: H1 → H3)

### Legibilidade

- Para textos longos, use Body XL Medium (150% line height)
- Use cores de alto contraste para melhor legibilidade
- Evite usar menos de 14px para textos importantes
- Use Caption (10-12px) apenas para informações secundárias

### Acessibilidade

- Garanta contraste mínimo de 4.5:1 para textos normais
- Use tamanhos adequados para usuários com deficiência visual
- Teste a legibilidade em diferentes tamanhos de tela
- Considere usar Body L ou XL para melhor acessibilidade

### Performance

- Evite criar novos objetos de estilo a cada render
- Use StyleSheet.create() para otimização
- Reutilize estilos tipográficos sempre que possível

---

**Última atualização:** Janeiro 2026
**Versão:** 1.0.0
