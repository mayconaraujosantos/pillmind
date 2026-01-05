import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing } from '@shared/theme/spacing';
import { heading, body } from '@shared/theme/typography';

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
    ...heading.h2,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...body.xlMedium,
    textAlign: 'center',
  },
});
