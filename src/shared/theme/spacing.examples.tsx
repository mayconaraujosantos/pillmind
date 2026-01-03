/**
 * Spacing System - Exemplos de Uso
 *
 * Este arquivo demonstra como usar o sistema de spacing do PillMind
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  spacing,
  spacingScale,
  insets,
  stack,
  inline,
  gap,
  componentSpacing,
  createPadding,
  createPaddingHorizontal,
  createPaddingVertical,
  createMargin,
  createMarginHorizontal,
  createMarginVertical,
  createCustomSpacing,
} from './spacing';

/**
 * Exemplo 1: Todos os tamanhos de spacing
 */
export const AllSpacingSizes = () => (
  <ScrollView style={styles.container}>
    <View style={[styles.spacingBox, { padding: spacing.xxs }]}>
      <Text>XXS (4px)</Text>
    </View>
    <View style={[styles.spacingBox, { padding: spacing.xs }]}>
      <Text>XS (8px)</Text>
    </View>
    <View style={[styles.spacingBox, { padding: spacing.sm }]}>
      <Text>SM (16px)</Text>
    </View>
    <View style={[styles.spacingBox, { padding: spacing.md }]}>
      <Text>MD (24px)</Text>
    </View>
    <View style={[styles.spacingBox, { padding: spacing.lg }]}>
      <Text>LG (32px)</Text>
    </View>
    <View style={[styles.spacingBox, { padding: spacing.xl }]}>
      <Text>XL (40px)</Text>
    </View>
    <View style={[styles.spacingBox, { padding: spacing.xxl }]}>
      <Text>XXL (48px)</Text>
    </View>
  </ScrollView>
);

/**
 * Exemplo 2: Insets (Padding)
 */
export const InsetsExample = () => (
  <View style={styles.container}>
    <View style={[styles.card, insets.xs]}>
      <Text>Card com padding XS (8px)</Text>
    </View>

    <View style={[styles.card, insets.sm, { marginTop: spacing.sm }]}>
      <Text>Card com padding SM (16px)</Text>
    </View>

    <View style={[styles.card, insets.md, { marginTop: spacing.sm }]}>
      <Text>Card com padding MD (24px)</Text>
    </View>
  </View>
);

/**
 * Exemplo 3: Stack (Espaçamento Vertical)
 */
export const StackExample = () => (
  <View style={styles.container}>
    <View style={[styles.item, stack.xs]}>
      <Text>Item 1 (8px abaixo)</Text>
    </View>
    <View style={[styles.item, stack.sm]}>
      <Text>Item 2 (16px abaixo)</Text>
    </View>
    <View style={[styles.item, stack.md]}>
      <Text>Item 3 (24px abaixo)</Text>
    </View>
    <View style={styles.item}>
      <Text>Item 4 (sem espaçamento)</Text>
    </View>
  </View>
);

/**
 * Exemplo 4: Inline (Espaçamento Horizontal)
 */
export const InlineExample = () => (
  <View style={[styles.container, { flexDirection: 'row' }]}>
    <View style={[styles.chip, inline.xs]}>
      <Text>Tag 1</Text>
    </View>
    <View style={[styles.chip, inline.xs]}>
      <Text>Tag 2</Text>
    </View>
    <View style={[styles.chip, inline.xs]}>
      <Text>Tag 3</Text>
    </View>
    <View style={styles.chip}>
      <Text>Tag 4</Text>
    </View>
  </View>
);

/**
 * Exemplo 5: Gap (Flexbox)
 */
export const GapExample = () => (
  <View style={styles.container}>
    <View style={{ flexDirection: 'row', gap: gap.sm }}>
      <View style={styles.chip}>
        <Text>Chip 1</Text>
      </View>
      <View style={styles.chip}>
        <Text>Chip 2</Text>
      </View>
      <View style={styles.chip}>
        <Text>Chip 3</Text>
      </View>
    </View>
  </View>
);

/**
 * Exemplo 6: Component Spacing - Botões
 */
export const ButtonSpacingExample = () => (
  <View style={[styles.container, { gap: spacing.sm }]}>
    <View style={[styles.button, componentSpacing.buttonSmall]}>
      <Text style={styles.buttonText}>Botão Pequeno</Text>
    </View>

    <View style={[styles.button, componentSpacing.button]}>
      <Text style={styles.buttonText}>Botão Normal</Text>
    </View>

    <View style={[styles.button, componentSpacing.buttonLarge]}>
      <Text style={styles.buttonText}>Botão Grande</Text>
    </View>
  </View>
);

/**
 * Exemplo 7: Component Spacing - Cards
 */
export const CardSpacingExample = () => (
  <View style={[styles.container, { gap: spacing.sm }]}>
    <View style={[styles.card, componentSpacing.card]}>
      <Text style={styles.cardTitle}>Card Normal</Text>
      <Text>Padding de 16px</Text>
    </View>

    <View style={[styles.card, componentSpacing.cardLarge]}>
      <Text style={styles.cardTitle}>Card Grande</Text>
      <Text>Padding de 24px</Text>
    </View>
  </View>
);

/**
 * Exemplo 8: Helper Functions - Padding
 */
export const PaddingHelpersExample = () => (
  <View style={[styles.container, { gap: spacing.sm }]}>
    <View style={[styles.item, createPadding('md')]}>
      <Text>Padding uniforme (24px)</Text>
    </View>

    <View style={[styles.item, createPaddingHorizontal('lg')]}>
      <Text>Padding horizontal (32px)</Text>
    </View>

    <View style={[styles.item, createPaddingVertical('sm')]}>
      <Text>Padding vertical (16px)</Text>
    </View>
  </View>
);

/**
 * Exemplo 9: Helper Functions - Margin
 */
export const MarginHelpersExample = () => (
  <View style={styles.container}>
    <View style={[styles.item, createMargin('xs')]}>
      <Text>Margin uniforme (8px)</Text>
    </View>

    <View style={[styles.item, createMarginHorizontal('md')]}>
      <Text>Margin horizontal (24px)</Text>
    </View>

    <View style={[styles.item, createMarginVertical('sm')]}>
      <Text>Margin vertical (16px)</Text>
    </View>
  </View>
);

/**
 * Exemplo 10: Custom Spacing
 */
export const CustomSpacingExample = () => (
  <View style={styles.container}>
    <View
      style={[
        styles.card,
        createCustomSpacing({
          top: 'lg',
          right: 'sm',
          bottom: 'md',
          left: 'xl',
        }),
      ]}
    >
      <Text>Custom Spacing</Text>
      <Text style={styles.small}>Top: 32px, Right: 16px</Text>
      <Text style={styles.small}>Bottom: 24px, Left: 40px</Text>
    </View>
  </View>
);

/**
 * Exemplo 11: Spacing Scale (Numérico)
 */
export const SpacingScaleExample = () => (
  <View style={styles.container}>
    <View style={{ padding: spacingScale[0] }}>
      <Text>Scale 0 (0px)</Text>
    </View>
    <View style={{ padding: spacingScale[2], marginTop: spacing.xs }}>
      <Text>Scale 2 (8px)</Text>
    </View>
    <View style={{ padding: spacingScale[4], marginTop: spacing.xs }}>
      <Text>Scale 4 (16px)</Text>
    </View>
    <View style={{ padding: spacingScale[8], marginTop: spacing.xs }}>
      <Text>Scale 8 (32px)</Text>
    </View>
  </View>
);

/**
 * Exemplo 12: Layout Completo com Spacing
 */
export const FullLayoutExample = () => (
  <View style={componentSpacing.page}>
    {/* Header */}
    <View style={[styles.header, stack.lg]}>
      <Text style={styles.title}>Título da Página</Text>
      <Text>Subtítulo</Text>
    </View>

    {/* Content Section 1 */}
    <View style={componentSpacing.section}>
      <Text style={[styles.sectionTitle, stack.sm]}>Seção 1</Text>

      <View style={[styles.card, componentSpacing.card, stack.xs]}>
        <Text>Card 1</Text>
      </View>

      <View style={[styles.card, componentSpacing.card, stack.xs]}>
        <Text>Card 2</Text>
      </View>

      <View style={[styles.card, componentSpacing.card]}>
        <Text>Card 3</Text>
      </View>
    </View>

    {/* Content Section 2 */}
    <View style={componentSpacing.section}>
      <Text style={[styles.sectionTitle, stack.sm]}>Seção 2</Text>

      <View style={{ flexDirection: 'row', gap: gap.sm }}>
        <View style={[styles.chip, { flex: 1 }]}>
          <Text>Chip A</Text>
        </View>
        <View style={[styles.chip, { flex: 1 }]}>
          <Text>Chip B</Text>
        </View>
      </View>
    </View>

    {/* Actions */}
    <View style={{ flexDirection: 'row', gap: gap.sm }}>
      <View style={[styles.button, componentSpacing.button, { flex: 1 }]}>
        <Text style={styles.buttonText}>Cancelar</Text>
      </View>
      <View style={[styles.button, componentSpacing.button, { flex: 1 }]}>
        <Text style={styles.buttonText}>Confirmar</Text>
      </View>
    </View>
  </View>
);

/**
 * Exemplo 13: Lista com Component Spacing
 */
export const ListExample = () => (
  <View style={componentSpacing.page}>
    <Text style={[styles.title, stack.md]}>Lista de Itens</Text>

    <View style={componentSpacing.listItem}>
      <Text>Item 1</Text>
    </View>
    <View style={componentSpacing.listItem}>
      <Text>Item 2</Text>
    </View>
    <View style={componentSpacing.listItem}>
      <Text>Item 3</Text>
    </View>
    <View>
      <Text>Item 4</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: spacing.sm,
  },
  spacingBox: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#1976D2',
    marginBottom: spacing.xs,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xxs,
  },
  item: {
    backgroundColor: '#E3F2FD',
    padding: spacing.xs,
  },
  chip: {
    backgroundColor: '#E3F2FD',
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.xs,
    borderRadius: 16,
  },
  button: {
    backgroundColor: '#1976D2',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  small: {
    fontSize: 12,
    color: '#666',
    marginTop: spacing.xxs,
  },
});
