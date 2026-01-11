import { apiService, ApiResponse } from '../api.service';

// Mock global fetch
globalThis.fetch = jest.fn();

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should make a successful GET request', async () => {
      const mockData = { id: '1', name: 'Test' };
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result: ApiResponse<typeof mockData> = await apiService.get(
        '/test'
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should handle GET request error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not found' }),
      });

      const result = await apiService.get('/test');

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Not found');
      expect(result.error?.status).toBe(404);
    });
  });

  describe('post', () => {
    it('should make a successful POST request', async () => {
      const mockData = { id: '1', created: true };
      const postData = { name: 'Test' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiService.post('/test', postData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(postData),
        })
      );
    });

    it('should handle POST request error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Bad request', code: 'BAD_REQUEST' }),
      });

      const result = await apiService.post('/test', {});

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Bad request');
      expect(result.error?.code).toBe('BAD_REQUEST');
    });
  });

  describe('timeout', () => {
    it('should timeout after configured time', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(
        (_url: string, options?: RequestInit) => {
          return new Promise((_resolve, reject) => {
            // Simular o comportamento do AbortController
            const timeout = setTimeout(() => {
              const abortError = new Error('The user aborted a request.');
              abortError.name = 'AbortError';
              reject(abortError);
            }, 30000); // Timeout configurado no config

            // Se o signal for abortado antes do timeout, rejeitar imediatamente
            if (options?.signal) {
              options.signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                const abortError = new Error('The user aborted a request.');
                abortError.name = 'AbortError';
                reject(abortError);
              });
            }
          });
        }
      );

      const result = await apiService.get('/test');

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('TIMEOUT');
    }, 35000); // Timeout de 35 segundos para o teste
  });

  describe('network error', () => {
    it('should handle network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      const result = await apiService.get('/test');

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Network error');
      expect(result.error?.code).toBe('NETWORK_ERROR');
    });
  });

  describe('setBaseUrl', () => {
    it('should update base URL', () => {
      const newUrl = 'https://new-api.example.com';
      apiService.setBaseUrl(newUrl);

      expect(apiService.getBaseUrl()).toBe(newUrl);
    });
  });
});
