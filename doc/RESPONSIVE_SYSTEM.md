# Sistema de Responsividade Adaptativa

## 📱 Visão Geral

Sistema completo de dimensões responsivas para adaptar o PillMind a diferentes tamanhos e resoluções de dispositivos Android e iOS.

## 🎯 Problema Resolvido

O app estava com UX/UI ruim em dispositivos como Moto G23 devido a:

- Valores fixos (hardcoded) que não se adaptavam
- Falta de escalonamento proporcional entre dispositivos
- Botões e textos com tamanhos inadequados em telas pequenas/grandes

## 🛠️ Implementação

### 1. Utilitário de Dimensões (`src/shared/utils/dimensions.ts`)

#### Funções de Escala

```typescript
// Porcentagem da largura da tela
wp(50); // 50% da largura

// Porcentagem da altura da tela
hp(10); // 10% da altura

// Escala de fonte responsiva
fs(16); // Tamanho adaptado baseado no device

// Escala horizontal/vertical
scaleWidth(20);
scaleHeight(40);

// Escala moderada (média entre width e height)
scale(24);
```

#### Detecção de Tamanho

```typescript
isSmallDevice(); // < 700px altura (< 5")
isMediumDevice(); // 700-900px (5-6")
isLargeDevice(); // > 900px (> 6")

// Retorna valor baseado no tamanho
deviceSize(small, medium, large);
```

#### Valores Adaptativos Pré-definidos

```typescript
// Espaçamentos adaptativos
adaptiveSpacing.xs; // 4/6/8
adaptiveSpacing.sm; // 8/12/16
adaptiveSpacing.md; // 12/16/20
adaptiveSpacing.lg; // 16/20/24
adaptiveSpacing.xl; // 20/24/32
adaptiveSpacing.xxl; // 24/32/40

// Tamanhos de fonte adaptativos
adaptiveFontSizes.xs; // 10/11/12
adaptiveFontSizes.sm; // 12/13/14
adaptiveFontSizes.md; // 14/15/16
adaptiveFontSizes.lg; // 16/18/20
adaptiveFontSizes.xl; // 20/22/24
adaptiveFontSizes.xxl; // 24/28/32
adaptiveFontSizes.xxxl; // 28/32/36
```

### 2. Device Info

```typescript
deviceInfo = {
  width: number,
  height: number,
  isSmall: boolean,
  isMedium: boolean,
  isLarge: boolean,
  platform: 'ios' | 'android',
  pixelRatio: number,
  fontScale: number,
};

// Debug
logDeviceInfo(); // Imprime info no console
```

## 📐 Dispositivos Base

- **Referência**: iPhone 11 Pro (375x812)
- **Moto G23**: ~720x1600 (6.5") - Dispositivo relatado com problema
- **Testes**: Pequeno (< 5"), Médio (5-6"), Grande (> 6")

## ✅ Componentes Atualizados

### OnboardingAuth

- ✅ Inputs com altura mínima adaptativa (44/48/52)
- ✅ Espaçamentos responsivos
- ✅ Fontes escaladas proporcionalmente
- ✅ Botões sociais com altura adaptativa (48/52/56)

### OnboardingTitleBlock

- ✅ Título com fontSize adaptativo (xxl)
- ✅ Subtítulo com lineHeight responsivo (20/22/24)
- ✅ Padding horizontal adaptativo

### OnboardingPrimaryButton

- ✅ Altura mínima adaptativa (50/56/60)
- ✅ Padding e fontSize responsivos

## 🎨 Como Usar

### Em StyleSheet

```typescript
import {
  adaptiveSpacing,
  adaptiveFontSizes,
  deviceSize,
  scaleHeight,
} from '@shared/utils/dimensions';

const styles = StyleSheet.create({
  container: {
    padding: adaptiveSpacing.lg, // Adaptativo!
  },
  title: {
    fontSize: adaptiveFontSizes.xxl, // Adaptativo!
    lineHeight: deviceSize(32, 36, 40), // Por device!
  },
  button: {
    minHeight: deviceSize(48, 52, 56), // Por device!
    paddingVertical: adaptiveSpacing.md,
  },
  header: {
    marginTop: scaleHeight(40), // Escala proporcional
  },
});
```

### Lógica Condicional

```typescript
const iconSize = isSmallDevice() ? 18 : isMediumDevice() ? 20 : 24;

const spacing = deviceSize(
  12, // small
  16, // medium
  20 // large
);
```

## 📊 Exemplo de Escalonamento

| Elemento   | Pequeno (< 5") | Médio (5-6") | Grande (> 6") |
| ---------- | -------------- | ------------ | ------------- |
| Título     | 24px           | 28px         | 32px          |
| Subtítulo  | 14px           | 15px         | 16px          |
| Botão      | 50px           | 56px         | 60px          |
| Input      | 44px           | 48px         | 52px          |
| Spacing MD | 12px           | 16px         | 20px          |

## 🔍 Debug

Adicione no início do App.tsx:

```typescript
import { logDeviceInfo } from '@shared/utils/dimensions';

logDeviceInfo(); // Ver info do device atual
```

Output esperado:

```
📱 Device Info: {
  width: 392,
  height: 851,
  widthScale: "1.05",
  heightScale: "1.05",
  size: "Medium",
  platform: "android",
  pixelRatio: 2.75
}
```

## 🚀 Próximos Passos

1. Aplicar em outros componentes:
   - [ ] OnboardingCarousel
   - [ ] OnboardingStep
   - [ ] HomeScreen cards
   - [ ] AppointmentsScreen

2. Testar em dispositivos reais:
   - [ ] Moto G23 (problema reportado)
   - [ ] Dispositivos pequenos (< 5")
   - [ ] Tablets (> 7")

3. Otimizações:
   - [ ] Cache de cálculos de dimensões
   - [ ] Listener para mudança de orientação
   - [ ] Suporte para landscape

## 📝 Notas

- Sempre use `adaptiveSpacing` e `adaptiveFontSizes` em vez de valores fixos
- Para elementos críticos de UI (botões, inputs), use `deviceSize()` com valores específicos
- Teste sempre em pelo menos 3 tamanhos diferentes: small, medium, large
- Valores de lineHeight são importantes para legibilidade em diferentes densidades

## 🐛 Troubleshooting

**Problema**: Texto cortado em dispositivos pequenos
**Solução**: Use `deviceSize()` para lineHeight e reduza fontSize com `adaptiveFontSizes`

**Problema**: Botões muito pequenos para tocar
**Solução**: Defina `minHeight` com `deviceSize(44, 48, 52)` - guideline de touch target

**Problema**: Layout quebrado em tablet
**Solução**: Adicione `isLargeDevice()` check e ajuste layout para telas > 900px

## 📚 Referências

- [React Native Dimensions API](https://reactnative.dev/docs/dimensions)
- [iOS Human Interface Guidelines - Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [Material Design - Understanding layout](https://m3.material.io/foundations/layout/understanding-layout/overview)
- [Touch Target Sizes (44pt min)](https://www.lukew.com/ff/entry.asp?1085)
