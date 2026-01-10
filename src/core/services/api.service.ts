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
  private baseUrl: string;
  private readonly timeout: number;

  constructor() {
    this.baseUrl = config.api.baseUrl;
    this.timeout = config.api.timeout;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    const requestId = `${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

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
        logger.warn('ApiService', `⚠️ API returned error`, {
          requestId,
          endpoint,
          status: response.status,
          statusText: response.statusText,
          errorMessage: data.message,
          duration,
        });

        return {
          success: false,
          error: {
            message: data.message || 'Request failed',
            status: response.status,
            code: data.code,
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

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
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
