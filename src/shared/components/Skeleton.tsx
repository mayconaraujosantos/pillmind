import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ViewStyle,
  DimensionValue,
} from 'react-native';
import { useTheme } from '@shared/theme';

interface SkeletonProps {
  /** Width of the skeleton */
  width?: DimensionValue;
  /** Height of the skeleton */
  height?: DimensionValue;
  /** Border radius */
  borderRadius?: number;
  /** Custom style */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
}

/**
 * Skeleton component for loading placeholders.
 * Provides smooth shimmer animation for better UX during data loading.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
  testID = 'skeleton',
}) => {
  const { theme } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();

    return () => shimmer.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const backgroundColor = theme.colors.border || '#E5E5E5';

  const animatedStyle = {
    borderRadius,
    backgroundColor,
    opacity,
  };

  const containerStyle: ViewStyle = {
    width,
    height,
    overflow: 'hidden',
  };

  return (
    <View style={containerStyle}>
      <Animated.View
        testID={testID}
        style={[
          styles.skeleton,
          animatedStyle,
          StyleSheet.absoluteFillObject,
          style,
        ]}
      />
    </View>
  );
};

interface SkeletonCardProps {
  /** Number of lines to show (default: 3) */
  lines?: number;
  /** Show avatar skeleton (default: false) */
  showAvatar?: boolean;
  /** Custom style */
  style?: ViewStyle;
}

/**
 * Pre-configured skeleton for card-like components
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  lines = 3,
  showAvatar = false,
  style,
}) => {
  return (
    <View style={[cardStyles.card, style]}>
      {showAvatar && (
        <View style={cardStyles.avatarContainer}>
          <Skeleton width={48} height={48} borderRadius={24} />
        </View>
      )}
      <View style={cardStyles.content}>
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            width={index === 0 ? '80%' : '100%'}
            height={16}
            style={cardStyles.line}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
});

const cardStyles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  content: {
    flex: 1,
  },
  line: {
    marginBottom: 8,
  },
});
