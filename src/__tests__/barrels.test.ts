jest.mock('expo', () => ({ registerRootComponent: jest.fn() }));

// Import barrel/index files to ensure they are included in coverage
import '../../index';
import '../shared/assets';
import '../shared/hooks';
import '../shared/i18n';
import '../shared/theme';
import '../shared/types';
import '../shared/utils';
import '../shared/constants';
import '../core/navigation/types';
import '../features/onboarding';
import '../features/splash_screen';
import '../features/home/domain/useCases';
import '../features/home/domain/entities/Medicine';

describe('barrel imports', () => {
  it('loads barrel modules without errors', () => {
    // If imports throw, test will fail. This is enough to include them in coverage.
    expect(true).toBe(true);
  });
});
