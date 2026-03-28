import { resolveMedicineImageUrlForDevice } from '../medicineImageUrl';

// Mock da configuração
jest.mock('@core/config', () => ({
  config: {
    media: { 
      minioPublicBaseUrl: 'http://192.168.1.4:8080/api/media', 
      minioInferredPort: 9000 
    },
    api: { baseUrl: 'http://192.168.1.4:8080' },
  },
}));

describe('resolveMedicineImageUrlForDevice', () => {
  it('should return undefined for null/empty URLs', () => {
    expect(resolveMedicineImageUrlForDevice(null)).toBeUndefined();
    expect(resolveMedicineImageUrlForDevice('')).toBeUndefined();
    expect(resolveMedicineImageUrlForDevice('  ')).toBe('  ');
  });

  it('should not modify external URLs', () => {
    expect(
      resolveMedicineImageUrlForDevice('https://cdn.example.com/med.png')
    ).toBe('https://cdn.example.com/med.png');
  });

  it('should rewrite localhost URLs using explicit MinIO config', () => {
    expect(
      resolveMedicineImageUrlForDevice(
        'http://127.0.0.1:9000/pillmind/medicines/123.jpg'
      )
    ).toBe('http://192.168.1.4:8080/pillmind/medicines/123.jpg');
  });

  it('should rewrite Docker hostname URLs', () => {
    expect(
      resolveMedicineImageUrlForDevice(
        'http://minio:9000/pillmind/medicines/456.jpg'
      )
    ).toBe('http://192.168.1.4:8080/pillmind/medicines/456.jpg');
  });

  it('should handle URLs with query parameters', () => {
    expect(
      resolveMedicineImageUrlForDevice(
        'http://localhost:9000/pillmind/medicines/789.jpg?v=1'
      )
    ).toBe('http://192.168.1.4:8080/pillmind/medicines/789.jpg?v=1');
  });
});