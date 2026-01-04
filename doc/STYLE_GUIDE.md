# Style Guide - Sistema de Design

Este documento descreve o sistema de design do PillMind, incluindo cores e tipografia.

## 📋 Índice

- [Sistema de Cores](#sistema-de-cores)
- [Sistema de Tipografia](#sistema-de-tipografia)
- [Estrutura de Cores](#estrutura-de-cores)
- [Paletas de Cores](#paletas-de-cores)
- [Como Usar](#como-usar)
- [Exemplos de Uso](#exemplos-de-uso)
- [Diretrizes de Acessibilidade](#diretrizes-de-acessibilidade)

## 🎨 Sistema de Cores

Sistema completo de cores baseado em uma paleta escalável e consistente.

➡️ **[Ver documentação completa de cores](STYLE_GUIDE.md)**

## 🔤 Sistema de Tipografia

Sistema completo de tipografia usando Roboto como fonte padrão, com 5 categorias:

- **Display** - Títulos grandes e de destaque (36-46px)
- **Heading** - Títulos de seções (14-32px)
- **Body** - Texto de corpo (12-20px)
- **Button** - Texto em botões (12-24px)
- **Caption** - Legendas e metadados (10-12px)

➡️ **[Ver documentação completa de tipografia](TYPOGRAPHY.md)**

### Exemplo de Uso Combinado

```typescript
import { typography, styleGuide } from '@shared/theme';

const styles = StyleSheet.create({
  title: {
    ...typography.heading.h1,
    color: styleGuide.neutral[900],
  },
  body: {
    ...typography.body.mRegular,
    color: styleGuide.neutral[700],
  },
});
```

## 🎨 Estrutura de Cores

As cores estão organizadas em escalas de tonalidade numeradas de 50 a 900:

- **50-200**: Tons mais claros (backgrounds, estados hover)
- **300-400**: Tons médios (bordas, ícones secundários)
- **500**: Cor base (cor principal da paleta)
- **600-700**: Tons mais escuros (estados pressed/active)
- **800-900**: Tons mais escuros (textos, sombras)

## 🎨 Paletas de Cores

### Primary Blue

Cor principal do aplicativo, usada para elementos principais de interface.

| Shade   | Hex           | Uso Recomendado                |
| ------- | ------------- | ------------------------------ |
| 50      | `#EAEFFB`     | Background muito claro         |
| 100     | `#D3DFF6`     | Background claro, hover states |
| 200     | `#A4BDEE`     | Background suave               |
| 300     | `#6897F3`     | Bordas, ícones secundários     |
| 400     | `#3674EE`     | Cor secundária                 |
| **500** | **`#1256DB`** | **Cor principal (base)**       |
| 600     | `#0E45B0`     | Estado pressed                 |
| 700     | `#0B3484`     | Estado active                  |
| 800     | `#0B2455`     | Textos em fundos claros        |
| 900     | `#06122B`     | Sombras, textos fortes         |

### Neutral

Escala de cinzas para textos, bordas e backgrounds.

| Shade   | Hex           | Uso Recomendado             |
| ------- | ------------- | --------------------------- |
| 50      | `#F2F2F2`     | Background muito claro      |
| 100     | `#E6E6E6`     | Background claro            |
| 200     | `#CECECE`     | Bordas, divisores           |
| 300     | `#B6B6B6`     | Bordas médias               |
| 400     | `#9E9E9E`     | Placeholder text            |
| **500** | **`#868686`** | **Texto secundário (base)** |
| 600     | `#6B6B6B`     | Texto regular               |
| 700     | `#505050`     | Texto médio                 |
| 800     | `#353535`     | Texto primário              |
| 900     | `#151515`     | Headings, texto forte       |

### Success

Cores para indicar sucesso, confirmações e estados positivos.

| Shade   | Hex           | Uso Recomendado                 |
| ------- | ------------- | ------------------------------- |
| 50      | `#E6F5E6`     | Background de alerta de sucesso |
| 200     | `#B0E1B0`     | Bordas, hover                   |
| **500** | **`#009E00`** | **Cor de sucesso (base)**       |
| 800     | `#0D3616`     | Texto, pressed                  |

### Error

Cores para indicar erros, avisos críticos e estados negativos.

| Shade   | Hex           | Uso Recomendado              |
| ------- | ------------- | ---------------------------- |
| 50      | `#FCE6E6`     | Background de alerta de erro |
| 200     | `#F4B0B0`     | Bordas, hover                |
| **500** | **`#DC0000`** | **Cor de erro (base)**       |
| 800     | `#4D0000`     | Texto, pressed               |

### Warning

Cores para indicar avisos e alertas importantes.

| Shade   | Hex           | Uso Recomendado         |
| ------- | ------------- | ----------------------- |
| 200     | `#FFEBB2`     | Background de alerta    |
| **500** | **`#F6B500`** | **Cor de aviso (base)** |
| 800     | `#805E00`     | Texto, pressed          |

### Info

Cores para indicar informações e dicas.

| Shade   | Hex           | Uso Recomendado              |
| ------- | ------------- | ---------------------------- |
| 200     | `#82C3DF`     | Background informativo       |
| **500** | **`#007BAF`** | **Cor de informação (base)** |
| 800     | `#003146`     | Texto, pressed               |

## 💻 Como Usar

### Importação

```typescript
import { styleGuide } from '@shared/theme';

// Acessar cores específicas
const primaryColor = styleGuide.primaryBlue[500];
const lightBackground = styleGuide.neutral[50];
const errorColor = styleGuide.error[500];
```

### Uso em Componentes React Native

```typescript
import { StyleSheet } from 'react-native';
import { styleGuide } from '@shared/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: styleGuide.neutral[50],
    borderColor: styleGuide.neutral[200],
  },
  primaryButton: {
    backgroundColor: styleGuide.primaryBlue[500],
  },
  primaryButtonPressed: {
    backgroundColor: styleGuide.primaryBlue[600],
  },
  errorText: {
    color: styleGuide.error[500],
  },
});
```

### Uso com Theme Context

```typescript
import { useTheme } from '@shared/theme';

function MyComponent() {
  const { colors, isDark } = useTheme();

  // As cores já estão adaptadas ao tema (light/dark)
  return (
    <View style={{ backgroundColor: colors.background }}>
      <Text style={{ color: colors.text }}>Olá</Text>
    </View>
  );
}
```

## 📝 Exemplos de Uso

### Botões

```typescript
// Botão primário
<Button
  style={{
    backgroundColor: styleGuide.primaryBlue[500],
    borderColor: styleGuide.primaryBlue[500],
  }}
  pressedStyle={{
    backgroundColor: styleGuide.primaryBlue[600],
  }}
/>

// Botão secundário
<Button
  style={{
    backgroundColor: 'transparent',
    borderColor: styleGuide.primaryBlue[500],
  }}
  textStyle={{
    color: styleGuide.primaryBlue[500],
  }}
/>
```

### Cards e Surfaces

```typescript
<Card
  style={{
    backgroundColor: styleGuide.neutral[50],
    borderColor: styleGuide.neutral[200],
    shadowColor: styleGuide.neutral[900],
  }}
/>
```

### Alertas e Notificações

```typescript
// Sucesso
<Alert
  style={{
    backgroundColor: styleGuide.success[50],
    borderColor: styleGuide.success[500],
  }}
  iconColor={styleGuide.success[500]}
  textColor={styleGuide.success[800]}
/>

// Erro
<Alert
  style={{
    backgroundColor: styleGuide.error[50],
    borderColor: styleGuide.error[500],
  }}
  iconColor={styleGuide.error[500]}
  textColor={styleGuide.error[800]}
/>

// Aviso
<Alert
  style={{
    backgroundColor: styleGuide.warning[200],
    borderColor: styleGuide.warning[500],
  }}
  iconColor={styleGuide.warning[500]}
  textColor={styleGuide.warning[800]}
/>
```

## ♿ Diretrizes de Acessibilidade

### Contraste de Texto

Para garantir legibilidade adequada (WCAG AA), siga estas diretrizes:

#### Texto Normal (< 18px)

- Razão de contraste mínima: **4.5:1**

#### Texto Grande (≥ 18px ou ≥ 14px bold)

- Razão de contraste mínima: **3:1**

### Combinações Recomendadas

#### Tema Claro

| Texto            | Background  | Contraste | Status    |
| ---------------- | ----------- | --------- | --------- |
| neutral[900]     | neutral[50] | ✅ Pass   | Excelente |
| neutral[800]     | neutral[50] | ✅ Pass   | Muito bom |
| primaryBlue[500] | neutral[50] | ✅ Pass   | Bom       |
| error[500]       | error[50]   | ✅ Pass   | Bom       |

#### Tema Escuro

| Texto            | Background   | Contraste | Status    |
| ---------------- | ------------ | --------- | --------- |
| neutral[50]      | neutral[900] | ✅ Pass   | Excelente |
| neutral[100]     | neutral[900] | ✅ Pass   | Muito bom |
| primaryBlue[400] | neutral[900] | ✅ Pass   | Bom       |
| success[500]     | neutral[900] | ✅ Pass   | Bom       |

### Teste de Contraste

Use ferramentas como:

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colorable](https://colorable.jxnblk.com/)
- Plugin do Figma: "Stark" ou "Contrast"

### Estados de Interação

Garanta que os estados interativos sejam facilmente distinguíveis:

```typescript
// Exemplo de botão com estados claros
const buttonStyles = {
  default: {
    backgroundColor: styleGuide.primaryBlue[500],
  },
  hover: {
    backgroundColor: styleGuide.primaryBlue[600], // Diferença visível
  },
  pressed: {
    backgroundColor: styleGuide.primaryBlue[700], // Ainda mais escuro
  },
  disabled: {
    backgroundColor: styleGuide.neutral[300],
    opacity: 0.5, // Indicação adicional de estado desabilitado
  },
};
```

## 🔄 Atualizações

Este style guide é um documento vivo e será atualizado conforme o design do aplicativo evolui. Sempre consulte este documento para garantir consistência visual.

---

**Última atualização:** Janeiro 2026
**Versão:** 1.0.0
