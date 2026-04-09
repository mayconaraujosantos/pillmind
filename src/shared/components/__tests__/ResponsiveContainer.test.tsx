import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { ResponsiveContainer } from '../ResponsiveContainer';

jest.mock('../../hooks/useResponsive', () => ({
  useResponsive: () => ({
    wp: (value: number) => value,
    isTablet: false,
  }),
}));

jest.mock('../../theme/spacing', () => {
  const spacingMap = {
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 40,
  } as const;

  return {
    useResponsiveSpacing: () => ({
      pad: (size: keyof typeof spacingMap) => spacingMap[size],
      containerPadding: { paddingHorizontal: 16, paddingVertical: 24 },
      sectionSpacing: { marginVertical: 32 },
      cardPadding: { padding: 16 },
    }),
  };
});

const flattenStyle = (style: unknown) => {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style);
  }
  return style as Record<string, unknown>;
};

type TestNode = {
  parent?: TestNode | null;
  props?: { style?: unknown };
};

const getContainerStyle = (node: TestNode) => {
  let current: TestNode | null | undefined = node;
  while (current && !current.props?.style) {
    current = current.parent ?? null;
  }

  return flattenStyle(current?.props?.style);
};

describe('ResponsiveContainer', () => {
  it('applies variant padding for padded', () => {
    const { getByText } = render(
      <ResponsiveContainer variant="padded">
        <Text>Content</Text>
      </ResponsiveContainer>
    );

    const style = getContainerStyle(getByText('Content'));

    expect(style.paddingHorizontal).toBe(16);
    expect(style.paddingVertical).toBe(24);
  });

  it('applies custom padding and alignment', () => {
    const { getByText } = render(
      <ResponsiveContainer padding="sm" align="center" justify="between">
        <Text>Content</Text>
      </ResponsiveContainer>
    );

    const style = getContainerStyle(getByText('Content'));

    expect(style.padding).toBe(16);
    expect(style.alignItems).toBe('center');
    expect(style.justifyContent).toBe('space-between');
  });
});
