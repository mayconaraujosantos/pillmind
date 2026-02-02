import { logger } from '@shared/utils/logger';
import { useState } from 'react';
import {
  AuthResponse,
  SignInRequest,
  SignUpRequest,
} from '../../domain/models/auth.model';
import { authService } from '../../domain/services/auth.service';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAuthAction = async <T extends SignInRequest | SignUpRequest>(
    actionLabel: 'Sign Up' | 'Sign In',
    data: T,
    action: (payload: T) => Promise<{
      success: boolean;
      data?: AuthResponse;
      error?: { message?: string; code?: string };
    }>
  ) => {
    const actionKey = actionLabel === 'Sign Up' ? 'signUp' : 'signIn';
    const actionLower = actionLabel.toLowerCase();

    logger.info('useAuth', `🚀 ${actionKey} hook called`, {
      email: data.email,
    });
    setLoading(true);
    setError(null);

    try {
      logger.debug('useAuth', `⏳ Validating ${actionLower} data`, {
        email: data.email,
      });
      const response = await action(data);

      if (!response.success) {
        const errorMsg = response.error?.message || `${actionLower} failed`;
        setError(errorMsg);
        logger.warn('useAuth', `❌ ${actionLabel} validation failed`, {
          email: data.email,
          error: errorMsg,
          code: response.error?.code,
        });
        return { success: false, error: response.error };
      }

      logger.info('useAuth', `✅ ${actionLabel} hook completed successfully`, {
        email: data.email,
        userId: response.data?.user.id,
      });
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      logger.error(
        'useAuth',
        `💥 ${actionLabel} exception`,
        {
          email: data.email,
          error: errorMessage,
        },
        err instanceof Error ? err : undefined
      );
      return { success: false, error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignUpRequest) =>
    runAuthAction('Sign Up', data, authService.signUp.bind(authService));

  const signIn = async (data: SignInRequest) =>
    runAuthAction('Sign In', data, authService.signIn.bind(authService));

  const logout = () => {
    logger.info('useAuth', '🚪 Logout hook called');
    setLoading(true);
    setError(null);

    try {
      authService.logout();
      logger.info('useAuth', '✅ Logout hook completed successfully');
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      logger.error(
        'useAuth',
        '💥 Logout exception',
        { error: errorMessage },
        err instanceof Error ? err : undefined
      );
      return { success: false, error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  };

  return {
    signUp,
    signIn,
    logout,
    loading,
    error,
  };
};
