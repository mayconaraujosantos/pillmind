import { randomUUID as expoRandomUUID } from 'expo-crypto';
import { config } from '../config';
import { logger } from '@shared/utils/logger';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

class ApiService {
  private static requestIdSeq = 0;

  private baseUrl: string;
  private readonly timeout: number;

  constructor() {
    this.baseUrl = config.api.baseUrl;
    this.timeout = config.api.timeout;
  }

  /**
   * Correlation id for logs: Web Crypto when available (Node/tests),
   * else expo-crypto on native. Last resort is timestamp + seq (no PRNG).
   */
  private nextRequestId(): string {
    const ts = Date.now();
    const webCrypto = globalThis.crypto;
    if (webCrypto?.randomUUID) {
      return `${ts}-${webCrypto.randomUUID()}`;
    }
    if (webCrypto?.getRandomValues) {
      const bytes = new Uint8Array(8);
      webCrypto.getRandomValues(bytes);
      const hex = [...bytes]
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      return `${ts}-${hex}`;
    }
    try {
      return `${ts}-${expoRandomUUID()}`;
    } catch {
      ApiService.requestIdSeq += 1;
      return `${ts}-seq${ApiService.requestIdSeq}`;
    }
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    const requestId = this.nextRequestId();

    logger.debug('ApiService', `📤 Starting request`, {
      requestId,
      endpoint,
      method: options?.method || 'GET',
      url: `${this.baseUrl}${endpoint}`,
    });

    try {
      const startTime = Date.now();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data?.message || data?.error || 'Request failed';

        logger.warn('ApiService', `⚠️ API returned error`, {
          requestId,
          endpoint,
          status: response.status,
          statusText: response.statusText,
          errorMessage,
          duration,
        });

        return {
          success: false,
          error: {
            message: errorMessage,
            status: response.status,
            code: data?.code,
          },
        };
      }

      logger.info('ApiService', `✅ Request successful`, {
        requestId,
        endpoint,
        status: response.status,
        duration,
        dataKeys: Object.keys(data),
      });

      return {
        success: true,
        data,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          logger.error('ApiService', `⏱️ Request timeout`, {
            requestId,
            endpoint,
            timeout: this.timeout,
          });

          return {
            success: false,
            error: {
              message: 'Request timeout',
              code: 'TIMEOUT',
            },
          };
        }

        logger.error(
          'ApiService',
          `❌ Network error`,
          {
            requestId,
            endpoint,
            errorMessage: error.message,
            errorName: error.name,
          },
          error
        );

        return {
          success: false,
          error: {
            message: error.message,
            code: 'NETWORK_ERROR',
          },
        };
      }

      logger.error('ApiService', `❌ Unknown error`, {
        requestId,
        endpoint,
        error: String(error),
      });

      return {
        success: false,
        error: {
          message: 'Unknown error occurred',
          code: 'UNKNOWN',
        },
      };
    }
  }

  async get<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...options,
    });
  }

  async delete<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      ...options,
    });
  }

  /**
   * POST multipart (não define Content-Type — o runtime define o boundary).
   */
  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    extraHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    const requestId = this.nextRequestId();

    logger.debug('ApiService', `📤 Starting multipart request`, {
      requestId,
      endpoint,
      url: `${this.baseUrl}${endpoint}`,
    });

    try {
      const startTime = Date.now();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: extraHeaders ?? {},
      });

      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;

      const data: unknown = await response.json();

      if (!response.ok) {
        const errBody = data as { message?: string; error?: string };
        const errorMessage =
          errBody?.message || errBody?.error || 'Request failed';

        logger.warn('ApiService', `⚠️ Multipart API error`, {
          requestId,
          endpoint,
          status: response.status,
          errorMessage,
          duration,
        });

        return {
          success: false,
          error: {
            message: errorMessage,
            status: response.status,
          },
        };
      }

      logger.info('ApiService', `✅ Multipart request successful`, {
        requestId,
        endpoint,
        duration,
      });

      return {
        success: true,
        data: data as T,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: { message: 'Request timeout', code: 'TIMEOUT' },
        };
      }

      return {
        success: false,
        error: {
          message:
            error instanceof Error ? error.message : 'Unknown error occurred',
          code: 'NETWORK_ERROR',
        },
      };
    }
  }

  // Update base URL (useful for switching between environments)
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}

export const apiService = new ApiService();
