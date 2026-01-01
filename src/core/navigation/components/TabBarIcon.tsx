import React from 'react';
import { Ionicons } from '@expo/vector-icons';
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

  return <Ionicons name={iconName} size={size} color={color} />;
};
