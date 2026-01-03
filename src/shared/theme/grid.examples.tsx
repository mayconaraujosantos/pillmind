/**
 * Grid System - Exemplos de Uso
 *
 * Este arquivo demonstra como usar o sistema de grid do PillMind
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  container,
  row,
  columns,
  gridSpacing,
  useResponsiveGrid,
  layoutPresets,
  getSpanWidth,
} from './grid';

/**
 * Exemplo 1: Container básico com margens
 */
export const BasicContainer = () => (
  <View style={[styles.container, container]}>
    <Text>Conteúdo com margens de 20px</Text>
  </View>
);

/**
 * Exemplo 2: Grid de 4 colunas iguais
 */
export const FourColumnsGrid = () => (
  <View style={container}>
    <View style={row}>
      <View style={[columns.col1, styles.column]}>
        <Text>Col 1</Text>
      </View>
      <View style={[columns.col1, styles.column]}>
        <Text>Col 2</Text>
      </View>
      <View style={[columns.col1, styles.column]}>
        <Text>Col 3</Text>
      </View>
      <View style={[columns.col1, styles.column]}>
        <Text>Col 4</Text>
      </View>
    </View>
  </View>
);

/**
 * Exemplo 3: Grid 2 colunas (50/50)
 */
export const TwoColumnsGrid = () => (
  <View style={container}>
    <View style={row}>
      <View style={[columns.col2, styles.column]}>
        <Text>Coluna Esquerda</Text>
      </View>
      <View style={[columns.col2, styles.column]}>
        <Text>Coluna Direita</Text>
      </View>
    </View>
  </View>
);

/**
 * Exemplo 4: Layout Sidebar (3+1)
 */
export const SidebarLayout = () => (
  <View style={container}>
    <View style={row}>
      <View style={[columns.col3, styles.column]}>
        <Text>Conteúdo Principal (75%)</Text>
      </View>
      <View style={[columns.col1, styles.column]}>
        <Text>Sidebar (25%)</Text>
      </View>
    </View>
  </View>
);

/**
 * Exemplo 5: Layout Full Width
 */
export const FullWidthLayout = () => (
  <View style={container}>
    <View style={row}>
      <View style={[columns.col4, styles.column]}>
        <Text>Conteúdo Full Width</Text>
      </View>
    </View>
  </View>
);

/**
 * Exemplo 6: Grid com múltiplas linhas
 */
export const MultiRowGrid = () => (
  <View style={container}>
    {/* Linha 1 */}
    <View style={row}>
      <View style={[columns.col4, styles.column]}>
        <Text>Header Full Width</Text>
      </View>
    </View>

    {/* Linha 2 */}
    <View style={[row, { marginTop: gridSpacing.md }]}>
      <View style={[columns.col2, styles.column]}>
        <Text>Card 1</Text>
      </View>
      <View style={[columns.col2, styles.column]}>
        <Text>Card 2</Text>
      </View>
    </View>

    {/* Linha 3 */}
    <View style={[row, { marginTop: gridSpacing.md }]}>
      <View style={[columns.col3, styles.column]}>
        <Text>Main Content</Text>
      </View>
      <View style={[columns.col1, styles.column]}>
        <Text>Aside</Text>
      </View>
    </View>
  </View>
);

/**
 * Exemplo 7: Grid Responsivo com Hook
 */
export const ResponsiveGrid = () => {
  const {
    columns: responsiveColumns,
    isMobile,
    screenWidth,
  } = useResponsiveGrid();

  return (
    <View style={container}>
      <Text>Screen Width: {screenWidth}px</Text>
      <Text>Device: {isMobile ? 'Mobile' : 'Tablet/Desktop'}</Text>

      <View style={row}>
        <View style={[responsiveColumns.col2, styles.column]}>
          <Text>Adaptativo 50%</Text>
        </View>
        <View style={[responsiveColumns.col2, styles.column]}>
          <Text>Adaptativo 50%</Text>
        </View>
      </View>
    </View>
  );
};

/**
 * Exemplo 8: Grid com Espaçamentos
 */
export const GridWithSpacing = () => (
  <View style={container}>
    <View style={row}>
      <View
        style={[columns.col4, styles.column, { marginBottom: gridSpacing.xs }]}
      >
        <Text>Espaçamento XS (8px)</Text>
      </View>
    </View>

    <View style={row}>
      <View
        style={[columns.col4, styles.column, { marginBottom: gridSpacing.md }]}
      >
        <Text>Espaçamento MD (16px)</Text>
      </View>
    </View>

    <View style={row}>
      <View
        style={[columns.col4, styles.column, { marginBottom: gridSpacing.xl }]}
      >
        <Text>Espaçamento XL (32px)</Text>
      </View>
    </View>
  </View>
);

/**
 * Exemplo 9: Card Grid (2x2)
 */
export const CardGrid = () => (
  <View style={container}>
    <View style={row}>
      <View style={[columns.col2, styles.card]}>
        <Text>Card 1</Text>
      </View>
      <View style={[columns.col2, styles.card]}>
        <Text>Card 2</Text>
      </View>
    </View>

    <View style={[row, { marginTop: gridSpacing.md }]}>
      <View style={[columns.col2, styles.card]}>
        <Text>Card 3</Text>
      </View>
      <View style={[columns.col2, styles.card]}>
        <Text>Card 4</Text>
      </View>
    </View>
  </View>
);

/**
 * Exemplo 10: Layout Presets
 */
export const PresetLayouts = () => {
  const preset = layoutPresets.twoColumns;

  return (
    <View style={container}>
      <View style={row}>
        {preset.map((col, index) => (
          <View
            key={index}
            style={[{ width: getSpanWidth(col.span) }, styles.column]}
          >
            <Text>Span {col.span}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  column: {
    backgroundColor: '#E3F2FD',
    padding: gridSpacing.sm,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1976D2',
  },
  card: {
    backgroundColor: '#fff',
    padding: gridSpacing.md,
    minHeight: 100,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
