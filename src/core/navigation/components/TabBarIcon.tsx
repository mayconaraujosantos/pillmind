import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Animated, StyleSheet, View } from 'react-native';
import { TabParamList } from '../types';

const TAB_ICONS: Record<
  keyof TabParamList,
  {
    focused: keyof typeof Ionicons.glyphMap;
    unfocused: keyof typeof Ionicons.glyphMap;
  }
> = {
  HomeTab: { focused: 'home', unfocused: 'home-outline' },
  AppointmentsTab: { focused: 'calendar', unfocused: 'calendar-outline' },
  AccountTab: { focused: 'person', unfocused: 'person-outline' },
  ParentalTab: { focused: 'shield', unfocused: 'shield-outline' },
  NearbyTab: { focused: 'location', unfocused: 'location-outline' },
};

interface TabBarIconProps {
  routeName: keyof TabParamList;
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
  const progress = React.useRef(new Animated.Value(focused ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(progress, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
      friction: 6,
      tension: 110,
    }).start();
  }, [focused, progress]);

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  });
  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -3],
  });
  const haloOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.12],
  });
  const haloScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });
  const dotScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });
  const dotOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.halo,
          {
            width: size + 10,
            height: size + 10,
            borderRadius: (size + 10) / 2,
            opacity: haloOpacity,
            transform: [{ scale: haloScale }],
          },
        ]}
      />
      <Animated.View style={{ transform: [{ scale }, { translateY }] }}>
        <Ionicons name={iconName} size={size} color={color} />
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.activeDot,
          {
            opacity: dotOpacity,
            transform: [{ scale: dotScale }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    backgroundColor: '#4B6BFB',
  },
  activeDot: {
    marginTop: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4B6BFB',
  },
});
