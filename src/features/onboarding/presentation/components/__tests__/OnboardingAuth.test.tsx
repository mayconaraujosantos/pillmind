import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { OnboardingAuth } from '../OnboardingAuth';

const mockPrimaryPress = jest.fn();
const mockSecondaryPress = jest.fn();

const mockColors = {
  BACKGROUND: '#fff',
  TEXT_PRIMARY: '#111',
  TEXT_SECONDARY: '#666',
  PRIMARY: '#0f0',
  INDICATOR_INACTIVE: '#ccc',
  BUTTON_TEXT: '#fff',
  SKIP_BUTTON_BG: '#eee',
  SKIP_BUTTON_BORDER: '#ddd',
};

let mockLatestValidationVisible = false;
let mockLatestInputs: Array<{
  key?: string;
  secureTextEntry?: boolean;
  rightIcon?: React.ReactElement | null;
}> = [];

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
  FontAwesome5: () => null,
}));

jest.mock('@shared/theme', () => ({
  useTheme: () => ({ isDark: false }),
}));

jest.mock('../../constants/onboarding.constants', () => ({
  getOnboardingColors: () => mockColors,
}));

jest.mock('@shared/components', () => {
  const { View, TouchableOpacity } = require('react-native');
  return {
    ModernInput: (props: {
      rightIcon?: React.ReactElement;
      secureTextEntry?: boolean;
      label?: string;
    }) => {
      mockLatestInputs.push({
        key: props.label,
        secureTextEntry: props.secureTextEntry,
        rightIcon: props.rightIcon ?? null,
      });
      const rightIcon = props.rightIcon
        ? (props.rightIcon as React.ReactElement<{ onPress?: () => void }>)
            .props
        : null;
      return (
        <View>
          {rightIcon ? (
            <TouchableOpacity
              testID={`toggle-${props.label}`}
              onPress={rightIcon.onPress}
            />
          ) : null}
        </View>
      );
    },
    ValidationAlert: ({ visible }: { visible: boolean }) => {
      mockLatestValidationVisible = visible;
      return null;
    },
  };
});

jest.mock('../OnboardingPrimaryButton', () => {
  const { TouchableOpacity } = require('react-native');
  return {
    OnboardingPrimaryButton: ({ onPress }: { onPress?: () => void }) => (
      <TouchableOpacity testID="primary" onPress={onPress} />
    ),
  };
});

jest.mock('../OnboardingSecondaryButton', () => {
  const { TouchableOpacity } = require('react-native');
  return {
    OnboardingSecondaryButton: ({ onPress }: { onPress?: () => void }) => (
      <TouchableOpacity testID="secondary" onPress={onPress} />
    ),
  };
});

describe('OnboardingAuth', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockLatestValidationVisible = false;
    mockLatestInputs = [];
    mockPrimaryPress.mockReset();
    mockSecondaryPress.mockReset();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('shows validation when required fields are empty', () => {
    const fields = [
      {
        key: 'email',
        label: 'Email',
        placeholder: 'Email',
        value: '',
        onChangeText: jest.fn(),
      },
      {
        key: 'password',
        label: 'Password',
        placeholder: 'Password',
        value: '',
        onChangeText: jest.fn(),
      },
    ];

    const { getByTestId } = render(
      <OnboardingAuth
        title="Title"
        subtitle="Subtitle"
        dividerLabel="Divider"
        fields={fields}
        primaryLabel="Continue"
        onPrimaryPress={mockPrimaryPress}
        appleLabel="Apple"
        googleLabel="Google"
      />
    );

    fireEvent.press(getByTestId('primary'));

    expect(mockPrimaryPress).not.toHaveBeenCalled();
    expect(mockLatestValidationVisible).toBe(true);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockLatestValidationVisible).toBe(false);
  });

  it('calls primary action when required fields are filled', () => {
    const fields = [
      {
        key: 'email',
        label: 'Email',
        placeholder: 'Email',
        value: 'user@example.com',
        onChangeText: jest.fn(),
      },
      {
        key: 'password',
        label: 'Password',
        placeholder: 'Password',
        value: 'password',
        onChangeText: jest.fn(),
      },
      {
        key: 'name',
        label: 'Name',
        placeholder: 'Name',
        value: 'User',
        onChangeText: jest.fn(),
      },
    ];

    const { getByTestId } = render(
      <OnboardingAuth
        title="Title"
        subtitle="Subtitle"
        dividerLabel="Divider"
        fields={fields}
        primaryLabel="Continue"
        onPrimaryPress={mockPrimaryPress}
        secondaryLabel="Secondary"
        onSecondaryPress={mockSecondaryPress}
        appleLabel="Apple"
        googleLabel="Google"
        termsText="Terms"
        linkCta={{ text: 'Have account?', linkLabel: 'Login' }}
        footerInfo="Footer"
      />
    );

    fireEvent.press(getByTestId('primary'));
    fireEvent.press(getByTestId('secondary'));

    expect(mockPrimaryPress).toHaveBeenCalled();
    expect(mockSecondaryPress).toHaveBeenCalled();
    expect(mockLatestValidationVisible).toBe(false);
  });

  it('toggles password visibility when eye icon is pressed', () => {
    const fields = [
      {
        key: 'password',
        label: 'Password',
        placeholder: 'Password',
        value: 'password',
        onChangeText: jest.fn(),
      },
    ];

    const { getByTestId, rerender } = render(
      <OnboardingAuth
        title="Title"
        subtitle="Subtitle"
        dividerLabel="Divider"
        fields={fields}
        primaryLabel="Continue"
        onPrimaryPress={mockPrimaryPress}
        appleLabel="Apple"
        googleLabel="Google"
      />
    );

    const initialMatches = mockLatestInputs.filter(
      (input) => input.key === 'Password'
    );
    const initial = initialMatches[initialMatches.length - 1];
    expect(initial?.secureTextEntry).toBe(true);

    fireEvent.press(getByTestId('toggle-Password'));

    mockLatestInputs = [];

    rerender(
      <OnboardingAuth
        title="Title"
        subtitle="Subtitle"
        dividerLabel="Divider"
        fields={fields}
        primaryLabel="Continue"
        onPrimaryPress={mockPrimaryPress}
        appleLabel="Apple"
        googleLabel="Google"
      />
    );

    const updatedMatches = mockLatestInputs.filter(
      (input) => input.key === 'Password'
    );
    const updated = updatedMatches[updatedMatches.length - 1];
    expect(updated?.secureTextEntry).toBe(false);
  });
});
