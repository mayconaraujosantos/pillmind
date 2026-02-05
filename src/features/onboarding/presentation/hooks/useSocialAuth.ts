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
 * Unifica a lógica de modal e autenticação
 */
export const useSocialAuth = (onSuccess?: () => void) => {
  const { signInWithGoogle } = useAuthContext();
  const [modalState, setModalState] = useState<SocialAuthState>({
    visible: false,
    provider: 'google',
    loading: false,
  });

  /**
   * Abre modal de confirmação para autenticação social
   */
  const openSocialAuth = (provider: 'google' | 'apple') => {
    logger.info('useSocialAuth', `Opening ${provider} auth modal`);
    setModalState({
      visible: true,
      provider,
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
      if (provider === 'google') {
        const result = await signInWithGoogle();

        if (result.success) {
          logger.info('useSocialAuth', '✅ Google auth successful');
          closeSocialAuth();
          onSuccess?.();
        } else {
          logger.warn('useSocialAuth', '⚠️ Google auth failed', {
            error: result.error,
          });
          closeSocialAuth();

          // Não mostra erro se usuário cancelou
          if (result.error !== 'Login cancelado pelo usuário') {
            Alert.alert(
              'Erro ao fazer login',
              result.error || 'Erro desconhecido'
            );
          }
        }
      } else {
        // Apple Sign-In ainda não implementado
        logger.warn('useSocialAuth', 'Apple Sign-In not implemented yet');
        closeSocialAuth();
        Alert.alert('Em breve', 'Login com Apple será implementado em breve!');
      }
    } catch (error) {
      logger.error('useSocialAuth', '❌ Social auth error', { error });
      closeSocialAuth();
      Alert.alert(
        'Erro',
        error instanceof Error ? error.message : 'Erro ao fazer login'
      );
    }
  };

  return {
    modalState,
    openSocialAuth,
    closeSocialAuth,
    confirmSocialAuth,
  };
};
