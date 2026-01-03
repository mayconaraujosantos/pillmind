/**
 * Exemplo de uso do Style Guide
 *
 * Este arquivo mostra exemplos práticos de como usar as cores do style guide
 * em diferentes situações e componentes.
 */

import { StyleSheet } from 'react-native';
import { styleGuide } from '@shared/theme';

/**
 * Exemplo 1: Botões com diferentes estados
 */
export const buttonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: styleGuide.primaryBlue[500],
    borderColor: styleGuide.primaryBlue[500],
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  primaryButtonPressed: {
    backgroundColor: styleGuide.primaryBlue[600],
  },
  primaryButtonDisabled: {
    backgroundColor: styleGuide.neutral[300],
    borderColor: styleGuide.neutral[300],
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderColor: styleGuide.primaryBlue[500],
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  secondaryButtonPressed: {
    backgroundColor: styleGuide.primaryBlue[50],
  },
});

/**
 * Exemplo 2: Cards e Surfaces
 */
export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: styleGuide.neutral[200],
    shadowColor: styleGuide.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHighlighted: {
    borderColor: styleGuide.primaryBlue[500],
    borderWidth: 2,
  },
  cardDark: {
    backgroundColor: styleGuide.neutral[900],
    borderColor: styleGuide.neutral[700],
  },
});

/**
 * Exemplo 3: Tipografia e Textos
 */
export const textStyles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: styleGuide.neutral[900],
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 16,
    fontWeight: '400',
    color: styleGuide.neutral[700],
    lineHeight: 24,
  },
  secondaryText: {
    fontSize: 14,
    fontWeight: '400',
    color: styleGuide.neutral[500],
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
    color: styleGuide.primaryBlue[500],
    textDecorationLine: 'underline',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    color: styleGuide.error[500],
  },
});

/**
 * Exemplo 4: Inputs e Formulários
 */
export const inputStyles = StyleSheet.create({
  input: {
    backgroundColor: styleGuide.neutral[50],
    borderColor: styleGuide.neutral[300],
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: styleGuide.neutral[900],
  },
  inputFocused: {
    borderColor: styleGuide.primaryBlue[500],
    borderWidth: 2,
  },
  inputError: {
    borderColor: styleGuide.error[500],
    borderWidth: 2,
  },
  inputDisabled: {
    backgroundColor: styleGuide.neutral[100],
    color: styleGuide.neutral[400],
  },
  inputPlaceholder: {
    color: styleGuide.neutral[400],
  },
});

/**
 * Exemplo 5: Alertas e Notificações
 */
export const alertStyles = StyleSheet.create({
  alertSuccess: {
    backgroundColor: styleGuide.success[50],
    borderLeftColor: styleGuide.success[500],
    borderLeftWidth: 4,
    padding: 16,
    borderRadius: 8,
  },
  alertSuccessText: {
    color: styleGuide.success[800],
    fontSize: 14,
    fontWeight: '500',
  },
  alertError: {
    backgroundColor: styleGuide.error[50],
    borderLeftColor: styleGuide.error[500],
    borderLeftWidth: 4,
    padding: 16,
    borderRadius: 8,
  },
  alertErrorText: {
    color: styleGuide.error[800],
    fontSize: 14,
    fontWeight: '500',
  },
  alertWarning: {
    backgroundColor: styleGuide.warning[200],
    borderLeftColor: styleGuide.warning[500],
    borderLeftWidth: 4,
    padding: 16,
    borderRadius: 8,
  },
  alertWarningText: {
    color: styleGuide.warning[800],
    fontSize: 14,
    fontWeight: '500',
  },
  alertInfo: {
    backgroundColor: styleGuide.info[200],
    borderLeftColor: styleGuide.info[500],
    borderLeftWidth: 4,
    padding: 16,
    borderRadius: 8,
  },
  alertInfoText: {
    color: styleGuide.info[800],
    fontSize: 14,
    fontWeight: '500',
  },
});

/**
 * Exemplo 6: Badges e Tags
 */
export const badgeStyles = StyleSheet.create({
  badgeSuccess: {
    backgroundColor: styleGuide.success[500],
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  badgeSuccessText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  badgeError: {
    backgroundColor: styleGuide.error[500],
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  badgeErrorText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  badgeWarning: {
    backgroundColor: styleGuide.warning[500],
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  badgeWarningText: {
    color: styleGuide.warning[800],
    fontSize: 12,
    fontWeight: '600',
  },
  badgeInfo: {
    backgroundColor: styleGuide.info[500],
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  badgeInfoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

/**
 * Exemplo 7: Progresso e Indicadores
 */
export const progressStyles = StyleSheet.create({
  progressBar: {
    height: 8,
    backgroundColor: styleGuide.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: styleGuide.primaryBlue[500],
    borderRadius: 4,
  },
  progressFillSuccess: {
    backgroundColor: styleGuide.success[500],
  },
  progressFillError: {
    backgroundColor: styleGuide.error[500],
  },
  progressFillWarning: {
    backgroundColor: styleGuide.warning[500],
  },
});

/**
 * Exemplo 8: Divisores e Bordas
 */
export const dividerStyles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: styleGuide.neutral[200],
    marginVertical: 16,
  },
  dividerThick: {
    height: 2,
    backgroundColor: styleGuide.neutral[300],
    marginVertical: 16,
  },
  dividerVertical: {
    width: 1,
    backgroundColor: styleGuide.neutral[200],
    marginHorizontal: 16,
  },
});

/**
 * Exemplo 9: Ícones
 */
export const iconColors = {
  primary: styleGuide.primaryBlue[500],
  secondary: styleGuide.neutral[500],
  success: styleGuide.success[500],
  error: styleGuide.error[500],
  warning: styleGuide.warning[500],
  info: styleGuide.info[500],
  disabled: styleGuide.neutral[300],
};

/**
 * Exemplo 10: Gradientes
 */
export const gradientColors = {
  primary: [styleGuide.primaryBlue[400], styleGuide.primaryBlue[600]],
  success: [styleGuide.success[500], styleGuide.success[800]],
  error: [styleGuide.error[500], styleGuide.error[800]],
  warning: [styleGuide.warning[500], styleGuide.warning[800]],
  info: [styleGuide.info[500], styleGuide.info[800]],
};
