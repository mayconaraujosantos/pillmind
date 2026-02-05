import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@shared/theme';

export type LoaderSize = 'small' | 'large';
export type LoaderVariant = 'fullscreen' | 'inline' | 'overlay';

interface LoaderProps {
  /** Size of the loading indicator */
  size?: LoaderSize;
  /** Variant determines the layout: fullscreen, inline, or overlay */
  variant?: LoaderVariant;
  /** Optional text to display below the indicator */
  message?: string;
  /** Custom color for the indicator (defaults to theme primary) */
  color?: string;
  /** Custom style for the container */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
}

/**
 * Reusable Loader component following professional best practices:
 * - Multiple variants (fullscreen, inline, overlay)
 * - Theme-aware
 * - Accessible
 * - Flexible styling
 */
export const Loader: React.FC<LoaderProps> = ({
  size = 'large',
  variant = 'inline',
  message,
  color,
  style,
  testID = 'loader',
}) => {
  const { theme } = useTheme();
  const indicatorColor = color || theme.colors.primary;

  const containerStyles = [styles.base, styles[variant], style];

  return (
    <View style={containerStyles} testID={testID}>
      <ActivityIndicator
        size={size}
        color={indicatorColor}
        testID={`${testID}-indicator`}
      />
      {message && (
        <Text
          style={[styles.message, { color: theme.colors.textSecondary }]}
          testID={`${testID}-message`}
        >
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreen: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  inline: {
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1000,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
});
