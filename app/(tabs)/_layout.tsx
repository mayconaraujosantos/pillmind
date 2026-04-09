import { TabBarIcon } from '@core/navigation/components/TabBarIcon';
import type { ExpoRouterTabParamList } from '@core/navigation/types';
import { useAuthContext } from '@features/onboarding/presentation/contexts/AuthContext';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Spring / timing configs ────────────────────────────────────────────────

const INDICATOR_SPRING = { damping: 18, stiffness: 200, mass: 0.9 };
const LABEL_SPRING = { damping: 16, stiffness: 180, mass: 0.7 };
const PRESS_SPRING = { damping: 12, stiffness: 200, mass: 0.6 };

// ─── Per-tab item ────────────────────────────────────────────────────────────

interface TabItemProps {
  route: BottomTabBarProps['state']['routes'][number];
  index: number;
  isFocused: boolean;
  options: BottomTabBarProps['descriptors'][string]['options'];
  activeColor: string;
  inactiveColor: string;
  onPress: () => void;
  onLongPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({
  route,
  index: _index,
  isFocused,
  options,
  activeColor,
  inactiveColor,
  onPress,
  onLongPress,
}) => {
  const labelProgress = useSharedValue(isFocused ? 1 : 0);
  const pressProgress = useSharedValue(0);

  React.useEffect(() => {
    labelProgress.value = withSpring(isFocused ? 1 : 0, LABEL_SPRING);
  }, [isFocused, labelProgress]);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pressProgress.value, [0, 1], [1, 0.88]) }],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(labelProgress.value, [0, 1], [0.6, 1]),
    transform: [
      { translateY: interpolate(labelProgress.value, [0, 1], [2, 0]) },
      { scale: interpolate(labelProgress.value, [0, 1], [0.96, 1]) },
    ],
  }));

  const rawLabel = options.title ?? route.name;
  const iconColor = isFocused ? activeColor : inactiveColor;

  return (
    <Pressable
      key={route.key}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarButtonTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => {
        pressProgress.value = withSpring(1, PRESS_SPRING);
      }}
      onPressOut={() => {
        pressProgress.value = withSpring(0, PRESS_SPRING);
      }}
      style={styles.tabItem}
    >
      <Animated.View style={[styles.tabItemInner, pressStyle]}>
        <TabBarIcon
          routeName={route.name as keyof ExpoRouterTabParamList}
          focused={isFocused}
          color={iconColor}
          size={22}
        />
        <Animated.Text
          style={[
            styles.tabLabel,
            { color: iconColor, fontWeight: isFocused ? '700' : '500' },
            labelStyle,
          ]}
          numberOfLines={1}
        >
          {rawLabel}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
};

// ─── Tab bar ─────────────────────────────────────────────────────────────────

const AnimatedBottomTabBar: React.FC<
  BottomTabBarProps & {
    activeColor: string;
    inactiveColor: string;
    backgroundColor: string;
    primaryColor: string;
  }
> = ({
  state,
  descriptors,
  navigation,
  activeColor,
  inactiveColor,
  backgroundColor,
  primaryColor,
}) => {
  const insets = useSafeAreaInsets();
  const tabCount = state.routes.length;
  const [containerWidth, setContainerWidth] = React.useState(0);
  const tabWidth = containerWidth > 0 ? containerWidth / tabCount : 0;

  // Indicator position (left edge of pill)
  const indicatorX = useSharedValue(state.index * tabWidth);
  // Indicator width stretches during transition then snaps back
  const indicatorW = useSharedValue(tabWidth > 10 ? tabWidth - 10 : 0);

  const prevIndex = React.useRef(state.index);

  React.useEffect(() => {
    if (tabWidth <= 0) return;

    const target = state.index * tabWidth;
    const pillWidth = tabWidth - 10;

    if (prevIndex.current !== state.index) {
      const distance = Math.abs(state.index - prevIndex.current);
      // Stretch pill across the distance, then snap to final width
      indicatorW.value = withTiming(
        pillWidth + distance * tabWidth * 0.4,
        { duration: 140 },
        () => {
          indicatorW.value = withSpring(pillWidth, INDICATOR_SPRING);
        }
      );
      indicatorX.value = withSpring(target, INDICATOR_SPRING);
      prevIndex.current = state.index;
    } else {
      // First render / resize
      indicatorX.value = target;
      indicatorW.value = pillWidth;
    }
  }, [state.index, tabWidth, indicatorX, indicatorW]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorW.value,
  }));

  const paddingBottom =
    insets.bottom > 0 ? insets.bottom : Platform.OS === 'android' ? 12 : 8;

  return (
    <View style={[styles.tabBarShadowWrapper, { backgroundColor }]}>
      <View
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        style={[styles.tabBar, { backgroundColor, paddingBottom }]}
      >
        {tabWidth > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.activePill,
              { backgroundColor: primaryColor + '14', left: 5 },
              indicatorStyle,
            ]}
          />
        )}

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const descriptor = descriptors[route.key];

          return (
            <TabItem
              key={route.key}
              route={route}
              index={index}
              isFocused={isFocused}
              options={descriptor.options}
              activeColor={activeColor}
              inactiveColor={inactiveColor}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              onLongPress={() => {
                navigation.emit({ type: 'tabLongPress', target: route.key });
              }}
            />
          );
        })}
      </View>
    </View>
  );
};

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuthContext();
  const { theme } = useTheme();
  const { t } = useTranslation();

  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect href="/(auth)/onboarding" />;

  const tabCanvasColor = theme.colors.background;
  return (
    <View style={{ flex: 1, backgroundColor: tabCanvasColor }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          sceneStyle: { backgroundColor: tabCanvasColor },
        }}
        tabBar={(props) => (
          <AnimatedBottomTabBar
            {...props}
            activeColor={theme.colors.primary}
            inactiveColor={theme.colors.textSecondary}
            backgroundColor={tabCanvasColor}
            primaryColor={theme.colors.primary}
          />
        )}
      >
        <Tabs.Screen name="index" options={{ title: t('tabs.home') }} />
        <Tabs.Screen
          name="appointments"
          options={{ title: t('tabs.appointments'), headerShown: false }}
        />
        <Tabs.Screen name="account" options={{ title: t('tabs.account') }} />
        <Tabs.Screen
          name="parental"
          options={{ title: t('tabs.parental'), headerShown: false }}
        />
        <Tabs.Screen
          name="nearby"
          options={{ title: t('tabs.nearby'), headerShown: false }}
        />
      </Tabs>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tabBarShadowWrapper: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 8,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
    borderTopWidth: 0,
  },
  activePill: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    borderRadius: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 12,
  },
});
