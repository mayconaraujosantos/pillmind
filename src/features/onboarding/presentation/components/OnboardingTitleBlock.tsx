import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing } from '@shared/theme/spacing';
import {
  adaptiveSpacing,
  adaptiveFontSizes,
  deviceSize,
} from '@shared/utils/dimensions';

type OnboardingTitleBlockProps = {
  title: string;
  subtitle: string;
  titleColor: string;
  subtitleColor: string;
  containerMarginBottom?: number;
  subtitleMarginBottom?: number;
};

export const OnboardingTitleBlock: React.FC<OnboardingTitleBlockProps> = ({
  title,
  subtitle,
  titleColor,
  subtitleColor,
  containerMarginBottom = spacing.lg,
  subtitleMarginBottom = spacing.none,
}) => {
  return (
    <View style={[styles.container, { marginBottom: containerMarginBottom }]}>
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      <Text
        style={[
          styles.subtitle,
          { color: subtitleColor, marginBottom: subtitleMarginBottom },
        ]}
      >
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: adaptiveFontSizes.xxl,
    fontWeight: '700',
    marginBottom: adaptiveSpacing.sm,
    textAlign: 'center',
    lineHeight: deviceSize(32, 36, 40),
  },
  subtitle: {
    fontSize: adaptiveFontSizes.md,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: deviceSize(20, 22, 24),
    paddingHorizontal: adaptiveSpacing.sm,
  },
});
