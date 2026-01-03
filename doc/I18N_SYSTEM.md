# Internationalization (i18n) System

## Overview

PillMind uses `react-i18next` for internationalization, allowing the app to support multiple languages with automatic device language detection.

## Dependencies

```json
{
  "react-i18next": "^13.x",
  "i18next": "^23.x",
  "expo-localization": "^14.x"
}
```

## File Structure

```
src/shared/i18n/
├── index.ts                 # Main export
├── i18n.config.ts          # Configuration and initialization
└── locales/
    ├── en.json             # English translations
    └── pt-BR.json          # Portuguese (Brazil) translations
```

## Configuration

**File**: `src/shared/i18n/i18n.config.ts`

- Automatically detects device language using `expo-localization`
- Falls back to English if language not supported
- Uses `compatibilityJSON: 'v3'` for React Native compatibility

## Supported Languages

- **English (en)** - Default/Fallback
- **Portuguese Brazil (pt-BR)**

## Usage in Components

```tsx
import { useTranslation } from '@shared/i18n';

export const MyComponent = () => {
  const { t } = useTranslation();

  return <Text>{t('common.logout')}</Text>;
};
```

## Translation Keys Structure

### Common

- `common.skip` - Skip button
- `common.next` - Next button
- `common.back` - Back button
- `common.getStarted` - Get Started button
- `common.logout` - Logout button

### Navigation Tabs

- `tabs.home` - Home tab
- `tabs.appointments` - Appointments tab
- `tabs.account` - Account tab
- `tabs.parental` - Parental tab
- `tabs.nearby` - Nearby tab

### Screens

- `home.*` - Home screen translations
- `appointments.*` - Appointments screen translations
- `nearby.*` - Nearby screen translations
- `parental.*` - Parental screen translations
- `account.*` - Account screen translations
- `theme.*` - Theme selector translations
- `onboarding.step1.*` - Onboarding step 1
- `onboarding.step2.*` - Onboarding step 2
- `onboarding.step3.*` - Onboarding step 3

## Adding New Translations

1. Add the key in both `en.json` and `pt-BR.json`
2. Use nested objects for organization
3. Keep keys descriptive and hierarchical

**Example:**

```json
// en.json
{
  "settings": {
    "notifications": {
      "title": "Notifications",
      "enable": "Enable notifications",
      "frequency": "Notification frequency"
    }
  }
}
```

```tsx
// In component
t('settings.notifications.title');
t('settings.notifications.enable');
```

## Language Detection

The app automatically detects the device language on startup:

```typescript
const deviceLanguage = Localization.getLocales()[0]?.languageTag || 'en';
```

- If device is set to Portuguese (BR): Shows PT-BR
- Otherwise: Shows English

## Future Enhancements

### Manual Language Selector

Add a language selector in Account Settings:

```tsx
import { i18n } from '@shared/i18n';

const changeLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
  // Save preference to AsyncStorage
};
```

### Add More Languages

1. Create new translation file: `src/shared/i18n/locales/es.json`
2. Import in `i18n.config.ts`:

   ```typescript
   import es from './locales/es.json';

   const resources = {
     en: { translation: en },
     'pt-BR': { translation: ptBR },
     es: { translation: es },
   };
   ```

3. Update language selector UI

## Testing with i18n

Tests automatically use the configured language. To test specific translations:

```tsx
import '@shared/i18n'; // Import to initialize

describe('MyComponent', () => {
  it('should display translated text', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Logout')).toBeTruthy(); // English
  });
});
```

## Important Notes

⚠️ **Always update both language files** when adding new keys
⚠️ **Test in both languages** before releasing
⚠️ **Use interpolation** for dynamic content: `t('welcome', { name: userName })`
⚠️ **Avoid hardcoded strings** - always use translation keys

## Migration Checklist

When updating existing screens:

- [ ] Replace hardcoded strings with `t()` calls
- [ ] Add keys to both `en.json` and `pt-BR.json`
- [ ] Update tests to use English text
- [ ] Verify rendering in both languages
- [ ] Update snapshots if needed

## References

- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)
- [Expo Localization](https://docs.expo.dev/versions/latest/sdk/localization/)
