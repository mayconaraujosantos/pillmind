import React from 'react';
import { render } from '@testing-library/react-native';
import { AppointmentsScreen } from '../AppointmentsScreen';

describe('AppointmentsScreen', () => {
  it('should render correctly', () => {
    const { getByText } = render(<AppointmentsScreen />);

    expect(getByText('Appointments')).toBeTruthy();
    expect(getByText('Appointments Screen Content')).toBeTruthy();
  });
});
