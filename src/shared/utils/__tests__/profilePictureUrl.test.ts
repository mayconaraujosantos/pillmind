import { resolveProfilePictureUrlForDevice } from '../profilePictureUrl';

jest.mock('@core/config', () => ({
  config: {
    api: { baseUrl: 'http://192.168.1.7:8080', timeout: 30000 },
    media: { minioPublicBaseUrl: '', minioInferredPort: 9000 },
  },
}));

describe('resolveProfilePictureUrlForDevice', () => {
  it('returns non-http URIs unchanged', () => {
    expect(resolveProfilePictureUrlForDevice('file:///a/b.jpg')).toBe(
      'file:///a/b.jpg'
    );
  });

  it('returns remote URLs unchanged when not loopback', () => {
    expect(
      resolveProfilePictureUrlForDevice('https://cdn.example.com/p.png')
    ).toBe('https://cdn.example.com/p.png');
  });

  it('rewrites loopback MinIO URL using API host (LAN inference)', () => {
    expect(
      resolveProfilePictureUrlForDevice(
        'http://127.0.0.1:9000/pillmind/profiles/u1/abc.jpg'
      )
    ).toBe('http://192.168.1.7:9000/pillmind/profiles/u1/abc.jpg');
  });

  it('rewrites localhost same as 127.0.0.1', () => {
    expect(
      resolveProfilePictureUrlForDevice(
        'http://localhost:9000/pillmind/profiles/x/y.webp'
      )
    ).toBe('http://192.168.1.7:9000/pillmind/profiles/x/y.webp');
  });

  it('preserves query string', () => {
    expect(
      resolveProfilePictureUrlForDevice(
        'http://127.0.0.1:9000/pillmind/a.png?v=1'
      )
    ).toBe('http://192.168.1.7:9000/pillmind/a.png?v=1');
  });
});
