import React from 'react';
import { render } from '@testing-library/react-native';
import { ResponsiveText } from '../ResponsiveText';

jest.mock('../../theme/typography', () => ({
  useResponsiveTypography: () => ({
    responsive: {
      display: { display1: { fontSize: 30 } },
      heading: { h1: { fontSize: 24 } },
      body: { xlRegular: { fontSize: 16 } },
      button: { lMedium: { fontSize: 14 } },
      caption: { mRegular: { fontSize: 12 } },
    },
    display: { display1: { fontSize: 28 } },
    heading: { h1: { fontSize: 22 } },
    body: { xlRegular: { fontSize: 15 } },
    button: { lMedium: { fontSize: 13 } },
    caption: { mRegular: { fontSize: 11 } },
  }),
}));

const flattenStyle = (style: unknown) => {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style);
  }
  return style as Record<string, unknown>;
};

const getTextStyle = (node: { props?: { style?: unknown } }) =>
  flattenStyle(node.props?.style);

describe('ResponsiveText', () => {
  it('uses responsive typography by default', () => {
    const { getByText } = render(
      <ResponsiveText variant="heading" heading="h1">
        Heading
      </ResponsiveText>
    );

    const style = getTextStyle(getByText('Heading'));
    expect(style.fontSize).toBe(24);
  });

  it('uses non-responsive typography when responsive is false', () => {
    const { getByText } = render(
      <ResponsiveText variant="heading" heading="h1" responsive={false}>
        Heading
      </ResponsiveText>
    );

    const style = getTextStyle(getByText('Heading'));
    expect(style.fontSize).toBe(22);
  });

  it('applies color and alignment props', () => {
    const { getByText } = render(
      <ResponsiveText color="#123" textAlign="center" transform="uppercase">
        Body
      </ResponsiveText>
    );

    const style = getTextStyle(getByText('Body'));
    expect(style.color).toBe('#123');
    expect(style.textAlign).toBe('center');
    expect(style.textTransform).toBe('uppercase');
  });
});
