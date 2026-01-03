/* istanbul ignore file */
/**
 * Border Radius System - Exemplos de Uso
 *
 * Este arquivo demonstra como usar o sistema de border radius do PillMind
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  borderRadius,
  borderRadiusPresets,
  createBorderRadius,
  createSelectiveBorderRadius,
} from './borderRadius';

/**
 * Exemplo 1: Todos os tamanhos de border radius
 */
export const AllSizesExample = () => (
  <View style={styles.container}>
    <View style={[styles.box, { borderRadius: borderRadius.xs }]}>
      <Text>XS (4px)</Text>
    </View>

    <View style={[styles.box, { borderRadius: borderRadius.sm }]}>
      <Text>SM (8px)</Text>
    </View>

    <View style={[styles.box, { borderRadius: borderRadius.md }]}>
      <Text>MD (16px)</Text>
    </View>

    <View style={[styles.box, { borderRadius: borderRadius.lg }]}>
      <Text>LG (24px)</Text>
    </View>

    <View style={[styles.box, { borderRadius: borderRadius.xl }]}>
      <Text>XL (32px)</Text>
    </View>

    <View style={[styles.box, { borderRadius: borderRadius.full }]}>
      <Text>FULL</Text>
    </View>
  </View>
);

/**
 * Exemplo 2: Botões
 */
export const ButtonsExample = () => (
  <View style={styles.container}>
    <View style={[styles.button, borderRadiusPresets.button]}>
      <Text style={styles.buttonText}>Botão Padrão</Text>
    </View>

    <View style={[styles.button, borderRadiusPresets.buttonPill]}>
      <Text style={styles.buttonText}>Botão Pill</Text>
    </View>
  </View>
);

/**
 * Exemplo 3: Cards
 */
export const CardsExample = () => (
  <View style={styles.container}>
    <View style={[styles.card, borderRadiusPresets.card]}>
      <Text>Card Padrão (16px)</Text>
    </View>

    <View style={[styles.card, borderRadiusPresets.cardLarge]}>
      <Text>Card Grande (24px)</Text>
    </View>
  </View>
);

/**
 * Exemplo 4: Inputs
 */
export const InputsExample = () => (
  <View style={styles.container}>
    <View style={[styles.input, borderRadiusPresets.input]}>
      <Text style={styles.inputText}>Input com 8px radius</Text>
    </View>
  </View>
);

/**
 * Exemplo 5: Badges
 */
export const BadgesExample = () => (
  <View style={styles.container}>
    <View style={[styles.badge, borderRadiusPresets.badge]}>
      <Text style={styles.badgeText}>Badge (4px)</Text>
    </View>

    <View style={[styles.badge, borderRadiusPresets.badgePill]}>
      <Text style={styles.badgeText}>Badge Pill</Text>
    </View>
  </View>
);

/**
 * Exemplo 6: Modal/Dialog
 */
export const ModalExample = () => (
  <View style={[styles.modal, borderRadiusPresets.modal]}>
    <Text style={styles.modalTitle}>Modal Title</Text>
    <Text>Modal com 24px border radius</Text>
  </View>
);

/**
 * Exemplo 7: Bottom Sheet
 */
export const BottomSheetExample = () => (
  <View style={[styles.bottomSheet, borderRadiusPresets.bottomSheet]}>
    <View style={styles.handle} />
    <Text>Bottom Sheet</Text>
    <Text style={styles.subtitle}>Arredondado apenas no topo</Text>
  </View>
);

/**
 * Exemplo 8: Avatares
 */
export const AvatarsExample = () => (
  <View style={[styles.container, { flexDirection: 'row', gap: 16 }]}>
    <View style={[styles.avatar, borderRadiusPresets.avatarCircular]}>
      <Text style={styles.avatarText}>JD</Text>
    </View>

    <View style={[styles.avatar, borderRadiusPresets.avatarRounded]}>
      <Text style={styles.avatarText}>AB</Text>
    </View>
  </View>
);

/**
 * Exemplo 9: Chips
 */
export const ChipsExample = () => (
  <View
    style={[
      styles.container,
      { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    ]}
  >
    <View style={[styles.chip, borderRadiusPresets.chip]}>
      <Text style={styles.chipText}>React Native</Text>
    </View>

    <View style={[styles.chip, borderRadiusPresets.chip]}>
      <Text style={styles.chipText}>TypeScript</Text>
    </View>

    <View style={[styles.chip, borderRadiusPresets.chip]}>
      <Text style={styles.chipText}>Expo</Text>
    </View>
  </View>
);

/**
 * Exemplo 10: Border Radius Customizado
 */
export const CustomBorderRadiusExample = () => (
  <View style={styles.container}>
    {/* Usando createBorderRadius */}
    <View style={[styles.box, createBorderRadius('lg')]}>
      <Text>Custom LG (24px)</Text>
    </View>

    {/* Usando createSelectiveBorderRadius */}
    <View
      style={[
        styles.box,
        createSelectiveBorderRadius({
          topLeft: 'xl',
          topRight: 'none',
          bottomLeft: 'none',
          bottomRight: 'xl',
        }),
      ]}
    >
      <Text>Custom Diagonal</Text>
    </View>
  </View>
);

/**
 * Exemplo 11: Arredondamento Seletivo
 */
export const SelectiveBorderRadiusExample = () => (
  <View style={styles.container}>
    <View style={[styles.box, borderRadiusPresets.topOnly]}>
      <Text>Apenas Topo</Text>
    </View>

    <View style={[styles.box, borderRadiusPresets.bottomOnly]}>
      <Text>Apenas Embaixo</Text>
    </View>

    <View style={[styles.box, borderRadiusPresets.leftOnly]}>
      <Text>Apenas Esquerda</Text>
    </View>

    <View style={[styles.box, borderRadiusPresets.rightOnly]}>
      <Text>Apenas Direita</Text>
    </View>
  </View>
);

/**
 * Exemplo 12: Alerts/Toasts
 */
export const AlertsExample = () => (
  <View style={styles.container}>
    <View
      style={[styles.alert, styles.alertSuccess, borderRadiusPresets.alert]}
    >
      <Text style={styles.alertText}>✓ Success message</Text>
    </View>

    <View style={[styles.alert, styles.alertError, borderRadiusPresets.alert]}>
      <Text style={styles.alertText}>✕ Error message</Text>
    </View>

    <View
      style={[styles.alert, styles.alertWarning, borderRadiusPresets.alert]}
    >
      <Text style={styles.alertText}>⚠ Warning message</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  box: {
    padding: 16,
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#1976D2',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#1976D2',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    padding: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  inputText: {
    color: '#666',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#1976D2',
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modal: {
    padding: 24,
    backgroundColor: '#fff',
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  bottomSheet: {
    padding: 24,
    backgroundColor: '#fff',
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: '#1976D2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#1976D2',
  },
  chipText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '500',
  },
  alert: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertSuccess: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  alertError: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  alertWarning: {
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  alertText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
