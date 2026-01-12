import React, { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { OnboardingAuth } from './OnboardingAuth';
import { SocialAuthModal } from './SocialAuthModal';
import { useAuth } from '../hooks/useAuth';
import { useAuthContext } from '../contexts/AuthContext';
import { logger } from '@shared/utils/logger';

interface OnboardingSignInProps {
  onSignInComplete?: () => void;
  onGoToSignUp?: () => void;
}

export const OnboardingSignIn: React.FC<OnboardingSignInProps> = ({
  onSignInComplete,
  onGoToSignUp,
}) => {
  const { t } = useTranslation();
  const { signIn, loading, error } = useAuth();
  const authContext = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [socialAuthModal, setSocialAuthModal] = useState({
    visible: false,
    provider: 'google' as 'apple' | 'google',
    loading: false,
  });

  // Estados para Node-RED discovery (usando variáveis de ambiente)
  const [isDiscovering] = useState(false);
  const [discoveryError] = useState<string | null>(null);
  const nodeRedURL = process.env.EXPO_PUBLIC_NODERED_AUTH_URL || 'http://192.168.1.13:1880/api/auth';

  const getSocialAuthUrl = (provider: 'apple' | 'google'): string => {
    // Usar configurações do .env
    const nodeRedHost = process.env.EXPO_PUBLIC_NODERED_HOST || '192.168.1.13';
    const nodeRedPort = process.env.EXPO_PUBLIC_NODERED_PORT || '1880';
    
    return `http://${nodeRedHost}:${nodeRedPort}/api/auth/${provider}`;
  };

  const handleSignIn = async () => {
    logger.info('OnboardingSignIn', '🔄 Sign in button pressed', {
      email,
      passwordLength: password.length,
    });

    if (!email || !password) {
      logger.warn('OnboardingSignIn', '⚠️ Missing required fields', {
        email: email ? 'filled' : 'empty',
        password: password ? 'filled' : 'empty',
      });
      Alert.alert(t('common.error'), t('errors.pleaseFieldAllFields'));
      return;
    }

    logger.debug('OnboardingSignIn', '📤 Calling signIn with data', { email });
    const result = await signIn({ email, password });

    if (result.success && result.data) {
      logger.info('OnboardingSignIn', '✅ Sign in successful', {
        email,
        userId: result.data?.user.id,
      });
      await authContext.login(result.data);
      // Removed success alert - PostLoginLoadingScreen provides better UX feedback
      onSignInComplete?.();
    } else {
      const errorMsg = error || t('errors.failedToSignIn');
      logger.error('OnboardingSignIn', '❌ Sign in failed', {
        email,
        error: errorMsg,
        code: result.error?.code,
      });
      Alert.alert(t('common.error'), errorMsg);
    }
  };

  const handleSocialSignInClick = (provider: 'apple' | 'google') => {
    // Show modal directly - sem complexidade de descoberta
    setSocialAuthModal({
      visible: true,
      provider,
      loading: false,
    });
  };

  // Extrair funções auxiliares para reduzir complexidade
  const validateNodeRedConnection = () => {
    if (!nodeRedURL) {
      const nodeRedHost = process.env.EXPO_PUBLIC_NODERED_HOST || '192.168.1.13';
      const nodeRedPort = process.env.EXPO_PUBLIC_NODERED_PORT || '1880';
      const errorMessage = discoveryError || `Node-RED não foi encontrado. Verifique se está rodando em ${nodeRedHost}:${nodeRedPort}.`;
      logger.error('OnboardingSignIn', `❌ Node-RED not found for ${socialAuthModal.provider} auth`, {
        discoveryError,
        nodeRedURL,
        isDiscovering
      });
      
      Alert.alert(
        t('errors.networkError'),
        errorMessage,
        [{ text: t('common.ok'), style: 'default' }]
      );
      return false;
    }
    return true;
  };

  const performSocialSignIn = async (provider: 'google' | 'apple', endpoint: string) => {
    logger.info('OnboardingSignIn', `🔐 ${provider} sign in started`);
    logger.debug('OnboardingSignIn', `📡 Calling ${provider} endpoint`, {
      endpoint,
      platform: Platform.OS,
    });

    const startTime = new Date().toISOString();
    logger.debug('OnboardingSignIn', '⏱️ Request started at', { time: startTime });

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: Platform.OS }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `${provider} authentication failed`);
      }

      logger.info('OnboardingSignIn', `✅ ${provider} sign in successful`, { data });
      await authContext.login(data);
      onSignInComplete?.();
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && error.message?.includes('fetch') ? 
        'Request took more than 30 seconds' : 
        error instanceof Error ? error.message : 'Unknown error';

      logger.error('OnboardingSignIn', `⏱️ ${provider} request timeout`, {
        error: errorMessage,
        suggestion: `Ensure Node-RED is running on ${process.env.EXPO_PUBLIC_NODERED_AUTH_URL || 'http://192.168.1.13:1880'} and reachable from your device`
      });

      throw error;
    }
  };

  const handleSocialSignInConfirm = async () => {
    const { provider } = socialAuthModal;

    // Validar conexão Node-RED
    if (!validateNodeRedConnection()) {
      setSocialAuthModal({ visible: false, provider, loading: false });
      return;
    }

    // Start loading
    setSocialAuthModal((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      const endpoint = getSocialAuthUrl(provider);
      await performSocialSignIn(provider, endpoint);
      
      // Hide modal
      setSocialAuthModal({ visible: false, provider, loading: false });
      onSignInComplete?.();
    } catch (err) {
      // Hide modal on error
      setSocialAuthModal({ visible: false, provider, loading: false });

      const errorMessage = err instanceof Error ? err.message : String(err);
      const displayMessage = nodeRedURL 
        ? `${provider} authentication failed: ${errorMessage}` 
        : `${provider} authentication failed. Node-RED not found.`;
      
      logger.error('OnboardingSignIn', `❌ ${provider} error`, {
        error: errorMessage,
        nodeRedURL,
        discoveryError
      });
        
      Alert.alert(t('errors.authenticationError'), displayMessage);
    }
  };

  const handleSocialSignInCancel = () => {
    setSocialAuthModal({
      visible: false,
      provider: socialAuthModal.provider,
      loading: false,
    });
  };

  return (
    <>
      <OnboardingAuth
        title={t('onboarding.signIn.title')}
        subtitle={t('onboarding.signIn.subtitle')}
        dividerLabel={t('onboarding.signIn.or')}
        fields={[
          {
            key: 'email',
            label: t('onboarding.signIn.email'),
            placeholder: t('onboarding.signIn.emailPlaceholder'),
            value: email,
            onChangeText: setEmail,
            keyboardType: 'email-address',
            autoCapitalize: 'none',
          },
          {
            key: 'password',
            label: t('onboarding.signIn.password'),
            placeholder: t('onboarding.signIn.passwordPlaceholder'),
            value: password,
            onChangeText: setPassword,
            secureTextEntry: true,
          },
        ]}
        primaryLabel={t('onboarding.signIn.signInButton')}
        onPrimaryPress={handleSignIn}
        isLoading={loading}
        appleLabel={
          isDiscovering 
            ? 'Descobrindo Node-RED...' 
            : t('onboarding.signIn.continueWithApple')
        }
        onApplePress={() => handleSocialSignInClick('apple')}
        appleDisabled={isDiscovering}
        googleLabel={
          isDiscovering 
            ? 'Descobrindo Node-RED...' 
            : t('onboarding.signIn.continueWithGoogle')
        }
        onGooglePress={() => handleSocialSignInClick('google')}
        googleDisabled={isDiscovering}
        linkCta={{
          text: t('onboarding.signIn.dontHaveAccount'),
          linkLabel: t('onboarding.signIn.signUp'),
          onPress: onGoToSignUp,
        }}
        // Indicação do status do Node-RED
        footerInfo={(() => {
          if (isDiscovering) return '🔍 Descobrindo Node-RED... Aguarde.';
          if (nodeRedURL) return `🟢 Conectado: ${nodeRedURL.replace('http://', '')}`;
          return '🔴 Node-RED não encontrado. Toque nos botões para configurar.';
        })()}
      />
      <SocialAuthModal
        visible={socialAuthModal.visible}
        provider={socialAuthModal.provider}
        loading={socialAuthModal.loading}
        onConfirm={handleSocialSignInConfirm}
        onCancel={handleSocialSignInCancel}
      />
    </>
  );
};
