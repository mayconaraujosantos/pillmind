import { logger, LogLevel } from '@shared/utils/logger';

describe('Logger Utility', () => {
  beforeEach(() => {
    logger.clearLogs();
  });

  describe('Log Levels', () => {
    it('should log debug messages', () => {
      logger.debug('TestComponent', 'Debug message', { key: 'value' });
      const logs = logger.getLogs();
      expect(logs.length).toBe(1);
      expect(logs[0].level).toBe(LogLevel.DEBUG);
      expect(logs[0].message).toBe('Debug message');
      expect(logs[0].component).toBe('TestComponent');
      expect(logs[0].data).toEqual({ key: 'value' });
    });

    it('should log info messages', () => {
      logger.info('TestComponent', 'Info message');
      const logs = logger.getLogs();
      expect(logs.length).toBe(1);
      expect(logs[0].level).toBe(LogLevel.INFO);
    });

    it('should log warn messages', () => {
      logger.warn('TestComponent', 'Warn message');
      const logs = logger.getLogs();
      expect(logs[0].level).toBe(LogLevel.WARN);
    });

    it('should log error messages', () => {
      const testError = new Error('Test error');
      logger.error('TestComponent', 'Error message', {}, testError);
      const logs = logger.getLogs();
      expect(logs[0].level).toBe(LogLevel.ERROR);
      expect(logs[0].stack).toBeDefined();
    });
  });

  describe('Logging Features', () => {
    it('should include timestamp in ISO format', () => {
      logger.info('TestComponent', 'Message');
      const logs = logger.getLogs();
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      expect(logs[0].timestamp).toMatch(isoRegex);
    });

    it('should preserve order of logs', () => {
      logger.info('TestComponent', 'First');
      logger.info('TestComponent', 'Second');
      logger.info('TestComponent', 'Third');
      const logs = logger.getLogs();
      expect(logs[0].message).toBe('First');
      expect(logs[1].message).toBe('Second');
      expect(logs[2].message).toBe('Third');
    });

    it('should limit logs to maxLogs (100)', () => {
      for (let i = 0; i < 150; i++) {
        logger.info('TestComponent', `Message ${i}`);
      }
      const logs = logger.getLogs();
      expect(logs.length).toBeLessThanOrEqual(100);
    });
  });

  describe('Timer Methods', () => {
    it('should measure time between start and end', (done) => {
      const requestId = 'test-request-1';
      logger.startTimer(requestId);

      setTimeout(() => {
        const duration = logger.endTimer(requestId);
        expect(duration).toBeGreaterThanOrEqual(50);
        expect(duration).toBeLessThan(150);
        done();
      }, 100);
    });

    it('should return 0 for non-existent timer', () => {
      const duration = logger.endTimer('non-existent');
      expect(duration).toBe(0);
    });
  });

  describe('Query Methods', () => {
    beforeEach(() => {
      logger.info('SignUp', 'Message 1');
      logger.warn('SignUp', 'Message 2');
      logger.debug('SignIn', 'Message 3');
      logger.error('SignIn', 'Message 4');
    });

    it('should filter logs by component', () => {
      const signUpLogs = logger.getLogsByComponent('SignUp');
      expect(signUpLogs.length).toBe(2);
      expect(signUpLogs.every((log) => log.component.includes('SignUp'))).toBe(
        true
      );
    });

    it('should filter logs by level', () => {
      const warnLogs = logger.getLogsByLevel(LogLevel.WARN);
      expect(warnLogs.length).toBe(1);
      expect(warnLogs[0].level).toBe(LogLevel.WARN);
    });

    it('should return empty array for non-matching filters', () => {
      const logs = logger.getLogsByComponent('NonExistent');
      expect(logs.length).toBe(0);
    });
  });

  describe('Export and Clear', () => {
    it('should export logs as JSON string', () => {
      logger.info('TestComponent', 'Test message', { key: 'value' });
      const exported = logger.exportLogs();
      const parsed = JSON.parse(exported);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(1);
      expect(parsed[0].message).toBe('Test message');
    });

    it('should clear all logs', () => {
      logger.info('TestComponent', 'Message 1');
      logger.info('TestComponent', 'Message 2');
      logger.info('TestComponent', 'Message 3');
      expect(logger.getLogs().length).toBe(3);

      logger.clearLogs();
      expect(logger.getLogs().length).toBe(0);
    });
  });

  describe('Log Statistics', () => {
    beforeEach(() => {
      logger.info('SignUp', 'Info 1');
      logger.info('SignUp', 'Info 2');
      logger.warn('SignIn', 'Warn 1');
      logger.error('SignIn', 'Error 1');
      logger.debug('Profile', 'Debug 1');
    });

    it('should calculate correct statistics', () => {
      const stats = logger.getLogStats();
      expect(stats.total).toBe(5);
      expect(stats.byLevel.INFO).toBe(2);
      expect(stats.byLevel.WARN).toBe(1);
      expect(stats.byLevel.ERROR).toBe(1);
      expect(stats.byLevel.DEBUG).toBe(1);
    });

    it('should count logs by component', () => {
      const stats = logger.getLogStats();
      expect(stats.byComponent['SignUp']).toBe(2);
      expect(stats.byComponent['SignIn']).toBe(2);
      expect(stats.byComponent['Profile']).toBe(1);
    });
  });

  describe('Authentication Flow Logging', () => {
    it('should log complete sign up flow', () => {
      // Simulação do fluxo de sign up
      logger.info('OnboardingSignUp', 'Iniciando sign up');
      logger.debug('OnboardingSignUp', 'Validando email', {
        email: 'test@example.com',
      });
      logger.debug('OnboardingSignUp', 'Validando password', { length: 10 });
      logger.debug('useAuth', 'Chamando signUp');
      logger.debug('AuthService', 'Enviando para API');
      logger.info('ApiService', 'Request iniciado', {
        method: 'POST',
        endpoint: '/auth/signup',
      });
      logger.info('ApiService', 'Response recebida', {
        status: 201,
        duration: 245,
      });
      logger.info('AuthService', 'Sign up bem-sucedido', {
        userId: 'user-123',
      });
      logger.info('OnboardingSignUp', 'Exibindo sucesso');

      const logs = logger.getLogs();
      expect(logs.length).toBe(9);

      // Verificar sequência
      expect(logs[0].message).toBe('Iniciando sign up');
      expect(logs[logs.length - 1].message).toBe('Exibindo sucesso');

      // Verificar níveis
      const infoLogs = logs.filter((l) => l.level === LogLevel.INFO);
      expect(infoLogs.length).toBe(5); // ApiService start, response, AuthService success, OnboardingSignUp inicio, OnboardingSignUp sucesso
    });

    it('should log error scenarios', () => {
      logger.info('OnboardingSignUp', 'Iniciando sign up');
      logger.warn('OnboardingSignUp', 'Email inválido', { email: 'invalid' });
      logger.debug('OnboardingSignUp', 'Validação falhou');

      const logs = logger.getLogs();
      expect(logs.length).toBe(3);

      const warnLog = logs.find((l) => l.level === LogLevel.WARN);
      expect(warnLog).toBeDefined();
      expect(warnLog?.data?.email).toBe('invalid');
    });
  });
});
