import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { ExpoRouterTabParamList } from '../types';

const TAB_ICONS: Record<
  keyof ExpoRouterTabParamList,
  {
    focused: keyof typeof Ionicons.glyphMap;
    unfocused: keyof typeof Ionicons.glyphMap;
  }
> = {
  index: { focused: 'home', unfocused: 'home-outline' },
  appointments: { focused: 'calendar', unfocused: 'calendar-outline' },
  account: { focused: 'person', unfocused: 'person-outline' },
  parental: { focused: 'shield', unfocused: 'shield-outline' },
  nearby: { focused: 'location', unfocused: 'location-outline' },
};

const SPRING = { damping: 14, stiffness: 160, mass: 0.8 };

interface TabBarIconProps {
  routeName: keyof ExpoRouterTabParamList;
  focused: boolean;
  color: string;
  size: number;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({
  routeName,
  focused,
  color,
  size,
}) => {
  const icons = TAB_ICONS[routeName];
  const iconName = focused ? icons.focused : icons.unfocused;
  const progress = useSharedValue(focused ? 1 : 0);

  React.useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, SPRING);
  }, [focused, progress]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(progress.value, [0, 1], [1, 1.14]) },
      { translateY: interpolate(progress.value, [0, 1], [0, -2]) },
    ],
  }));

  const dotStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.4, 1]) }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={iconStyle}>
        <Ionicons name={iconName} size={size} color={color} />
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[styles.activeDot, { backgroundColor: color }, dotStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    marginTop: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
