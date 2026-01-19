# 🚀 NOVO Sistema Responsivo PillMind

**Sistema inteligente de responsividade que adapta automaticamente elementos de UI para todos os tamanhos de tela do iOS e Android.**

## ✨ O que mudou?

- ✅ **Substituído o sistema anterior** por um sistema muito mais inteligente
- ✅ **Hooks automáticos** que detectam dispositivo e aplicam responsividade
- ✅ **Componentes prontos** (ResponsiveContainer, ResponsiveText)
- ✅ **Integração perfeita** com o tema existente
- ✅ **Performance otimizada** com useMemo
- ✅ **TypeScript completo** com type safety

## 📦 Como usar

### 1. Import do sistema responsivo

```tsx
import {
  useResponsive,
  ResponsiveContainer,
  ResponsiveText,
  useResponsiveSpacing,
  useResponsiveTypography,
} from '@shared/responsive';
```

### 2. Hook principal - `useResponsive`

```tsx
const MyComponent = () => {
  const {
    wp,
    hp,
    rf,
    rs, // Funções responsivas
    isSmallDevice,
    isTablet, // Detecção de dispositivo
    screenWidth,
    screenHeight, // Dimensões da tela
  } = useResponsive();

  return (
    <View
      style={{
        width: wp(80), // 80% da largura da tela
        height: hp(50), // 50% da altura da tela
        padding: rs(16), // Padding responsivo
      }}
    >
      <Text style={{ fontSize: rf(18) }}>Responsivo automático!</Text>
    </View>
  );
};
```

### 3. Container Responsivo

```tsx
const MyScreen = () => (
  <ResponsiveContainer
    variant="padded" // full | padded | centered | card | section
    maxWidth="md" // xs | sm | md | lg | xl | full
    paddingVertical="lg" // xs | sm | md | lg | xl
    safeArea={true} // Safe area automática
  >
    <ResponsiveText variant="heading" heading="h1">
      Título responsivo!
    </ResponsiveText>

    <ResponsiveText variant="body" body="large">
      Texto que se adapta automaticamente
    </ResponsiveText>
  </ResponsiveContainer>
);
```

### 4. Exemplo prático - Componente de onboarding

```tsx
// ANTES - Hardcoded
<TouchableOpacity
  style={{
    width: 44,
    height: 44,
    borderRadius: 22,
    padding: 12,
  }}
>
  <Text style={{ fontSize: 24 }}>🇧🇷</Text>
</TouchableOpacity>;

// DEPOIS - Responsivo automático
const { rf, isTablet, isSmallDevice } = useResponsive();
const spacing = useResponsiveSpacing();

<TouchableOpacity
  style={{
    width: isTablet ? 60 : isSmallDevice ? 40 : 48,
    height: isTablet ? 60 : isSmallDevice ? 40 : 48,
    borderRadius: isTablet ? 30 : isSmallDevice ? 20 : 24,
    ...spacing.buttonPadding,
  }}
>
  <ResponsiveText style={{ fontSize: rf(24) }}>🇧🇷</ResponsiveText>
</TouchableOpacity>;
```

## 🔧 Funções disponíveis

### Dimensões responsivas

- `wp(percentage)` - Width percentage da tela
- `hp(percentage)` - Height percentage da tela

### Tamanhos responsivos

- `rf(fontSize, factor)` - Font size responsiva
- `rs(size, factor)` - Dimensão responsiva (padding, margin, etc)

### Detecção de dispositivo

- `isSmallDevice` - Phones pequenos (≤375px)
- `isMediumDevice` - Phones médios (376-414px)
- `isLargeDevice` - Phones grandes e tablets (≥415px)
- `isTablet` - Tablets (≥768px)

### Breakpoints

- `isXS` - Extra small (≤320px)
- `isSM` - Small (321-375px)
- `isMD` - Medium (376-414px)
- `isLG` - Large (415-768px)
- `isXL` - Extra large (≥768px)

## 📱 Suporte de dispositivos

### ✅ iOS

- iPhone SE (320px)
- iPhone 8 (375px)
- iPhone 11/12/13/14 (414px)
- iPhone 14 Pro Max (428px)
- iPad mini (768px)
- iPad Pro (1024px)

### ✅ Android

- Dispositivos pequenos (320-375px)
- Dispositivos médios (376-414px)
- Dispositivos grandes (415px+)
- Tablets Android (768px+)

## 🚀 Como migrar componentes existentes

### 1. Substituir valores fixos por responsivos

```tsx
// ANTES
<View style={{ padding: 16, margin: 24 }}>
  <Text style={{ fontSize: 18 }}>Título</Text>
</View>;

// DEPOIS
const { rf, rs } = useResponsive();
<View style={{ padding: rs(16), margin: rs(24) }}>
  <Text style={{ fontSize: rf(18) }}>Título</Text>
</View>;
```

### 2. Usar componentes responsivos

```tsx
// MELHOR AINDA
<ResponsiveContainer paddingVertical="md" marginVertical="lg">
  <ResponsiveText variant="heading" heading="h3">
    Título
  </ResponsiveText>
</ResponsiveContainer>
```

### 3. Aplicar em botões e cards

```tsx
// Botão responsivo
const { isTablet, isSmallDevice } = useResponsive();
const spacing = useResponsiveSpacing();

<TouchableOpacity
  style={[
    spacing.buttonPadding,
    {
      minHeight: isTablet ? 56 : isSmallDevice ? 40 : 48,
      borderRadius: isTablet ? 12 : 8,
    },
  ]}
>
  <ResponsiveText variant="button">Pressionar</ResponsiveText>
</TouchableOpacity>;
```

## 🎨 Integração com o tema atual

O sistema se integra perfeitamente:

```tsx
import { useTheme } from '@shared/theme';
import { ResponsiveContainer, ResponsiveText } from '@shared/responsive';

const MyComponent = () => {
  const { colors } = useTheme();

  return (
    <ResponsiveContainer variant="card">
      <ResponsiveText
        variant="heading"
        heading="h2"
        color={colors.text.primary}
      >
        Funciona com o tema atual!
      </ResponsiveText>
    </ResponsiveContainer>
  );
};
```

## 📊 Performance

- ✅ Hooks otimizados com `useMemo`
- ✅ Cálculos feitos apenas quando necessário
- ✅ Valores cacheados para evitar re-renders
- ✅ TypeScript para melhor tree-shaking

## 🔄 Aplicação no LanguageSelector

Já aplicado como exemplo no `LanguageSelector.tsx`:

```tsx
// Agora o seletor de idioma se adapta automaticamente:
// - Telas pequenas: botões 40x40px
// - Telas médias: botões 48x48px
// - Tablets: botões 60x60px
// - Espaçamento responsivo
// - Font size responsivo para as flags
```

## 📝 Próximos passos

1. ✅ **Sistema criado e documentado**
2. ✅ **Exemplo aplicado (LanguageSelector)**
3. 🔄 **Aplicar gradualmente em outros componentes**
4. 🔄 **Testar em diferentes dispositivos**
5. 🔄 **Otimizar baseado no feedback**

---

**🎉 Agora o PillMind se adapta automaticamente a qualquer tamanho de tela!**
