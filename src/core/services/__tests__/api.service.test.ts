import * as ExpoCrypto from 'expo-crypto';
import { apiService, ApiResponse } from '../api.service';

// Mock global fetch
globalThis.fetch = jest.fn();

describe('ApiService', () => {
  const originalCrypto = globalThis.crypto;

  const mockFetchResponse = (
    ok: boolean,
    body: unknown,
    status?: number
  ): Partial<Response> => {
    const text =
      body === undefined || body === null
        ? ''
        : typeof body === 'string'
          ? body
          : JSON.stringify(body);
    return {
      ok,
      status: status ?? (ok ? 200 : 400),
      statusText: ok ? 'OK' : 'Error',
      text: async () => text,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(globalThis, 'crypto', {
      value: originalCrypto,
      configurable: true,
      writable: true,
    });
  });

  afterAll(() => {
    Object.defineProperty(globalThis, 'crypto', {
      value: originalCrypto,
      configurable: true,
      writable: true,
    });
  });

  describe('get', () => {
    it('should make a successful GET request', async () => {
      const mockData = { id: '1', name: 'Test' };
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
        mockFetchResponse(true, mockData)
      );

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
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
        mockFetchResponse(false, { message: 'Not found' }, 404)
      );

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

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
        mockFetchResponse(true, mockData)
      );

      const result = await apiService.post('/test', postData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(postData),
        })
      );
    });

    it('should handle POST request error', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
        mockFetchResponse(
          false,
          { message: 'Bad request', code: 'BAD_REQUEST' },
          400
        )
      );

      const result = await apiService.post('/test', {});

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Bad request');
      expect(result.error?.code).toBe('BAD_REQUEST');
    });
  });

  describe('timeout', () => {
    it('should timeout after configured time', async () => {
      (globalThis.fetch as jest.Mock).mockImplementationOnce(
        (_url: string, _options?: RequestInit) => {
          // Simular imediatamente um erro de timeout
          const timeoutError = new Error('The user aborted a request.');
          timeoutError.name = 'AbortError';
          return Promise.reject(timeoutError);
        }
      );

      const result = await apiService.get('/test');

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('TIMEOUT');
    });
  });

  describe('network error', () => {
    it('should handle network error', async () => {
      (globalThis.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      const result = await apiService.get('/test');

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Network error');
      expect(result.error?.code).toBe('NETWORK_ERROR');
    });

    it('should return UNKNOWN when fetch rejects a non-Error', async () => {
      (globalThis.fetch as jest.Mock).mockRejectedValueOnce('not an Error');

      const result = await apiService.get('/test');

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('UNKNOWN');
      expect(result.error?.message).toBe('Unknown error occurred');
    });
  });

  describe('request id generation', () => {
    it('uses getRandomValues when randomUUID is missing', async () => {
      Object.defineProperty(globalThis, 'crypto', {
        value: {
          getRandomValues(arr: Uint8Array) {
            for (let i = 0; i < arr.length; i += 1) {
              arr[i] = 0xcd;
            }
            return arr;
          },
        },
        configurable: true,
      });

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
        mockFetchResponse(true, { ok: true })
      );

      const result = await apiService.get('/rid-grv');

      expect(result.success).toBe(true);
    });

    it('uses seq suffix when expo randomUUID throws', async () => {
      Object.defineProperty(globalThis, 'crypto', {
        value: {},
        configurable: true,
      });

      const spy = jest
        .spyOn(ExpoCrypto, 'randomUUID')
        .mockImplementation(() => {
          throw new Error('no native module');
        });

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
        mockFetchResponse(true, { ok: true })
      );

      const result = await apiService.get('/rid-seq');

      spy.mockRestore();

      expect(result.success).toBe(true);
    });
  });

  describe('put', () => {
    it('should make a successful PUT request', async () => {
      const mockData = { id: '1', updated: true };
      const body = { name: 'X' };

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
        mockFetchResponse(true, mockData)
      );

      const result = await apiService.put('/resource/1', body);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/resource/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(body),
        })
      );
    });
  });

  describe('delete', () => {
    it('should make a successful DELETE request', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
        mockFetchResponse(true, { deleted: true })
      );

      const result = await apiService.delete('/resource/1');

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ deleted: true });
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/resource/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('should treat 204 DELETE with empty body as success', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 204,
        statusText: 'No Content',
        text: async () => '',
      });

      const result = await apiService.delete('/resource/1');

      expect(result.success).toBe(true);
      expect(result.data).toBeUndefined();
    });
  });

  describe('postFormData', () => {
    it('should return success when multipart POST succeeds', async () => {
      const payload = { uploaded: true, path: '/a/b.png' };
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
        mockFetchResponse(true, payload)
      );

      const formData = new FormData();
      formData.append('file', new Blob(['x'], { type: 'image/png' }), 'p.png');

      const result = await apiService.postFormData('/upload', formData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(payload);
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/upload'),
        expect.objectContaining({
          method: 'POST',
          body: formData,
        })
      );
    });

    it('should merge extra headers without setting Content-Type', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
        mockFetchResponse(true, {})
      );

      const formData = new FormData();
      await apiService.postFormData('/u', formData, {
        Authorization: 'Bearer t',
      });

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { Authorization: 'Bearer t' },
        })
      );
    });

    it('should map non-OK multipart response using message or error field', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
        mockFetchResponse(false, { error: 'Payload too large' }, 413)
      );

      const result = await apiService.postFormData('/upload', new FormData());

      expect(result.success).toBe(false);
      expect(result.error?.status).toBe(413);
      expect(result.error?.message).toBe('Payload too large');
    });

    it('should return TIMEOUT when multipart fetch aborts', async () => {
      (globalThis.fetch as jest.Mock).mockImplementationOnce(() => {
        const err = new Error('aborted');
        err.name = 'AbortError';
        return Promise.reject(err);
      });

      const result = await apiService.postFormData('/upload', new FormData());

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('TIMEOUT');
    });

    it('should return NETWORK_ERROR on generic multipart failure', async () => {
      (globalThis.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('socket closed')
      );

      const result = await apiService.postFormData('/upload', new FormData());

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('NETWORK_ERROR');
      expect(result.error?.message).toBe('socket closed');
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
