import i18n from '@shared/i18n/i18n.config';
import { OnboardingStep } from '../constants/onboarding.constants';

export const getOnboardingSteps = (): OnboardingStep[] => {
  return [
    {
      id: '1',
      title: i18n.t('onboarding.step1.title'),
      description: i18n.t('onboarding.step1.description'),
      image:
        'https://static.vecteezy.com/system/resources/previews/006/787/432/non_2x/hand-drawn-doodle-time-taking-dose-medication-icon-illustration-isolated-vector.jpg',
      type: 'info' as const,
    },
    {
      id: '2',
      title: i18n.t('onboarding.step2.title'),
      description: i18n.t('onboarding.step2.description'),
      image:
        'https://static.vecteezy.com/system/resources/previews/008/985/375/non_2x/happy-doctor-and-patient-holding-alarm-clock-woman-and-man-in-uniform-setting-time-for-medication-or-appointment-flat-illustration-health-medicine-concept-for-banner-or-landing-web-page-vector.jpg',
      type: 'info' as const,
    },
    {
      id: '3',
      title: i18n.t('onboarding.step3.title'),
      description: i18n.t('onboarding.step3.description'),
      image:
        'https://static.vecteezy.com/system/resources/previews/044/632/641/non_2x/weekend-holiday-flat-illustration-design-vector.jpg',
      type: 'info' as const,
    },
  ];
};
