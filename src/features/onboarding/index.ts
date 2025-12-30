// Exporta o Container como OnboardingScreen para manter compatibilidade
export { OnboardingContainer as OnboardingScreen } from './presentation/screens/OnboardingContainer';

// Exporta hooks
export { useOnboardingStorage } from './presentation/hooks/useOnboardingStorage';
export { useOnboardingScroll } from './presentation/hooks/useOnboardingScroll';

// Exporta tipos e constantes
export type { OnboardingStep } from './presentation/constants/onboarding.constants';
export { FORCE_SHOW_ONBOARDING } from './presentation/constants/onboarding.constants';

// Exporta novos componentes para uso avançado
export { OnboardingView } from './presentation/components/OnboardingView';
export { OnboardingHeader } from './presentation/components/OnboardingHeader';
export { OnboardingFooter } from './presentation/components/OnboardingFooter';
export { OnboardingCarousel } from './presentation/components/OnboardingCarousel';
