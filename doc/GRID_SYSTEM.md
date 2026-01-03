# Grid System - PillMind Style Guide

Sistema de grid responsivo de 4 colunas para layout consistente no PillMind.

## Especificações

### Mobile (iPhone)

- **Screen Size**: 440 x 956px
- **Columns**: 4
- **Type**: Stretch
- **Gutter Width**: 16px (espaço entre colunas)
- **Column Width**: Auto (88px calculado)
- **Margin Width**: 20px (margens laterais)

### Cálculo das Colunas

```
Largura Disponível = 440 - (2 × 20) = 400px
Largura da Coluna = (400 - 3 × 16) / 4 = 88px
```

| Span   | Cálculo             | Largura |
| ------ | ------------------- | ------- |
| 1 col  | 88                  | 88px    |
| 2 cols | (88 × 2) + 16       | 192px   |
| 3 cols | (88 × 3) + (16 × 2) | 296px   |
| 4 cols | (88 × 4) + (16 × 3) | 400px   |

## Uso Básico

### 1. Container com Margens

```tsx
import { container } from '@/shared/theme';

<View style={container}>
  <Text>Conteúdo com margens de 20px</Text>
</View>;
```

### 2. Grid de 4 Colunas

```tsx
import { container, row, columns } from '@/shared/theme';

<View style={container}>
  <View style={row}>
    <View style={columns.col1}>
      <Text>Col 1</Text>
    </View>
    <View style={columns.col1}>
      <Text>Col 2</Text>
    </View>
    <View style={columns.col1}>
      <Text>Col 3</Text>
    </View>
    <View style={columns.col1}>
      <Text>Col 4</Text>
    </View>
  </View>
</View>;
```

### 3. Grid de 2 Colunas (50/50)

```tsx
<View style={container}>
  <View style={row}>
    <View style={columns.col2}>
      <Text>Esquerda</Text>
    </View>
    <View style={columns.col2}>
      <Text>Direita</Text>
    </View>
  </View>
</View>
```

### 4. Layout Sidebar (75/25)

```tsx
<View style={container}>
  <View style={row}>
    <View style={columns.col3}>
      <Text>Conteúdo Principal</Text>
    </View>
    <View style={columns.col1}>
      <Text>Sidebar</Text>
    </View>
  </View>
</View>
```

## Grid Spacing

Sistema de espaçamento baseado no gutter (16px):

```tsx
import { gridSpacing } from '@/shared/theme';

const styles = {
  xxs: gridSpacing.xxs, // 4px
  xs: gridSpacing.xs, // 8px
  sm: gridSpacing.sm, // 12px
  md: gridSpacing.md, // 16px (base)
  lg: gridSpacing.lg, // 24px
  xl: gridSpacing.xl, // 32px
  xxl: gridSpacing.xxl, // 48px
  xxxl: gridSpacing.xxxl, // 64px
};
```

### Exemplo com Espaçamento

```tsx
<View style={container}>
  <View style={[row, { marginBottom: gridSpacing.md }]}>
    <View style={columns.col4}>
      <Text>Linha 1</Text>
    </View>
  </View>

  <View style={row}>
    <View style={columns.col4}>
      <Text>Linha 2</Text>
    </View>
  </View>
</View>
```

## Grid Responsivo

Use o hook `useResponsiveGrid` para adaptar o layout:

```tsx
import { useResponsiveGrid, container, row } from '@/shared/theme';

const MyComponent = () => {
  const { columns, isMobile, screenWidth } = useResponsiveGrid();

  return (
    <View style={container}>
      <Text>Screen: {screenWidth}px</Text>

      <View style={row}>
        <View style={columns.col2}>
          <Text>Responsivo</Text>
        </View>
        <View style={columns.col2}>
          <Text>Adaptativo</Text>
        </View>
      </View>
    </View>
  );
};
```

## Layout Presets

Layouts comuns pré-definidos:

```tsx
import { layoutPresets, getSpanWidth } from '@/shared/theme';

// 4 colunas iguais (25% cada)
layoutPresets.fourColumns; // [1, 1, 1, 1]

// 2 colunas iguais (50% cada)
layoutPresets.twoColumns; // [2, 2]

// Sidebar direita (75% + 25%)
layoutPresets.sidebarRight; // [3, 1]

// Sidebar esquerda (25% + 75%)
layoutPresets.sidebarLeft; // [1, 3]

// Full width (100%)
layoutPresets.fullWidth; // [4]
```

### Exemplo com Presets

```tsx
const preset = layoutPresets.twoColumns;

<View style={container}>
  <View style={row}>
    {preset.map((col, index) => (
      <View key={index} style={{ width: getSpanWidth(col.span) }}>
        <Text>Span {col.span}</Text>
      </View>
    ))}
  </View>
</View>;
```

## Funções Utilitárias

### getColumnWidth

Calcula a largura de uma coluna individual:

```tsx
import { getColumnWidth } from '@/shared/theme';

const columnWidth = getColumnWidth(); // 88px para mobile
```

### getSpanWidth

Calcula a largura para N colunas:

```tsx
import { getSpanWidth } from '@/shared/theme';

const halfWidth = getSpanWidth(2); // 192px
const fullWidth = getSpanWidth(4); // 400px
```

## Grid com Cards

Exemplo de grid 2x2 com cards:

```tsx
import { container, row, columns, gridSpacing } from '@/shared/theme';

<View style={container}>
  {/* Primeira linha */}
  <View style={row}>
    <View style={[columns.col2, styles.card]}>
      <Text>Card 1</Text>
    </View>
    <View style={[columns.col2, styles.card]}>
      <Text>Card 2</Text>
    </View>
  </View>

  {/* Segunda linha */}
  <View style={[row, { marginTop: gridSpacing.md }]}>
    <View style={[columns.col2, styles.card]}>
      <Text>Card 3</Text>
    </View>
    <View style={[columns.col2, styles.card]}>
      <Text>Card 4</Text>
    </View>
  </View>
</View>;

const styles = StyleSheet.create({
  card: {
    padding: gridSpacing.md,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
```

## Layout Complexo

Grid com múltiplas linhas e diferentes spans:

```tsx
<View style={container}>
  {/* Header full width */}
  <View style={row}>
    <View style={columns.col4}>
      <Text>Header</Text>
    </View>
  </View>

  {/* Content area (2 colunas) */}
  <View style={[row, { marginTop: gridSpacing.md }]}>
    <View style={columns.col2}>
      <Text>Card A</Text>
    </View>
    <View style={columns.col2}>
      <Text>Card B</Text>
    </View>
  </View>

  {/* Main + Sidebar */}
  <View style={[row, { marginTop: gridSpacing.md }]}>
    <View style={columns.col3}>
      <Text>Main Content</Text>
    </View>
    <View style={columns.col1}>
      <Text>Aside</Text>
    </View>
  </View>

  {/* Footer full width */}
  <View style={[row, { marginTop: gridSpacing.md }]}>
    <View style={columns.col4}>
      <Text>Footer</Text>
    </View>
  </View>
</View>
```

## Breakpoints

```tsx
import { breakpoints } from '@/shared/theme';

breakpoints.mobile; // 440px
breakpoints.tablet; // 768px
breakpoints.desktop; // 1024px
```

### Uso com Hook

```tsx
const { isMobile, isTablet, isDesktop } = useResponsiveGrid();

if (isMobile) {
  // Layout mobile
} else if (isTablet) {
  // Layout tablet
} else {
  // Layout desktop
}
```

## Boas Práticas

### ✅ Recomendado

```tsx
// Use container para margens consistentes
<View style={container}>
  <View style={row}>
    <View style={columns.col2}>Content</View>
  </View>
</View>

// Use gridSpacing para espaçamentos
<View style={{ marginBottom: gridSpacing.md }}>

// Use presets para layouts comuns
const layout = layoutPresets.twoColumns;
```

### ❌ Evite

```tsx
// Não use valores hardcoded
<View style={{ paddingHorizontal: 20 }}>  // Use container

// Não use margins inconsistentes
<View style={{ marginBottom: 15 }}>  // Use gridSpacing

// Não calcule larguras manualmente
<View style={{ width: '48%' }}>  // Use columns.col2
```

## Exemplos Visuais

### Grid 4 Colunas

```
|--20px--|  88px  |--16px--|  88px  |--16px--|  88px  |--16px--|  88px  |--20px--|
|        |  Col1  |        |  Col2  |        |  Col3  |        |  Col4  |        |
```

### Grid 2 Colunas

```
|--20px--|      192px      |--16px--|      192px      |--20px--|
|        |     Col1 (2)    |        |     Col2 (2)    |        |
```

### Sidebar Layout

```
|--20px--|         296px          |--16px--|  88px  |--20px--|
|        |      Content (3)       |        | Side(1)|        |
```

## Referências

- [Material Design Layout](https://m3.material.io/foundations/layout/understanding-layout/overview)
- [iOS Human Interface Guidelines - Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [React Native Flexbox](https://reactnative.dev/docs/flexbox)

## Arquivos Relacionados

- `src/shared/theme/grid.ts` - Implementação do sistema
- `src/shared/theme/grid.examples.tsx` - Exemplos de uso
- `src/shared/theme/__tests__/grid.test.ts` - Testes unitários
