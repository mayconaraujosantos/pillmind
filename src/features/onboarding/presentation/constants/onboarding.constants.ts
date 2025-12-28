// Flag para forçar exibição do onboarding (útil para desenvolvimento/testes)
// Definir como false em produção
export const FORCE_SHOW_ONBOARDING = true; // TODO: Mudar para false em produção

export const ONBOARDING_COLORS = {
  BACKGROUND: '#FFFFFF',
  PRIMARY: '#00A896', // Teal color similar to the example
  SECONDARY: '#8E8E93',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
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
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&h=800&fit=crop&q=90',
  },
  {
    id: '2',
    title: "DON'T FORGET YOUR APPOINTMENTS.",
    description:
      'Remember what to go. Remember where to go. Remember what to go for. All on your fingertips.',
    image:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=800&fit=crop&q=90',
  },
  {
    id: '3',
    title: 'FIND THE BEST AND NEAREST SERVICES',
    description:
      'Find the nearest helpline with ease. Find the nearest hospital. Find the best doctors. All on your fingertips.',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=800&fit=crop&q=90',
  },
];
