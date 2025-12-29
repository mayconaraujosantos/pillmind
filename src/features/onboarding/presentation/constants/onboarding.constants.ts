// Flag para forçar exibição do onboarding (útil para desenvolvimento/testes)
// Definir como false em produção
export const FORCE_SHOW_ONBOARDING = true;

export const ONBOARDING_COLORS = {
  BACKGROUND: '#FFFFFF',
  PRIMARY: '#00A896', // Teal color similar to the example
  SECONDARY: '#8E8E93',
  TEXT_PRIMARY: '#2C3E50', // Dark blue-gray for better contrast and harmony
  TEXT_SECONDARY: '#5A6C7D', // Medium blue-gray for better readability
  BUTTON_BACKGROUND: '#00A896',
  BUTTON_TEXT: '#FFFFFF',
  BUTTON_BORDER: '#00A896',
  INDICATOR_ACTIVE: '#00A896',
  INDICATOR_INACTIVE: '#E5E5E5',
} as const;

export const ONBOARDING_TEXTS = {
  SKIP: 'Pular',
  NEXT: 'Próximo',
  GET_STARTED: 'Começar',
  BACK: 'Voltar',
  SIGN_IN: 'SIGN IN',
  SIGN_UP: 'SIGN UP',
} as const;

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  image?: string; // URL da imagem
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: '1',
    title: "DON'T FORGET YOUR MEDICINES.",
    description:
      'Remember what to take. Remember when to take. Remember when to refill. All on your fingertips.',
    image:
      'https://static.vecteezy.com/system/resources/previews/006/787/432/non_2x/hand-drawn-doodle-time-taking-dose-medication-icon-illustration-isolated-vector.jpg',
  },
  {
    id: '2',
    title: "DON'T FORGET YOUR APPOINTMENTS.",
    description:
      'Remember what to go. Remember where to go. Remember what to go for. All on your fingertips.',
    image:
      'https://static.vecteezy.com/system/resources/previews/008/985/375/non_2x/happy-doctor-and-patient-holding-alarm-clock-woman-and-man-in-uniform-setting-time-for-medication-or-appointment-flat-illustration-health-medicine-concept-for-banner-or-landing-web-page-vector.jpg',
  },
  {
    id: '3',
    title: 'FIND THE BEST AND NEAREST SERVICES',
    description:
      'Find the nearest helpline with ease. Find the nearest hospital. Find the best doctors. All on your fingertips.',
    image:
      'https://static.vecteezy.com/system/resources/previews/044/632/641/non_2x/weekend-holiday-flat-illustration-design-vector.jpg',
  },
];
