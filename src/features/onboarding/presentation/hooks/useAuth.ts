import { useState } from 'react';
import { authService } from '../../domain/services/auth.service';
import { SignUpRequest, SignInRequest } from '../../domain/models/auth.model';
import { logger } from '@shared/utils/logger';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async (data: SignUpRequest) => {
    logger.info('useAuth', '🚀 signUp hook called', { email: data.email });
    setLoading(true);
    setError(null);

    try {
      logger.debug('useAuth', '⏳ Validating sign up data', {
        email: data.email,
      });
      const response = await authService.signUp(data);

      if (!response.success) {
        const errorMsg = response.error?.message || 'Sign up failed';
        setError(errorMsg);
        logger.warn('useAuth', `❌ Sign Up validation failed`, {
          email: data.email,
          error: errorMsg,
          code: response.error?.code,
        });
        return { success: false, error: response.error };
      }

      logger.info('useAuth', `✅ Sign Up hook completed successfully`, {
        email: data.email,
        userId: response.data?.user.id,
      });
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      logger.error(
        'useAuth',
        `💥 Sign Up exception`,
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

  const signIn = async (data: SignInRequest) => {
    logger.info('useAuth', '🚀 signIn hook called', { email: data.email });
    setLoading(true);
    setError(null);

    try {
      logger.debug('useAuth', '⏳ Validating sign in data', {
        email: data.email,
      });
      const response = await authService.signIn(data);

      if (!response.success) {
        const errorMsg = response.error?.message || 'Sign in failed';
        setError(errorMsg);
        logger.warn('useAuth', `❌ Sign In validation failed`, {
          email: data.email,
          error: errorMsg,
          code: response.error?.code,
        });
        return { success: false, error: response.error };
      }

      logger.info('useAuth', `✅ Sign In hook completed successfully`, {
        email: data.email,
        userId: response.data?.user.id,
      });
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      logger.error(
        'useAuth',
        `💥 Sign In exception`,
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
