# ModernInput - Design System 2025

## Overview

O `ModernInput` é um componente de input moderno e clean, seguindo as melhores práticas de design de 2025. Ele oferece animações suaves, microinterações intuitivas e múltiplas variações para diferentes casos de uso.

## Features

### 🎨 **Design Moderno**

- Interface clean e minimalista
- Animações suaves com springs naturais
- Microinterações que guiam o usuário
- Suporte completo a temas (light/dark)

### 📱 **Responsivo**

- Dimensionamento adaptativo baseado no tamanho da tela
- Três tamanhos disponíveis: `sm`, `md`, `lg`
- Escala automaticamente fontes e espaçamentos

### 🎭 **Três Variantes**

1. **Floating**: Label que flutua acima do campo
2. **Filled**: Background preenchido com visual moderno
3. **Outlined**: Bordas definidas, estilo clássico

### 🚀 **Animações Avançadas**

- Label animado com floating effect
- Borda que se destaca no foco
- Escala sutil no container
- Transições suaves entre estados

## Usage Examples

### Basic Floating Input

```tsx
<ModernInput
  label="Email Address"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  variant="floating"
  keyboardType="email-address"
/>
```

### With Icons

```tsx
<ModernInput
  label="Password"
  value={password}
  onChangeText={setPassword}
  variant="floating"
  secureTextEntry
  leftIcon={<Ionicons name="lock-closed-outline" size={20} />}
  rightIcon={
    <TouchableOpacity>
      <Ionicons name="eye-outline" size={20} />
    </TouchableOpacity>
  }
/>
```

### Filled Variant

```tsx
<ModernInput
  label="Full Name"
  placeholder="Enter your full name"
  value={name}
  onChangeText={setName}
  variant="filled"
  size="lg"
  leftIcon={<Ionicons name="person-outline" size={22} />}
/>
```

### Outlined with Validation

```tsx
<ModernInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  variant="outlined"
  error="Please enter a valid email address"
  leftIcon={<Ionicons name="mail-outline" size={20} />}
/>
```

### Search Input

```tsx
<ModernInput
  placeholder="Search medications..."
  value={search}
  onChangeText={setSearch}
  variant="outlined"
  leftIcon={<Ionicons name="search-outline" size={20} />}
  rightIcon={<Ionicons name="mic-outline" size={20} />}
/>
```

## Props API

### ModernInputProps

| Prop             | Type           | Default     | Description               |
| ---------------- | -------------- | ----------- | ------------------------- | ------------ | --------------------- |
| `label`          | `string`       | -           | Label do campo (opcional) |
| `error`          | `string`       | -           | Mensagem de erro          |
| `hint`           | `string`       | -           | Texto de ajuda            |
| `leftIcon`       | `ReactNode`    | -           | Ícone à esquerda          |
| `rightIcon`      | `ReactNode`    | -           | Ícone à direita           |
| `variant`        | `'floating' \\ | 'filled' \\ | 'outlined'`               | `'floating'` | Variante visual       |
| `size`           | `'sm' \\       | 'md' \\     | 'lg'`                     | `'md'`       | Tamanho do componente |
| `containerStyle` | `ViewStyle`    | -           | Estilo do container       |
| `inputStyle`     | `TextStyle`    | -           | Estilo do input           |

Além de todas as props do `TextInput` do React Native.

## Design Tokens

### Sizes

- **Small**: 44-52px de altura
- **Medium**: 52-60px de altura
- **Large**: 60-68px de altura

### Animations

- **Duration**: 200ms para mudanças de estado
- **Easing**: Spring natural com tension: 150, friction: 8
- **Scale**: 1.02x no foco para feedback visual

### Colors

- Utiliza automaticamente o theme system
- Suporte completo para modo escuro
- Estados de erro com cores consistentes

## Best Practices

### ✅ Do's

- Use `floating` para formulários principais
- Use `filled` para inputs de busca e filtros
- Use `outlined` quando precisar de mais destaque
- Sempre forneça labels descritivos
- Use ícones para melhorar a UX

### ❌ Don'ts

- Não misture variantes no mesmo formulário
- Não use tamanhos diferentes sem justificativa
- Não esqueça de tratar estados de erro
- Não use labels muito longas

## Migration Guide

### From Old Input

```tsx
// Before
<Input
  label="Email"
  placeholder="Enter email"
  value={email}
  onChangeText={setEmail}
  variant="outlined"
/>

// After
<ModernInput
  label="Email"
  placeholder="Enter email"
  value={email}
  onChangeText={setEmail}
  variant="floating" // Try the new floating variant!
  size="md"
  leftIcon={<Ionicons name="mail-outline" size={20} />}
/>
```

## Technical Implementation

### Key Features

- **Adaptive Sizing**: Uses `deviceSize()` for cross-device consistency
- **Theme Integration**: Full theme support with automatic color switching
- **Animation System**: Custom Animated.Value management for smooth interactions
- **Accessibility**: Proper ARIA labels and screen reader support
- **Performance**: Optimized rendering with minimal re-renders

### Dependencies

- React Native Reanimated 2
- @expo/vector-icons (para ícones)
- Shared theme system
- Responsive utilities

---

_Designed for 2025 with modern UX patterns and clean aesthetics_ ✨
