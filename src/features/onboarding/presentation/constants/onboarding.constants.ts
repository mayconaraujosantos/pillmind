// Configurações para desenvolvimento e produção
const DEV_CONFIG = {
  // true = sempre mostra onboarding (bom para testar onboarding)
  // false = respeita o AsyncStorage (bom para testar fluxo de usuário existente)
  FORCE_SHOW_ONBOARDING: true,

  // true = pula splash screen (desenvolvimento mais rápido)
  SKIP_SPLASH: false,

  // true = adiciona botão de debug para resetar onboarding
  SHOW_DEBUG_CONTROLS: true,
};

const PROD_CONFIG = {
  FORCE_SHOW_ONBOARDING: false, // Produção respeita o estado salvo do usuário
  SKIP_SPLASH: false,
  SHOW_DEBUG_CONTROLS: false,
};

// Detecta se é desenvolvimento ou produção
const IS_DEV = __DEV__;
const CONFIG = IS_DEV ? DEV_CONFIG : PROD_CONFIG;

export const FORCE_SHOW_ONBOARDING = CONFIG.FORCE_SHOW_ONBOARDING;
export const SKIP_SPLASH = CONFIG.SKIP_SPLASH;
export const SHOW_DEBUG_CONTROLS = CONFIG.SHOW_DEBUG_CONTROLS;

// Cores fixas para onboarding (não mudam com o tema)
export const ONBOARDING_COLORS = {
  // NOTA: O onboarding sempre usa tema claro por design
  // Se quiser que o onboarding siga o tema do sistema, use useTheme() nos componentes
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

// Função para obter cores adaptáveis baseadas no tema
export const getOnboardingColors = (isDark: boolean) => {
  if (isDark) {
    return {
      BACKGROUND: '#1C1C1E', // Dark background
      PRIMARY: '#00A896',
      SECONDARY: '#98989D',
      TEXT_PRIMARY: '#FFFFFF',
      TEXT_SECONDARY: '#8E8E93',
      BUTTON_BACKGROUND: '#00A896',
      BUTTON_TEXT: '#FFFFFF',
      BUTTON_BORDER: '#00A896',
      INDICATOR_ACTIVE: '#00A896',
      INDICATOR_INACTIVE: '#3A3A3C',
      SKIP_BUTTON_BG: 'rgba(58, 58, 60, 0.9)',
      SKIP_BUTTON_BORDER: '#FFFFFF',
    };
  }

  return {
    BACKGROUND: '#FFFFFF',
    PRIMARY: '#00A896',
    SECONDARY: '#8E8E93',
    TEXT_PRIMARY: '#2C3E50',
    TEXT_SECONDARY: '#5A6C7D',
    BUTTON_BACKGROUND: '#00A896',
    BUTTON_TEXT: '#FFFFFF',
    BUTTON_BORDER: '#00A896',
    INDICATOR_ACTIVE: '#00A896',
    INDICATOR_INACTIVE: '#E5E5E5',
    SKIP_BUTTON_BG: 'rgba(255, 255, 255, 0.9)',
    SKIP_BUTTON_BORDER: 'rgba(142, 142, 147, 0.25)',
  };
};

export const ONBOARDING_TEXTS = {
  SKIP: 'Skip',
  NEXT: 'Next',
  GET_STARTED: 'Get Started',
  BACK: 'Back',
  SIGN_IN: 'SIGN IN',
  SIGN_UP: 'SIGN UP',
} as const;

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  image?: string; // URL da imagem
  type?: 'info' | 'signup' | 'signin' | 'success'; // Tipo de step: informativo, signup, signin ou success
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: '1',
    title: 'Your health, on schedule',
    description:
      'Take control of your well being with effortless medication reminders.',
    image:
      'https://static.vecteezy.com/system/resources/previews/006/787/432/non_2x/hand-drawn-doodle-time-taking-dose-medication-icon-illustration-isolated-vector.jpg',
    type: 'info',
  },
  {
    id: '2',
    title: 'Advanced reminders, Easy use',
    description:
      'Stay on track with ease and peace of mind, ensuring you never miss a dose.',
    image:
      'https://static.vecteezy.com/system/resources/previews/008/985/375/non_2x/happy-doctor-and-patient-holding-alarm-clock-woman-and-man-in-uniform-setting-time-for-medication-or-appointment-flat-illustration-health-medicine-concept-for-banner-or-landing-web-page-vector.jpg',
    type: 'info',
  },
  {
    id: '3',
    title: 'For yourself, family and friends',
    description:
      'Easily manage medication for everyone you care about with seamless profile switching.',
    image:
      'https://static.vecteezy.com/system/resources/previews/044/632/641/non_2x/weekend-holiday-flat-illustration-design-vector.jpg',
    type: 'info',
  },
  {
    id: '4',
    title: 'Sign Up',
    description: 'Fill in the details to create your account',
    type: 'signup',
  },
  {
    id: '5',
    title: 'Sign In',
    description: 'Sign in to your account',
    type: 'signin',
  },
  {
    id: '6',
    title: 'Sign Up Completed',
    description: 'Account has been created successfully',
    type: 'success',
  },
];
