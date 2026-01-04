/* istanbul ignore file */
/**
 * Typography Usage Examples
 *
 * Exemplos práticos de como usar o sistema de tipografia em diferentes contextos
 */

import { StyleSheet, TextStyle } from 'react-native';
import { typography } from './typography';
import { styleGuide } from './styleGuide';

/**
 * Exemplo 1: Telas de Apresentação (Onboarding/Splash)
 */
export const presentationScreenStyles = StyleSheet.create({
  splashTitle: {
    ...typography.display.display1,
    color: styleGuide.primaryBlue[500],
    textAlign: 'center',
  } as TextStyle,
  onboardingTitle: {
    ...typography.display.display2,
    color: styleGuide.neutral[900],
    textAlign: 'center',
    marginBottom: 16,
  } as TextStyle,
  onboardingDescription: {
    ...typography.body.xlMedium, // 150% line height para melhor legibilidade
    color: styleGuide.neutral[600],
    textAlign: 'center',
  } as TextStyle,
});

/**
 * Exemplo 2: Tela de Login/Cadastro
 */
export const authScreenStyles = StyleSheet.create({
  authTitle: {
    ...typography.heading.h1,
    color: styleGuide.neutral[900],
    marginBottom: 8,
  } as TextStyle,
  authSubtitle: {
    ...typography.body.xlRegular,
    color: styleGuide.neutral[600],
    marginBottom: 32,
  } as TextStyle,
  inputLabel: {
    ...typography.body.lMedium,
    color: styleGuide.neutral[900],
    marginBottom: 8,
  } as TextStyle,
  inputHelper: {
    ...typography.caption.lRegular,
    color: styleGuide.neutral[500],
    marginTop: 4,
  } as TextStyle,
  inputError: {
    ...typography.caption.lRegular,
    color: styleGuide.error[500],
    marginTop: 4,
  } as TextStyle,
  linkText: {
    ...typography.body.mRegular,
    color: styleGuide.primaryBlue[500],
    textDecorationLine: 'underline',
  } as TextStyle,
});

/**
 * Exemplo 3: Cards e Listas
 */
export const cardStyles = StyleSheet.create({
  cardTitle: {
    ...typography.heading.h4,
    color: styleGuide.neutral[900],
    marginBottom: 8,
  } as TextStyle,
  cardSubtitle: {
    ...typography.heading.h6,
    color: styleGuide.neutral[700],
    marginBottom: 4,
  } as TextStyle,
  cardBody: {
    ...typography.body.mRegular,
    color: styleGuide.neutral[700],
    lineHeight: (typography.body.mRegular.fontSize ?? 14) * 1.5, // Aumentar para parágrafos
  } as TextStyle,
  cardCaption: {
    ...typography.caption.lRegular,
    color: styleGuide.neutral[500],
  } as TextStyle,
  listItemTitle: {
    ...typography.body.lMedium,
    color: styleGuide.neutral[900],
  } as TextStyle,
  listItemSubtitle: {
    ...typography.body.mRegular,
    color: styleGuide.neutral[600],
  } as TextStyle,
});

/**
 * Exemplo 4: Botões
 */
export const buttonTextStyles = StyleSheet.create({
  primaryButtonLarge: {
    ...typography.button.lMedium,
    color: '#FFFFFF',
    textAlign: 'center',
  } as TextStyle,
  primaryButtonMedium: {
    ...typography.button.mMedium,
    color: '#FFFFFF',
    textAlign: 'center',
  } as TextStyle,
  primaryButtonSmall: {
    ...typography.button.sMedium,
    color: '#FFFFFF',
    textAlign: 'center',
  } as TextStyle,
  secondaryButtonMedium: {
    ...typography.button.mMedium,
    color: styleGuide.primaryBlue[500],
    textAlign: 'center',
  } as TextStyle,
  textButton: {
    ...typography.button.mRegular,
    color: styleGuide.primaryBlue[500],
    textAlign: 'center',
  } as TextStyle,
  iconButton: {
    ...typography.button.xsMedium,
    color: styleGuide.neutral[700],
  } as TextStyle,
});

/**
 * Exemplo 5: Alertas e Notificações
 */
export const alertStyles = StyleSheet.create({
  alertTitle: {
    ...typography.heading.h6,
    color: styleGuide.neutral[900],
    marginBottom: 4,
  } as TextStyle,
  alertSuccessMessage: {
    ...typography.body.mRegular,
    color: styleGuide.success[800],
  } as TextStyle,
  alertErrorMessage: {
    ...typography.body.mRegular,
    color: styleGuide.error[800],
  } as TextStyle,
  alertWarningMessage: {
    ...typography.body.mRegular,
    color: styleGuide.warning[800],
  } as TextStyle,
  alertInfoMessage: {
    ...typography.body.mRegular,
    color: styleGuide.info[800],
  } as TextStyle,
  toastMessage: {
    ...typography.body.lMedium,
    color: '#FFFFFF',
  } as TextStyle,
});

/**
 * Exemplo 6: Badges e Tags
 */
export const badgeStyles = StyleSheet.create({
  badgeLarge: {
    ...typography.body.xmMedium,
    color: '#FFFFFF',
  } as TextStyle,
  badgeSmall: {
    ...typography.caption.lRegular,
    color: '#FFFFFF',
    fontWeight: '600',
  } as TextStyle,
  tagText: {
    ...typography.body.xmMedium,
    color: styleGuide.primaryBlue[500],
  } as TextStyle,
});

/**
 * Exemplo 7: Formulários
 */
export const formStyles = StyleSheet.create({
  sectionTitle: {
    ...typography.heading.h3,
    color: styleGuide.neutral[900],
    marginBottom: 16,
  } as TextStyle,
  fieldGroupTitle: {
    ...typography.heading.h5,
    color: styleGuide.neutral[800],
    marginTop: 24,
    marginBottom: 12,
  } as TextStyle,
  fieldLabel: {
    ...typography.body.lMedium,
    color: styleGuide.neutral[900],
    marginBottom: 8,
  } as TextStyle,
  fieldValue: {
    ...typography.body.mRegular,
    color: styleGuide.neutral[900],
  } as TextStyle,
  fieldPlaceholder: {
    ...typography.body.mRegular,
    color: styleGuide.neutral[400],
  } as TextStyle,
  fieldHint: {
    ...typography.caption.lRegular,
    color: styleGuide.neutral[500],
    marginTop: 4,
  } as TextStyle,
  requiredIndicator: {
    ...typography.body.lMedium,
    color: styleGuide.error[500],
  } as TextStyle,
  characterCount: {
    ...typography.caption.mRegular,
    color: styleGuide.neutral[500],
    textAlign: 'right',
  } as TextStyle,
});

/**
 * Exemplo 8: Navegação
 */
export const navigationStyles = StyleSheet.create({
  headerTitle: {
    ...typography.heading.h4,
    color: styleGuide.neutral[900],
  } as TextStyle,
  tabLabel: {
    ...typography.body.xmMedium,
    color: styleGuide.neutral[600],
  } as TextStyle,
  tabLabelActive: {
    ...typography.body.xmMedium,
    color: styleGuide.primaryBlue[500],
  } as TextStyle,
  breadcrumb: {
    ...typography.body.mRegular,
    color: styleGuide.neutral[600],
  } as TextStyle,
  breadcrumbActive: {
    ...typography.body.lMedium,
    color: styleGuide.neutral[900],
  } as TextStyle,
});

/**
 * Exemplo 9: Estados Vazios e Erros
 */
export const emptyStateStyles = StyleSheet.create({
  emptyTitle: {
    ...typography.heading.h3,
    color: styleGuide.neutral[900],
    textAlign: 'center',
    marginBottom: 8,
  } as TextStyle,
  emptyDescription: {
    ...typography.body.xlRegular,
    color: styleGuide.neutral[600],
    textAlign: 'center',
    marginBottom: 24,
  } as TextStyle,
  errorTitle: {
    ...typography.heading.h4,
    color: styleGuide.error[500],
    textAlign: 'center',
    marginBottom: 8,
  } as TextStyle,
  errorDescription: {
    ...typography.body.mRegular,
    color: styleGuide.neutral[700],
    textAlign: 'center',
  } as TextStyle,
});

/**
 * Exemplo 10: Dashboard e Métricas
 */
export const dashboardStyles = StyleSheet.create({
  pageTitle: {
    ...typography.heading.h2,
    color: styleGuide.neutral[900],
    marginBottom: 24,
  } as TextStyle,
  sectionTitle: {
    ...typography.heading.h4,
    color: styleGuide.neutral[900],
    marginBottom: 16,
  } as TextStyle,
  metricValue: {
    ...typography.display.display3,
    color: styleGuide.primaryBlue[500],
  } as TextStyle,
  metricLabel: {
    ...typography.body.lMedium,
    color: styleGuide.neutral[600],
  } as TextStyle,
  metricSubtext: {
    ...typography.caption.lRegular,
    color: styleGuide.neutral[500],
  } as TextStyle,
  statValue: {
    ...typography.heading.h3,
    color: styleGuide.neutral[900],
  } as TextStyle,
  statLabel: {
    ...typography.body.mRegular,
    color: styleGuide.neutral[600],
  } as TextStyle,
});

/**
 * Exemplo 11: Datas e Timestamps
 */
export const dateTimeStyles = StyleSheet.create({
  dateLabel: {
    ...typography.body.lMedium,
    color: styleGuide.neutral[900],
  } as TextStyle,
  timeLabel: {
    ...typography.body.mRegular,
    color: styleGuide.neutral[700],
  } as TextStyle,
  timestamp: {
    ...typography.caption.lRegular,
    color: styleGuide.neutral[500],
  } as TextStyle,
  relativeTime: {
    ...typography.caption.lRegular,
    color: styleGuide.neutral[500],
    fontStyle: 'italic',
  } as TextStyle,
});

/**
 * Exemplo 12: Medicamentos (Contexto do PillMind)
 */
export const medicineStyles = StyleSheet.create({
  medicineName: {
    ...typography.heading.h4,
    color: styleGuide.neutral[900],
  } as TextStyle,
  medicineDosage: {
    ...typography.body.lMedium,
    color: styleGuide.primaryBlue[500],
  } as TextStyle,
  medicineFrequency: {
    ...typography.body.mRegular,
    color: styleGuide.neutral[700],
  } as TextStyle,
  medicineNotes: {
    ...typography.body.mRegular,
    color: styleGuide.neutral[600],
    lineHeight: (typography.body.mRegular.fontSize ?? 14) * 1.5,
  } as TextStyle,
  medicineTime: {
    ...typography.heading.h6,
    color: styleGuide.neutral[900],
  } as TextStyle,
  reminderLabel: {
    ...typography.caption.lRegular,
    color: styleGuide.neutral[500],
  } as TextStyle,
});

/**
 * Exemplo 13: Perfil e Configurações
 */
export const profileStyles = StyleSheet.create({
  userName: {
    ...typography.heading.h2,
    color: styleGuide.neutral[900],
  } as TextStyle,
  userEmail: {
    ...typography.body.mRegular,
    color: styleGuide.neutral[600],
  } as TextStyle,
  settingSectionTitle: {
    ...typography.heading.h5,
    color: styleGuide.neutral[900],
    marginTop: 24,
    marginBottom: 12,
  } as TextStyle,
  settingLabel: {
    ...typography.body.lMedium,
    color: styleGuide.neutral[900],
  } as TextStyle,
  settingDescription: {
    ...typography.body.mRegular,
    color: styleGuide.neutral[600],
    marginTop: 4,
  } as TextStyle,
  settingValue: {
    ...typography.body.mRegular,
    color: styleGuide.primaryBlue[500],
  } as TextStyle,
});
