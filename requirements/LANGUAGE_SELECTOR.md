# Requirement: Manual Language Selector

## Overview

Implement a manual language selector in the Account Settings screen to allow users to override the automatic device language detection and choose their preferred language.

## Current State

- ✅ i18n system implemented with `react-i18next`
- ✅ Automatic device language detection working
- ✅ English and Portuguese (BR) translations available
- ❌ No manual language selector in UI

## Requirements

### Functional Requirements

**FR-001**: Language Selector UI

- Add a new "Language" section in Account Settings screen
- Display current selected language
- Show list of available languages when tapped
- Languages: English, Português (Brasil)

**FR-002**: Language Persistence

- Save user's language preference in AsyncStorage
- Load saved preference on app startup
- Priority: Saved preference > Device language > English (fallback)

**FR-003**: Language Change

- Change app language immediately when selected
- Persist across app restarts
- No app restart required

**FR-004**: User Feedback

- Show checkmark on currently selected language
- Provide visual feedback when language changes
- Display language names in their native form (English, Português)

### Non-Functional Requirements

**NFR-001**: Performance

- Language change should be instant (< 100ms)
- No UI flickering during language switch

**NFR-002**: Accessibility

- Language options should have proper accessibility labels
- Support screen readers in both languages

**NFR-003**: UX Consistency

- Follow existing theme system design patterns
- Match ThemeSelector component style

## Technical Design

### Files to Create/Modify

1. **Create**: `src/shared/components/LanguageSelector.tsx`
   - Component similar to ThemeSelector
   - List of available languages
   - Checkmark for selected language

2. **Create**: `src/shared/components/__tests__/LanguageSelector.test.tsx`
   - Unit tests for LanguageSelector component
   - Test language switching
   - Test persistence

3. **Modify**: `src/shared/i18n/i18n.config.ts`
   - Add function to load saved language preference
   - Update initialization logic

4. **Modify**: `src/features/account/presentation/screens/AccountScreen.tsx`
   - Add Language section after Appearance
   - Integrate LanguageSelector component

5. **Update**: `src/shared/i18n/locales/en.json`

   ```json
   {
     "account": {
       "language": "Language"
     },
     "language": {
       "title": "Language",
       "english": "English",
       "portuguese": "Português (Brasil)",
       "automatic": "Automatic (Device)"
     }
   }
   ```

6. **Update**: `src/shared/i18n/locales/pt-BR.json`
   ```json
   {
     "account": {
       "language": "Idioma"
     },
     "language": {
       "title": "Idioma",
       "english": "English",
       "portuguese": "Português (Brasil)",
       "automatic": "Automático (Dispositivo)"
     }
   }
   ```

### Implementation Steps

#### Step 1: Create Storage Helper

```typescript
// src/shared/i18n/languageStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = '@pillmind:language';

export const saveLanguage = async (language: string): Promise<void> => {
  await AsyncStorage.setItem(LANGUAGE_KEY, language);
};

export const loadLanguage = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(LANGUAGE_KEY);
};
```

#### Step 2: Update i18n Configuration

```typescript
// src/shared/i18n/i18n.config.ts
import { loadLanguage } from './languageStorage';

const initI18n = async () => {
  const savedLanguage = await loadLanguage();
  const deviceLanguage = Localization.getLocales()[0]?.languageTag || 'en';

  const initialLanguage = savedLanguage || deviceLanguage;

  await i18n.use(initReactI18next).init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'en',
    // ...
  });
};

initI18n();
```

#### Step 3: Create LanguageSelector Component

```typescript
// src/shared/components/LanguageSelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { saveLanguage } from '@shared/i18n/languageStorage';
import { useTheme } from '@shared/theme';

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'pt-BR', name: 'Portuguese', nativeName: 'Português (Brasil)' },
];

export const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [currentLanguage, setCurrentLanguage] = React.useState(i18n.language);

  const handleLanguageChange = async (languageCode: string) => {
    await i18n.changeLanguage(languageCode);
    await saveLanguage(languageCode);
    setCurrentLanguage(languageCode);
  };

  return (
    <View>
      <Text style={{ color: theme.colors.text }}>
        {t('language.title')}
      </Text>
      <ScrollView>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            onPress={() => handleLanguageChange(lang.code)}
            testID={`language-option-${lang.code}`}
          >
            <View>
              <Text style={{ color: theme.colors.text }}>
                {lang.nativeName}
              </Text>
              {currentLanguage === lang.code && (
                <Text testID={`language-checkmark-${lang.code}`}>✓</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
```

#### Step 4: Add to AccountScreen

```tsx
// After Appearance section
<View style={styles.section}>
  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
    {t('account.language')}
  </Text>
  <LanguageSelector />
</View>
```

### Testing Requirements

1. **Unit Tests**
   - Language selection changes i18n language
   - Language preference is saved to AsyncStorage
   - Checkmark appears on selected language
   - All languages render correctly

2. **Integration Tests**
   - Language change reflects across all screens
   - Saved language loads on app restart
   - Theme selector still works after language change

3. **Manual Testing**
   - Test on both iOS and Android
   - Verify language persists after app close
   - Check all translated strings display correctly
   - Verify accessibility in both languages

## Acceptance Criteria

- [ ] Language selector appears in Account Settings
- [ ] User can switch between English and Portuguese
- [ ] Language change is instant without app restart
- [ ] Selected language persists across app restarts
- [ ] Selected language has visual indicator (checkmark)
- [ ] All screens update to new language immediately
- [ ] Saved preference overrides device language
- [ ] All tests pass with >80% coverage
- [ ] Accessibility labels work in both languages
- [ ] UI matches existing design system (ThemeSelector style)

## Priority

**Medium** - Nice to have feature that improves user experience

## Estimated Effort

- **Development**: 4-6 hours
- **Testing**: 2-3 hours
- **Total**: 6-9 hours

## Dependencies

- Existing i18n system (already implemented)
- AsyncStorage (already available)
- ThemeSelector component (as design reference)

## Related Documentation

- [I18N System Documentation](../doc/I18N_SYSTEM.md)
- [Theme System Documentation](../doc/THEME_SYSTEM.md)
