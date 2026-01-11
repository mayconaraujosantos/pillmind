// Logger utility para observabilidade
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  component: string;
  message: string;
  data?: Record<string, unknown>;
  stack?: string;
  duration?: number; // Para operações assíncronas
  requestId?: string; // Para rastreamento de requisições
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 100;
  private isDev = __DEV__; // Expo dev mode
  private requestTimers = new Map<string, number>();

  private log(
    level: LogLevel,
    component: string,
    message: string,
    data?: Record<string, unknown>,
    stack?: string,
    duration?: number,
    requestId?: string
  ) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
      data,
      stack,
      duration,
      requestId,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    const prefix = `[${entry.timestamp}] [${level}] [${component}]`;
    const logData = data ? JSON.stringify(data, null, 2) : '';
    const durationStr = duration ? ` (${duration}ms)` : '';

    switch (level) {
      case LogLevel.DEBUG:
        if (this.isDev) console.debug(prefix + durationStr, message, logData);
        break;
      case LogLevel.INFO:
        console.log(prefix + durationStr, message, logData);
        break;
      case LogLevel.WARN:
        console.warn(prefix + durationStr, message, logData);
        break;
      case LogLevel.ERROR:
        console.error(prefix + durationStr, message, logData, stack);
        break;
    }
  }

  debug(component: string, message: string, data?: Record<string, unknown>) {
    this.log(LogLevel.DEBUG, component, message, data);
  }

  info(component: string, message: string, data?: Record<string, unknown>) {
    this.log(LogLevel.INFO, component, message, data);
  }

  warn(component: string, message: string, data?: Record<string, unknown>) {
    this.log(LogLevel.WARN, component, message, data);
  }

  error(
    component: string,
    message: string,
    data?: Record<string, unknown>,
    error?: Error
  ) {
    this.log(LogLevel.ERROR, component, message, data, error?.stack);
  }

  // Métodos para rastreamento de requisições
  startTimer(requestId: string): void {
    this.requestTimers.set(requestId, Date.now());
  }

  endTimer(requestId: string): number {
    const startTime = this.requestTimers.get(requestId);
    if (!startTime) return 0;
    const duration = Date.now() - startTime;
    this.requestTimers.delete(requestId);
    return duration;
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  getLogsByComponent(component: string): LogEntry[] {
    return this.logs.filter((log) => log.component.includes(component));
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  getLogsByRequestId(requestId: string): LogEntry[] {
    return this.logs.filter((log) => log.requestId === requestId);
  }

  getLogStats(): {
    total: number;
    byLevel: Record<string, number>;
    byComponent: Record<string, number>;
  } {
    const stats = {
      total: this.logs.length,
      byLevel: { DEBUG: 0, INFO: 0, WARN: 0, ERROR: 0 },
      byComponent: {} as Record<string, number>,
    };

    for (const log of this.logs) {
      stats.byLevel[log.level]++;
      stats.byComponent[log.component] =
        (stats.byComponent[log.component] || 0) + 1;
    }

    return stats;
  }
}

export const logger = new Logger();
