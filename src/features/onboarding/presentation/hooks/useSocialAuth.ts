import { logger } from '@shared/utils/logger';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuthContext } from '../contexts/AuthContext';

interface SocialAuthState {
  visible: boolean;
  provider: 'google' | 'apple';
  loading: boolean;
}

/**
 * Hook para gerenciar autenticação social (Google/Apple)
 * Google inicia o fluxo nativo direto (sem modal). Apple mantém modal de confirmação.
 */
export const useSocialAuth = (onSuccess?: () => void) => {
  const { signInWithGoogle } = useAuthContext();
  const [modalState, setModalState] = useState<SocialAuthState>({
    visible: false,
    provider: 'google',
    loading: false,
  });
  const [googleLoading, setGoogleLoading] = useState(false);

  const runGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();

      if (result.success) {
        logger.info('useSocialAuth', '✅ Google auth successful');
        onSuccess?.();
      } else {
        logger.warn('useSocialAuth', '⚠️ Google auth failed', {
          error: result.error,
        });
        if (result.error !== 'Login cancelado pelo usuário') {
          Alert.alert(
            'Erro ao fazer login',
            result.error || 'Erro desconhecido'
          );
        }
      }
    } catch (error) {
      logger.error('useSocialAuth', '❌ Google auth error', { error });
      Alert.alert(
        'Erro',
        error instanceof Error ? error.message : 'Erro ao fazer login'
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  /**
   * Google: fluxo nativo imediato. Apple: modal de confirmação.
   */
  const openSocialAuth = (provider: 'google' | 'apple') => {
    if (provider === 'google') {
      logger.info('useSocialAuth', 'Starting Google sign-in (no modal)');
      void runGoogleSignIn();
      return;
    }
    logger.info('useSocialAuth', 'Opening Apple auth modal');
    setModalState({
      visible: true,
      provider: 'apple',
      loading: false,
    });
  };

  /**
   * Fecha modal de autenticação social
   */
  const closeSocialAuth = () => {
    logger.info('useSocialAuth', 'Closing social auth modal');
    setModalState((prev) => ({
      ...prev,
      visible: false,
      loading: false,
    }));
  };

  /**
   * Confirma autenticação social e executa o fluxo
   */
  const confirmSocialAuth = async () => {
    const { provider } = modalState;
    logger.info('useSocialAuth', `Confirming ${provider} auth`);

    // Mostra loading no modal
    setModalState((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      if (provider === 'apple') {
        // Apple Sign-In ainda não implementado
        logger.warn('useSocialAuth', 'Apple Sign-In not implemented yet');
        Alert.alert('Em breve', 'Login com Apple será implementado em breve!');
      }
    } catch (error) {
      logger.error('useSocialAuth', '❌ Social auth error', { error });
      Alert.alert(
        'Erro',
        error instanceof Error ? error.message : 'Erro ao fazer login'
      );
    } finally {
      closeSocialAuth();
    }
  };

  return {
    modalState,
    googleLoading,
    openSocialAuth,
    closeSocialAuth,
    confirmSocialAuth,
  };
};
