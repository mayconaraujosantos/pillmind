import React from 'react';
import { OnboardingSignIn } from './OnboardingSignIn';

export type OnboardingSignInSimplifiedProps = React.ComponentProps<
  typeof OnboardingSignIn
>;

export const OnboardingSignInSimplified: React.FC<
  OnboardingSignInSimplifiedProps
> = (props) => <OnboardingSignIn {...props} />;
