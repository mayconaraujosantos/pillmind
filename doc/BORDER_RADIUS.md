# Border Radius System - PillMind Style Guide

Sistema de border radius consistente para componentes do PillMind.

## Valores Base

| Nome   | Valor  | Uso Recomendado                        |
| ------ | ------ | -------------------------------------- |
| `xs`   | 4px    | Badges, chips, thumbnails              |
| `sm`   | 8px    | Botões, inputs, alerts                 |
| `md`   | 16px   | Cards, containers (padrão)             |
| `lg`   | 24px   | Modais, sheets, cards grandes          |
| `xl`   | 32px   | Elementos destacados, hero sections    |
| `full` | 9999px | Elementos circulares (avatares, pills) |
| `none` | 0px    | Sem arredondamento                     |

## Progressão

O sistema segue uma progressão clara:

- **XS → SM**: 2x (4 → 8)
- **SM → MD**: 2x (8 → 16)
- **MD → LG**: 1.5x (16 → 24)
- **LG → XL**: 1.33x (24 → 32)

Todos os valores são múltiplos de 4 para alinhamento com o grid de 8px.

## Uso Básico

### Importação

```tsx
import { borderRadius } from '@/shared/theme';
```

### Aplicação Direta

```tsx
<View style={{ borderRadius: borderRadius.md }}>
  <Text>Card com 16px radius</Text>
</View>
```

## Presets de Componentes

### Botões

```tsx
import { borderRadiusPresets } from '@/shared/theme';

// Botão padrão (8px)
<TouchableOpacity style={borderRadiusPresets.button}>
  <Text>Botão Normal</Text>
</TouchableOpacity>

// Botão pill (completamente arredondado)
<TouchableOpacity style={borderRadiusPresets.buttonPill}>
  <Text>Botão Pill</Text>
</TouchableOpacity>
```

### Cards

```tsx
// Card padrão (16px)
<View style={borderRadiusPresets.card}>
  <Text>Conteúdo do Card</Text>
</View>

// Card grande (24px)
<View style={borderRadiusPresets.cardLarge}>
  <Text>Card Destacado</Text>
</View>
```

### Inputs

```tsx
// Input de texto (8px)
<TextInput style={borderRadiusPresets.input} placeholder="Digite algo..." />
```

### Badges

```tsx
// Badge pequeno (4px)
<View style={borderRadiusPresets.badge}>
  <Text>New</Text>
</View>

// Badge pill (arredondado)
<View style={borderRadiusPresets.badgePill}>
  <Text>Premium</Text>
</View>
```

### Modais

```tsx
// Modal/Dialog (24px)
<View style={borderRadiusPresets.modal}>
  <Text>Título do Modal</Text>
  <Text>Conteúdo...</Text>
</View>
```

### Bottom Sheet

```tsx
// Arredondado apenas no topo (24px)
<View style={borderRadiusPresets.bottomSheet}>
  <View style={styles.handle} />
  <Text>Bottom Sheet Content</Text>
</View>
```

### Avatares

```tsx
// Avatar circular
<Image
  source={{ uri: 'avatar.jpg' }}
  style={[styles.avatar, borderRadiusPresets.avatarCircular]}
/>

// Avatar arredondado (16px)
<Image
  source={{ uri: 'avatar.jpg' }}
  style={[styles.avatar, borderRadiusPresets.avatarRounded]}
/>
```

### Chips

```tsx
// Chip (completamente arredondado)
<View style={borderRadiusPresets.chip}>
  <Text>React Native</Text>
</View>
```

### Alerts

```tsx
// Alert/Toast (8px)
<View style={borderRadiusPresets.alert}>
  <Text>✓ Success message</Text>
</View>
```

## Border Radius Seletivo

### Arredondamento Parcial

```tsx
// Apenas topo
<View style={borderRadiusPresets.topOnly}>
  <Text>Header</Text>
</View>

// Apenas base
<View style={borderRadiusPresets.bottomOnly}>
  <Text>Footer</Text>
</View>

// Apenas esquerda
<View style={borderRadiusPresets.leftOnly}>
  <Text>Left Panel</Text>
</View>

// Apenas direita
<View style={borderRadiusPresets.rightOnly}>
  <Text>Right Panel</Text>
</View>
```

### Custom Seletivo

```tsx
import { createSelectiveBorderRadius } from '@/shared/theme';

// Diagonal (topo-esquerda e base-direita)
<View style={createSelectiveBorderRadius({
  topLeft: 'xl',
  bottomRight: 'xl'
})}>
  <Text>Custom Diagonal</Text>
</View>

// Apenas topo-esquerda
<View style={createSelectiveBorderRadius({
  topLeft: 'lg'
})}>
  <Text>Single Corner</Text>
</View>
```

## Funções Helper

### createBorderRadius

Cria um objeto de estilo com border radius:

```tsx
import { createBorderRadius } from '@/shared/theme';

const styles = StyleSheet.create({
  container: {
    ...createBorderRadius('md'),
    // Equivalente a: { borderRadius: 16 }
  },
});
```

### createSelectiveBorderRadius

Cria border radius em cantos específicos:

```tsx
import { createSelectiveBorderRadius } from '@/shared/theme';

const styles = StyleSheet.create({
  topCard: createSelectiveBorderRadius({
    topLeft: 'lg',
    topRight: 'lg',
    // bottomLeft e bottomRight serão 0
  }),
});
```

## Exemplos de Uso Completos

### Card com Imagem

```tsx
<View style={[styles.card, borderRadiusPresets.card]}>
  <Image
    source={{ uri: 'image.jpg' }}
    style={[
      styles.cardImage,
      createSelectiveBorderRadius({
        topLeft: 'md',
        topRight: 'md',
      }),
    ]}
  />
  <View style={styles.cardContent}>
    <Text>Título do Card</Text>
    <Text>Descrição...</Text>
  </View>
</View>
```

### Lista de Itens Conectados

```tsx
<View style={styles.list}>
  {/* Primeiro item - arredondado no topo */}
  <View style={borderRadiusPresets.topOnly}>
    <Text>Item 1</Text>
  </View>

  {/* Itens do meio - sem arredondamento */}
  <View style={createBorderRadius('none')}>
    <Text>Item 2</Text>
  </View>

  {/* Último item - arredondado na base */}
  <View style={borderRadiusPresets.bottomOnly}>
    <Text>Item 3</Text>
  </View>
</View>
```

### Tabs Arredondadas

```tsx
<View style={styles.tabBar}>
  <TouchableOpacity
    style={[
      styles.tab,
      createSelectiveBorderRadius({
        topLeft: 'md',
        bottomLeft: 'md',
      }),
    ]}
  >
    <Text>Tab 1</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.tab}>
    <Text>Tab 2</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.tab,
      createSelectiveBorderRadius({
        topRight: 'md',
        bottomRight: 'md',
      }),
    ]}
  >
    <Text>Tab 3</Text>
  </TouchableOpacity>
</View>
```

### Status Badge

```tsx
<View style={styles.userCard}>
  <Image
    source={{ uri: 'avatar.jpg' }}
    style={[styles.avatar, borderRadiusPresets.avatarCircular]}
  />
  <View style={[styles.statusBadge, borderRadiusPresets.badgePill]}>
    <Text>Online</Text>
  </View>
</View>
```

## Referência Rápida

### Por Componente

| Componente      | Preset           | Valor       |
| --------------- | ---------------- | ----------- |
| Button          | `button`         | 8px         |
| Button Pill     | `buttonPill`     | full        |
| Card            | `card`           | 16px        |
| Card Large      | `cardLarge`      | 24px        |
| Input           | `input`          | 8px         |
| Badge           | `badge`          | 4px         |
| Badge Pill      | `badgePill`      | full        |
| Modal           | `modal`          | 24px        |
| Bottom Sheet    | `bottomSheet`    | 24px (topo) |
| Avatar Circular | `avatarCircular` | full        |
| Avatar Rounded  | `avatarRounded`  | 16px        |
| Chip            | `chip`           | full        |
| Alert           | `alert`          | 8px         |
| Thumbnail       | `thumbnail`      | 4px         |

### Por Valor

| Valor  | Tamanho | Componentes                          |
| ------ | ------- | ------------------------------------ |
| 4px    | `xs`    | Badges, thumbnails, small elements   |
| 8px    | `sm`    | Buttons, inputs, alerts, small cards |
| 16px   | `md`    | Cards, containers, modals (default)  |
| 24px   | `lg`    | Large cards, modals, sheets          |
| 32px   | `xl`    | Hero sections, featured elements     |
| 9999px | `full`  | Pills, circular avatars, chips       |

## Boas Práticas

### ✅ Recomendado

```tsx
// Use presets quando disponíveis
<View style={borderRadiusPresets.card}>

// Use valores do sistema
<View style={{ borderRadius: borderRadius.md }}>

// Use helpers para customizações
<View style={createSelectiveBorderRadius({ topLeft: 'lg' })}>
```

### ❌ Evite

```tsx
// Não use valores hardcoded
<View style={{ borderRadius: 12 }}>  // ❌

// Não use valores fora do sistema
<View style={{ borderRadius: 18 }}>  // ❌

// Não misture pixels e percentagens
<View style={{ borderRadius: '50%' }}>  // ❌ Use borderRadius.full
```

## Acessibilidade

- Border radius não afeta acessibilidade diretamente
- Garanta que o radius não esconda conteúdo importante
- Mantenha consistência para melhor reconhecimento visual
- Use `full` para elementos que devem ser claramente circulares

## Compatibilidade

- ✅ iOS
- ✅ Android
- ✅ Web
- ⚠️ **Nota**: `overflow: 'hidden'` pode ser necessário para clipping correto em algumas plataformas

## TypeScript

```tsx
import type { BorderRadiusSize, BorderRadiusPreset } from '@/shared/theme';

// Type-safe radius size
const myRadius: BorderRadiusSize = 'md';

// Type-safe preset name
const myPreset: BorderRadiusPreset = 'card';
```

## Arquivos Relacionados

- `src/shared/theme/borderRadius.ts` - Implementação do sistema
- `src/shared/theme/borderRadius.examples.tsx` - Exemplos de uso
- `src/shared/theme/__tests__/borderRadius.test.ts` - Testes unitários

## Referências

- [Material Design - Shape](https://m3.material.io/styles/shape/overview)
- [iOS Human Interface Guidelines - Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- [React Native - View Style Props](https://reactnative.dev/docs/view-style-props#borderradius)
