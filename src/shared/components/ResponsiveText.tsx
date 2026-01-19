/**
 * Componente Text responsivo com tipografia automática
 */
import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from 'react-native';
import {
  useResponsiveTypography,
  DisplayVariant,
  HeadingVariant,
  BodyVariant,
  ButtonVariant,
  CaptionVariant,
} from '../theme/typography';

export interface ResponsiveTextProps extends RNTextProps {
  // Variantes de tipografia
  variant?: 'display' | 'heading' | 'body' | 'button' | 'caption';

  // Subvariantes específicas
  display?: DisplayVariant;
  heading?: HeadingVariant;
  body?: BodyVariant;
  button?: ButtonVariant;
  caption?: CaptionVariant;

  // Se deve aplicar responsividade automática
  responsive?: boolean;

  // Cor do texto
  color?: string;

  // Alinhamento
  textAlign?: TextStyle['textAlign'];

  // Transformações
  transform?: TextStyle['textTransform'];

  // Controle de linhas
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  style,
  variant = 'body',
  display,
  heading,
  body,
  button,
  caption,
  responsive = true,
  color,
  textAlign,
  transform,
  numberOfLines,
  ellipsizeMode = 'tail',
  ...props
}) => {
  const typography = useResponsiveTypography();

  // Determinar o estilo baseado na variante
  const getTypographyStyle = (): TextStyle => {
    if (responsive) {
      // Usar versão responsiva
      switch (variant) {
        case 'display':
          return display
            ? typography.responsive.display[display]
            : typography.responsive.display.display1;
        case 'heading':
          return heading
            ? typography.responsive.heading[heading]
            : typography.responsive.heading.h1;
        case 'body':
          return body
            ? typography.responsive.body[body]
            : typography.responsive.body.xlRegular;
        case 'button':
          return button
            ? typography.responsive.button[button]
            : typography.responsive.button.lMedium;
        case 'caption':
          return caption
            ? typography.responsive.caption[caption]
            : typography.responsive.caption.mRegular;
        default:
          return typography.responsive.body.xlRegular;
      }
    } else {
      // Usar versão original (não responsiva)
      switch (variant) {
        case 'display':
          return display
            ? typography.display[display]
            : typography.display.display1;
        case 'heading':
          return heading ? typography.heading[heading] : typography.heading.h1;
        case 'body':
          return body ? typography.body[body] : typography.body.xlRegular;
        case 'button':
          return button ? typography.button[button] : typography.button.lMedium;
        case 'caption':
          return caption
            ? typography.caption[caption]
            : typography.caption.mRegular;
        default:
          return typography.body.xlRegular;
      }
    }
  };

  const typographyStyle = getTypographyStyle();

  // Construir estilo final
  const finalStyle: TextStyle = {
    ...typographyStyle,
    ...(color && { color }),
    ...(textAlign && { textAlign }),
    ...(transform && { textTransform: transform }),
  };

  return (
    <RNText
      style={[finalStyle, style]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      {...props}
    >
      {children}
    </RNText>
  );
};
