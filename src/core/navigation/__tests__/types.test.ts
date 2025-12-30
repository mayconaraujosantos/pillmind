import type { RootStackParamList, TabParamList } from '../types';

describe('Navigation Types', () => {
  describe('RootStackParamList', () => {
    it('should have correct structure for all routes', () => {
      // Type test - ensure all routes are defined as undefined
      const routeParams: RootStackParamList = {
        Home: undefined,
        Appointments: undefined,
        Account: undefined,
        Parental: undefined,
        Nearby: undefined,
      };

      expect(routeParams.Home).toBeUndefined();
      expect(routeParams.Appointments).toBeUndefined();
      expect(routeParams.Account).toBeUndefined();
      expect(routeParams.Parental).toBeUndefined();
      expect(routeParams.Nearby).toBeUndefined();
    });

    it('should contain all expected routes', () => {
      const expectedRoutes: Array<keyof RootStackParamList> = [
        'Home',
        'Appointments',
        'Account',
        'Parental',
        'Nearby',
      ];

      expect(expectedRoutes.length).toBe(5);
    });
  });

  describe('TabParamList', () => {
    it('should have correct structure for all tab routes', () => {
      const tabParams: TabParamList = {
        HomeTab: undefined,
        AppointmentsTab: undefined,
        AccountTab: undefined,
        ParentalTab: undefined,
        NearbyTab: undefined,
      };

      expect(tabParams.HomeTab).toBeUndefined();
      expect(tabParams.AppointmentsTab).toBeUndefined();
      expect(tabParams.AccountTab).toBeUndefined();
      expect(tabParams.ParentalTab).toBeUndefined();
      expect(tabParams.NearbyTab).toBeUndefined();
    });

    it('should contain all expected tab routes', () => {
      const expectedTabRoutes: Array<keyof TabParamList> = [
        'HomeTab',
        'AppointmentsTab',
        'AccountTab',
        'ParentalTab',
        'NearbyTab',
      ];

      expect(expectedTabRoutes.length).toBe(5);
    });
  });
});
