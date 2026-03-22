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
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
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

      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

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
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
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
  });

  describe('postFormData', () => {
    it('should return success when multipart POST succeeds', async () => {
      const payload = { uploaded: true, path: '/a/b.png' };
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => payload,
      });

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
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

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
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 413,
        json: async () => ({ error: 'Payload too large' }),
      });

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
