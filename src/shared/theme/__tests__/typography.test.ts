import {
  typography,
  display,
  heading,
  body,
  button,
  caption,
  fontWeights,
  fontFamily,
} from '../typography';

describe('typography', () => {
  describe('fontWeights', () => {
    it('should have all weight variants', () => {
      expect(fontWeights.regular).toBe('400');
      expect(fontWeights.medium).toBe('500');
      expect(fontWeights.semibold).toBe('600');
      expect(fontWeights.bold).toBe('700');
    });
  });

  describe('fontFamily', () => {
    it('should use Roboto font family', () => {
      expect(fontFamily.regular).toBe('Roboto-Regular');
      expect(fontFamily.medium).toBe('Roboto-Medium');
      expect(fontFamily.semibold).toBe('Roboto-Bold');
      expect(fontFamily.bold).toBe('Roboto-Bold');
    });
  });

  describe('display', () => {
    it('should have display1 style', () => {
      expect(display.display1.fontSize).toBe(46);
      expect(display.display1.lineHeight).toBe(46 * 1.2);
      expect(display.display1.fontWeight).toBe('600');
      expect(display.display1.letterSpacing).toBe(0);
    });

    it('should have display2 style', () => {
      expect(display.display2.fontSize).toBe(42);
      expect(display.display2.lineHeight).toBe(42 * 1.2);
      expect(display.display2.fontWeight).toBe('600');
    });

    it('should have display3 style', () => {
      expect(display.display3.fontSize).toBe(36);
      expect(display.display3.lineHeight).toBe(36 * 1.2);
      expect(display.display3.fontWeight).toBe('600');
    });
  });

  describe('heading', () => {
    it('should have h1 style with bold weight', () => {
      expect(heading.h1.fontSize).toBe(32);
      expect(heading.h1.fontWeight).toBe('700');
      expect(heading.h1.lineHeight).toBe(32 * 1.2);
    });

    it('should have h2 style with semibold weight', () => {
      expect(heading.h2.fontSize).toBe(30);
      expect(heading.h2.fontWeight).toBe('600');
      expect(heading.h2.lineHeight).toBe(30 * 1.2);
    });

    it('should have h3 style with regular weight', () => {
      expect(heading.h3.fontSize).toBe(24);
      expect(heading.h3.fontWeight).toBe('400');
      expect(heading.h3.lineHeight).toBe(24 * 1.2);
    });

    it('should have h4 style with medium weight', () => {
      expect(heading.h4.fontSize).toBe(20);
      expect(heading.h4.fontWeight).toBe('500');
      expect(heading.h4.lineHeight).toBe(20 * 1.2);
    });

    it('should have h5 style with semibold weight', () => {
      expect(heading.h5.fontSize).toBe(18);
      expect(heading.h5.fontWeight).toBe('600');
      expect(heading.h5.lineHeight).toBe(18 * 1.2);
    });

    it('should have h6 style with medium weight', () => {
      expect(heading.h6.fontSize).toBe(18);
      expect(heading.h6.fontWeight).toBe('500');
      expect(heading.h6.lineHeight).toBe(18 * 1.2);
    });

    it('should have h7 style with medium weight', () => {
      expect(heading.h7.fontSize).toBe(16);
      expect(heading.h7.fontWeight).toBe('500');
      expect(heading.h7.lineHeight).toBe(16 * 1.2);
    });

    it('should have h8 style with semibold weight', () => {
      expect(heading.h8.fontSize).toBe(14);
      expect(heading.h8.fontWeight).toBe('600');
      expect(heading.h8.lineHeight).toBe(14 * 1.2);
    });

    it('should have all heading variants (h1-h8)', () => {
      expect(Object.keys(heading)).toHaveLength(8);
    });
  });

  describe('body', () => {
    it('should have xlRegular style', () => {
      expect(body.xlRegular.fontSize).toBe(20);
      expect(body.xlRegular.fontWeight).toBe('400');
      expect(body.xlRegular.lineHeight).toBe(20 * 1.2);
    });

    it('should have xlMedium style with 150% line height', () => {
      expect(body.xlMedium.fontSize).toBe(16);
      expect(body.xlMedium.fontWeight).toBe('500');
      expect(body.xlMedium.lineHeight).toBe(16 * 1.5);
    });

    it('should have xlRegular2 style', () => {
      expect(body.xlRegular2.fontSize).toBe(16);
      expect(body.xlRegular2.fontWeight).toBe('400');
      expect(body.xlRegular2.lineHeight).toBe(16 * 1.2);
    });

    it('should have lBold style', () => {
      expect(body.lBold.fontSize).toBe(14);
      expect(body.lBold.fontWeight).toBe('700');
      expect(body.lBold.lineHeight).toBe(14 * 1.2);
    });

    it('should have lMedium style', () => {
      expect(body.lMedium.fontSize).toBe(14);
      expect(body.lMedium.fontWeight).toBe('500');
    });

    it('should have mRegular style', () => {
      expect(body.mRegular.fontSize).toBe(14);
      expect(body.mRegular.fontWeight).toBe('400');
    });

    it('should have xmMedium style', () => {
      expect(body.xmMedium.fontSize).toBe(12);
      expect(body.xmMedium.fontWeight).toBe('500');
    });

    it('should have xmRegular style', () => {
      expect(body.xmRegular.fontSize).toBe(12);
      expect(body.xmRegular.fontWeight).toBe('400');
    });

    it('should have 8 body variants', () => {
      expect(Object.keys(body)).toHaveLength(8);
    });
  });

  describe('button', () => {
    it('should have xlRegular style', () => {
      expect(button.xlRegular.fontSize).toBe(24);
      expect(button.xlRegular.fontWeight).toBe('400');
      expect(button.xlRegular.lineHeight).toBe(24 * 1.2);
    });

    it('should have xlMedium style', () => {
      expect(button.xlMedium.fontSize).toBe(20);
      expect(button.xlMedium.fontWeight).toBe('500');
    });

    it('should have lMedium style', () => {
      expect(button.lMedium.fontSize).toBe(18);
      expect(button.lMedium.fontWeight).toBe('500');
    });

    it('should have mMedium style', () => {
      expect(button.mMedium.fontSize).toBe(16);
      expect(button.mMedium.fontWeight).toBe('500');
    });

    it('should have sMedium style', () => {
      expect(button.sMedium.fontSize).toBe(14);
      expect(button.sMedium.fontWeight).toBe('500');
    });

    it('should have xsMedium style', () => {
      expect(button.xsMedium.fontSize).toBe(12);
      expect(button.xsMedium.fontWeight).toBe('500');
    });

    it('should have 11 button variants', () => {
      expect(Object.keys(button)).toHaveLength(11);
    });
  });

  describe('caption', () => {
    it('should have lRegular style', () => {
      expect(caption.lRegular.fontSize).toBe(12);
      expect(caption.lRegular.fontWeight).toBe('400');
      expect(caption.lRegular.lineHeight).toBe(12 * 1.2);
    });

    it('should have mRegular style', () => {
      expect(caption.mRegular.fontSize).toBe(10);
      expect(caption.mRegular.fontWeight).toBe('400');
      expect(caption.mRegular.lineHeight).toBe(10 * 1.2);
    });

    it('should have 2 caption variants', () => {
      expect(Object.keys(caption)).toHaveLength(2);
    });
  });

  describe('typography object', () => {
    it('should contain all typography categories', () => {
      expect(typography.display).toBeDefined();
      expect(typography.heading).toBeDefined();
      expect(typography.body).toBeDefined();
      expect(typography.button).toBeDefined();
      expect(typography.caption).toBeDefined();
      expect(typography.fontWeights).toBeDefined();
      expect(typography.fontFamily).toBeDefined();
    });

    it('should have consistent structure', () => {
      expect(typography.display).toBe(display);
      expect(typography.heading).toBe(heading);
      expect(typography.body).toBe(body);
      expect(typography.button).toBe(button);
      expect(typography.caption).toBe(caption);
    });
  });

  describe('line height calculations', () => {
    it('all display styles should have 120% line height', () => {
      Object.values(display).forEach((style) => {
        expect(style.fontSize).toBeDefined();
        expect(style.lineHeight).toBe(style.fontSize! * 1.2);
      });
    });

    it('all heading styles should have 120% line height', () => {
      Object.values(heading).forEach((style) => {
        expect(style.fontSize).toBeDefined();
        expect(style.lineHeight).toBe(style.fontSize! * 1.2);
      });
    });

    it('most body styles should have 120% line height', () => {
      expect(body.xlRegular.lineHeight).toBe(body.xlRegular.fontSize! * 1.2);
      expect(body.xlRegular2.lineHeight).toBe(body.xlRegular2.fontSize! * 1.2);
      expect(body.lBold.lineHeight).toBe(body.lBold.fontSize! * 1.2);
    });

    it('body xlMedium should have 150% line height', () => {
      expect(body.xlMedium.lineHeight).toBe(body.xlMedium.fontSize! * 1.5);
    });

    it('all button styles should have 120% line height', () => {
      Object.values(button).forEach((style) => {
        expect(style.fontSize).toBeDefined();
        expect(style.lineHeight).toBe(style.fontSize! * 1.2);
      });
    });

    it('all caption styles should have 120% line height', () => {
      Object.values(caption).forEach((style) => {
        expect(style.fontSize).toBeDefined();
        expect(style.lineHeight).toBe(style.fontSize! * 1.2);
      });
    });
  });

  describe('letter spacing', () => {
    it('all styles should have 0 letter spacing', () => {
      [...Object.values(display), ...Object.values(heading)].forEach(
        (style) => {
          expect(style.letterSpacing).toBe(0);
        }
      );
    });
  });

  describe('font size ranges', () => {
    it('display sizes should be largest (36-46px)', () => {
      expect(display.display1.fontSize).toBe(46);
      expect(display.display2.fontSize).toBe(42);
      expect(display.display3.fontSize).toBe(36);
    });

    it('heading sizes should range from 14-32px', () => {
      expect(heading.h1.fontSize).toBe(32);
      expect(heading.h8.fontSize).toBe(14);
    });

    it('body sizes should range from 12-20px', () => {
      const bodySizes = Object.values(body)
        .map((s) => s.fontSize)
        .filter((size): size is number => size !== undefined);
      expect(Math.max(...bodySizes)).toBe(20);
      expect(Math.min(...bodySizes)).toBe(12);
    });

    it('button sizes should range from 12-24px', () => {
      const buttonSizes = Object.values(button)
        .map((s) => s.fontSize)
        .filter((size): size is number => size !== undefined);
      expect(Math.max(...buttonSizes)).toBe(24);
      expect(Math.min(...buttonSizes)).toBe(12);
    });

    it('caption sizes should be smallest (10-12px)', () => {
      expect(caption.lRegular.fontSize).toBe(12);
      expect(caption.mRegular.fontSize).toBe(10);
    });
  });
});
