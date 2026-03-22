/**
 * Exemplo de uso de autenticação com Google OAuth2
 *
 * Este arquivo demonstra como implementar login/signup com Google
 * usando o novo fluxo OAuth2 integrado com o backend Java
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import { OnboardingAuth } from './OnboardingAuth';
import { SocialAuthModal } from './SocialAuthModal';
import { useSocialAuth } from '../hooks/useSocialAuth';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';

interface ExampleAuthScreenProps {
  mode: 'signin' | 'signup';
  onSuccess: () => void;
  onSwitchMode: () => void;
}

export const ExampleAuthScreen: React.FC<ExampleAuthScreenProps> = ({
  mode,
  onSuccess,
  onSwitchMode,
}) => {
  const { t } = useTranslation();
  const { signIn, signUp } = useAuth();

  // Estados para formulário tradicional
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Hook para autenticação social (Google/Apple)
  const {
    modalState,
    googleLoading,
    openSocialAuth,
    closeSocialAuth,
    confirmSocialAuth,
  } = useSocialAuth(onSuccess);

  /**
   * Lida com login/signup tradicional (email/senha)
   */
  const handleTraditionalAuth = async () => {
    setLoading(true);
    try {
      if (mode === 'signin') {
        await signIn({ email, password });
      } else {
        await signUp({ name, email, password });
      }
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Lida com clique no botão Google — inicia o fluxo nativo (sem modal).
   */
  const handleGooglePress = () => {
    openSocialAuth('google');
  };

  /**
   * Lida com clique no botão Apple
   * Abre o modal de confirmação
   */
  const handleApplePress = () => {
    openSocialAuth('apple');
  };

  // Campos do formulário
  const fields =
    mode === 'signup'
      ? [
          {
            key: 'name',
            label: t('onboarding.auth.name'),
            placeholder: t('onboarding.auth.namePlaceholder'),
            value: name,
            onChangeText: setName,
            autoCapitalize: 'words' as const,
          },
          {
            key: 'email',
            label: t('onboarding.auth.email'),
            placeholder: t('onboarding.auth.emailPlaceholder'),
            value: email,
            onChangeText: setEmail,
            keyboardType: 'email-address' as const,
            autoCapitalize: 'none' as const,
          },
          {
            key: 'password',
            label: t('onboarding.auth.password'),
            placeholder: t('onboarding.auth.passwordPlaceholder'),
            value: password,
            onChangeText: setPassword,
            secureTextEntry: true,
          },
        ]
      : [
          {
            key: 'email',
            label: t('onboarding.auth.email'),
            placeholder: t('onboarding.auth.emailPlaceholder'),
            value: email,
            onChangeText: setEmail,
            keyboardType: 'email-address' as const,
            autoCapitalize: 'none' as const,
          },
          {
            key: 'password',
            label: t('onboarding.auth.password'),
            placeholder: t('onboarding.auth.passwordPlaceholder'),
            value: password,
            onChangeText: setPassword,
            secureTextEntry: true,
          },
        ];

  return (
    <View style={{ flex: 1 }}>
      <OnboardingAuth
        title={
          mode === 'signin'
            ? t('onboarding.signin.title')
            : t('onboarding.signup.title')
        }
        subtitle={
          mode === 'signin'
            ? t('onboarding.signin.subtitle')
            : t('onboarding.signup.subtitle')
        }
        dividerLabel={t('onboarding.auth.orContinueWith')}
        fields={fields}
        primaryLabel={
          mode === 'signin'
            ? t('onboarding.signin.button')
            : t('onboarding.signup.button')
        }
        onPrimaryPress={handleTraditionalAuth}
        isLoading={loading}
        // Botões sociais
        googleLabel={t('onboarding.auth.continueWithGoogle')}
        onGooglePress={handleGooglePress}
        googleDisabled={loading || googleLoading}
        googleLoading={googleLoading}
        appleLabel={t('onboarding.auth.continueWithApple')}
        onApplePress={handleApplePress}
        appleDisabled={loading || googleLoading}
        // Link para trocar modo
        linkCta={{
          text:
            mode === 'signin'
              ? t('onboarding.signin.noAccount')
              : t('onboarding.signup.hasAccount'),
          linkLabel:
            mode === 'signin'
              ? t('onboarding.signin.signupLink')
              : t('onboarding.signup.signinLink'),
          onPress: onSwitchMode,
        }}
        // Termos (apenas para signup)
        termsText={mode === 'signup' ? t('onboarding.signup.terms') : undefined}
      />

      {/* Modal de confirmação OAuth2 */}
      <SocialAuthModal
        visible={modalState.visible}
        provider={modalState.provider}
        loading={modalState.loading}
        onConfirm={confirmSocialAuth}
        onCancel={closeSocialAuth}
      />
    </View>
  );
};

/**
 * FLUXO DE AUTENTICAÇÃO GOOGLE:
 *
 * 1. Usuário clica no botão Google → openSocialAuth('google') inicia o SDK na hora
 * 2. signInSilently() quando já há sessão Google (sem UI); senão fluxo interativo
 * 3. idToken → POST /api/auth/google
 * 4. Backend valida e cria ou autentica o usuário; retorna JWT
 * 5. onSuccess() e redirecionamento
 *
 * IMPORTANTE:
 * - NÃO há diferença entre signup e signin com OAuth2
 * - Mesmo botão serve para ambos os fluxos
 * - Backend decide automaticamente o que fazer
 * - Se usuário cancelar, nenhum erro é mostrado
 */
