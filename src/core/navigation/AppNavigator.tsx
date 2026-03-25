import React from 'react';
import {
  NavigationContainer,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  Animated,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import { AccountNavigator } from '@features/account/navigation/AccountNavigator';
import { TabBarIcon } from './components/TabBarIcon';
import { TabParamList } from './types';
import { HomeTabNavigator } from './HomeTabNavigator';
import { AppointmentsTabNavigator } from './AppointmentsTabNavigator';
import { ParentalTabNavigator } from './ParentalTabNavigator';
import { NearbyTabNavigator } from './NearbyTabNavigator';

const Tab = createBottomTabNavigator<TabParamList>();

const AnimatedBottomTabBar: React.FC<
  BottomTabBarProps & {
    activeColor: string;
    inactiveColor: string;
    backgroundColor: string;
  }
> = ({
  state,
  descriptors,
  navigation,
  activeColor,
  inactiveColor,
  backgroundColor,
}) => {
  const translateX = React.useRef(new Animated.Value(0)).current;
  const progressByRoute = React.useRef(
    state.routes.map(
      (_, index) => new Animated.Value(index === state.index ? 1 : 0)
    )
  ).current;
  const tabCount = state.routes.length;
  const [containerWidth, setContainerWidth] = React.useState(0);
  const tabWidth = containerWidth > 0 ? containerWidth / tabCount : 0;
  const indicatorSize = tabWidth > 0 ? tabWidth - 10 : 0;

  React.useEffect(() => {
    if (tabWidth <= 0) return;
    Animated.spring(translateX, {
      toValue: state.index * tabWidth,
      useNativeDriver: true,
      friction: 8,
      tension: 95,
    }).start();
  }, [state.index, tabWidth, translateX]);

  React.useEffect(() => {
    const animations = progressByRoute.map((value, index) =>
      Animated.timing(value, {
        toValue: index === state.index ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      })
    );
    Animated.parallel(animations).start();
  }, [state.index, progressByRoute]);

  return (
    <View style={[styles.tabBarShadowWrapper, { backgroundColor }]}>
      <View
        onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
        style={[styles.tabBar, { backgroundColor }]}
      >
        {tabWidth > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.activePill,
              {
                width: indicatorSize,
                left: 5,
                transform: [{ translateX }],
              },
            ]}
          />
        )}

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const descriptor = descriptors[route.key];
          const options = descriptor.options;
          const rawLabel = options.title ?? route.name;
          const iconColor = isFocused ? activeColor : inactiveColor;
          const labelProgress = progressByRoute[index];
          const labelOpacity = labelProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.72, 1],
          });
          const labelTranslateY = labelProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, -1],
          });
          const labelScale = labelProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.98, 1.02],
          });

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              activeOpacity={0.86}
              style={styles.tabItem}
            >
              <TabBarIcon
                routeName={route.name as keyof TabParamList}
                focused={isFocused}
                color={iconColor}
                size={22}
              />
              <Animated.Text
                style={[
                  styles.tabLabel,
                  {
                    color: iconColor,
                    fontWeight: isFocused ? '700' : '500',
                    opacity: labelOpacity,
                    transform: [
                      { translateY: labelTranslateY },
                      { scale: labelScale },
                    ],
                  },
                ]}
                numberOfLines={1}
              >
                {rawLabel}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export const AppNavigator: React.FC = () => {
  const { t } = useTranslation();
  const { theme, isDark } = useTheme();
  /** No escuro, alinhar cena/tab bar ao surface (#151515) para não vazar #000 nos cantos arredondados. */
  const tabCanvasColor = isDark
    ? theme.colors.surface
    : theme.colors.background;
  const navigationTheme = React.useMemo<NavigationTheme>(
    () => ({
      dark: isDark,
      colors: {
        primary: theme.colors.primary,
        background: tabCanvasColor,
        card: tabCanvasColor,
        text: theme.colors.text,
        border: 'transparent',
        notification: theme.colors.primary,
      },
      fonts: {
        regular: { fontFamily: 'System', fontWeight: '400' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        bold: { fontFamily: 'System', fontWeight: '700' },
        heavy: { fontFamily: 'System', fontWeight: '800' },
      },
    }),
    [isDark, tabCanvasColor, theme.colors.primary, theme.colors.text]
  );

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
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
          />
        )}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeTabNavigator}
          options={{ title: t('tabs.home') }}
        />
        <Tab.Screen
          name="AppointmentsTab"
          component={AppointmentsTabNavigator}
          options={{ title: t('tabs.appointments') }}
        />
        <Tab.Screen
          name="AccountTab"
          component={AccountNavigator}
          options={{ title: t('tabs.account') }}
        />
        <Tab.Screen
          name="ParentalTab"
          component={ParentalTabNavigator}
          options={{ title: t('tabs.parental') }}
        />
        <Tab.Screen
          name="NearbyTab"
          component={NearbyTabNavigator}
          options={{ title: t('tabs.nearby') }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBarShadowWrapper: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    ...Platform.select({
      ios: { overflow: 'visible' as const, elevation: 10 },
      android: { overflow: 'hidden' as const, elevation: 0 },
      default: { overflow: 'visible' as const, elevation: 10 },
    }),
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 8,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: 'hidden',
    borderTopColor: 'transparent',
    borderTopWidth: 0,
  },
  activePill: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(75, 107, 251, 0.08)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 12,
  },
});
