# 🚀 Modern Inputs 2025 - Quick Reference

## TL;DR - What Changed

```typescript
// BEFORE: Old styles
Input {
  borderRadius: 8px
  borderBottomWidth: 1.5px (iOS)
  backgroundColor: transparent (iOS) / #F5F9FC (Android)
  shadowOpacity: 0.08
  elevation: 2
  padding: variable
}

// AFTER: Modern 2025 styles
Input {
  borderRadius: 16px  ← More rounded
  borderWidth: 1px  ← Subtle all-around
  backgroundColor: rgba(255,255,255,0.7) / rgba(245,249,252,0.8)  ← Glass effect
  shadowOpacity: 0.05  ← Very subtle
  elevation: 1  ← Minimal
  padding: 16px H, 14px V  ← Consistent
}
```

---

## Copy-Paste Snippets

### Using Input Component

```tsx
import { Input } from '@shared/components/Input';

export function MyForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  return (
    <Input
      label="Email Address"
      placeholder="you@example.com"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      hint="We'll never share your email"
      error={error}
    />
  );
}
```

### Custom Input with Icon

```tsx
<Input
  label="Search"
  placeholder="Find something..."
  icon={<Ionicons name="search" size={20} color="#666" />}
  value={search}
  onChangeText={setSearch}
/>
```

### Password Field

```tsx
<Input
  label="Password"
  placeholder="Enter secure password"
  secureTextEntry
  hint="Minimum 8 characters"
  value={password}
  onChangeText={setPassword}
/>
```

---

## Key Numbers

| Property          | Value   | Notes                       |
| ----------------- | ------- | --------------------------- |
| borderRadius      | 16px    | Consistent across platforms |
| borderWidth       | 1px     | Light and elegant           |
| paddingHorizontal | 16px    | Comfortable typing area     |
| paddingVertical   | 14px    | Better spacing              |
| minHeight         | 52-60px | Accessible touch target     |
| labelMarginBottom | 10px    | Clear separation            |
| hintMarginTop     | 8px     | Breathing room              |
| shadowOpacity     | 0.05    | Very subtle                 |
| focusAnimDuration | 200ms   | Smooth transition           |

---

## Color Palette

```typescript
// Borders
const lightBorder = 'rgba(200, 200, 200, 0.3)';
const extraLightBorder = 'rgba(200, 200, 200, 0.2)';
const errorBorder = '#FF0000';
const focusBorder = '#007AFF';

// Backgrounds
const iosBG = 'rgba(255, 255, 255, 0.7)';
const androidBG = 'rgba(245, 249, 252, 0.8)';
const errorBG = 'rgba(255, 240, 245, 0.6)';

// Shadows
const shadowColor = '#000';
const shadowOpacity = 0.05;
const shadowRadius = 3; // iOS / 4 Android
```

---

## Focus State Changes

### iOS

```typescript
// Normal
borderColor: 'rgba(200, 200, 200, 0.3)';
labelColor: '#333';

// Focused (animated)
borderColor: '#007AFF';
labelColor: '#007AFF';
opacity: 1;
```

### Android

```typescript
// Normal
scale: 1;
borderColor: 'rgba(200, 200, 200, 0.3)';
labelColor: '#333';

// Focused (spring animated)
scale: 1.02;
borderColor: '#007AFF';
labelColor: '#007AFF';
```

---

## Common Patterns

### Form with Multiple Inputs

```tsx
<View style={{ gap: 20 }}>
  <Input
    label="Full Name"
    placeholder="John Doe"
    value={name}
    onChangeText={setName}
  />
  <Input
    label="Email"
    placeholder="john@example.com"
    value={email}
    onChangeText={setEmail}
    keyboardType="email-address"
  />
  <Input
    label="Password"
    placeholder="••••••••"
    value={password}
    onChangeText={setPassword}
    secureTextEntry
    hint="Min 8 characters"
  />
</View>
```

### With Validation

```tsx
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');

const validateEmail = (text: string) => {
  setEmail(text);
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
  setEmailError(isValid ? '' : 'Invalid email');
};

return (
  <Input
    label="Email"
    placeholder="you@example.com"
    value={email}
    onChangeText={validateEmail}
    error={emailError}
  />
);
```

---

## Styling Overrides

### If you need to customize

```typescript
// Not recommended, but possible:
<Input
  label="Custom"
  style={{
    fontSize: 18, // Only override specific properties
    fontWeight: '600',
  }}
/>

// Better: Use consistent styling from Input component
```

---

## Responsive Sizing

### Auto-scales based on device

```typescript
// Small devices (< 375px)
minHeight: 52px
paddingHorizontal: 16px

// Normal devices (375-600px)
minHeight: 56px
paddingHorizontal: 16px

// Large devices (> 600px)
minHeight: 60px
paddingHorizontal: 16px
```

---

## Animation Details

### Focus In (200ms)

```typescript
Animated.timing(borderOpacity, {
  toValue: 1,
  duration: 200,
  easing: Easing.ease,
  useNativeDriver: false,
});

// Android only
Animated.spring(scaleValue, {
  toValue: 1.02,
  useNativeDriver: true,
  speed: 20,
  tension: 100,
});
```

### Focus Out (200ms)

```typescript
Animated.timing(borderOpacity, {
  toValue: 0,
  duration: 200,
  easing: Easing.ease,
  useNativeDriver: false,
});

// Android only
Animated.spring(scaleValue, {
  toValue: 1,
  useNativeDriver: true,
  speed: 20,
  tension: 100,
});
```

---

## Props Reference

```typescript
interface InputProps extends TextInputProps {
  label?: string; // Display label
  error?: string; // Error message
  hint?: string; // Helper text
  icon?: React.ReactNode; // Left icon
  variant?: 'filled' | 'outlined'; // Future
}

// All TextInputProps also work:
// - placeholder
// - value
// - onChangeText
// - keyboardType
// - secureTextEntry
// - autoCapitalize
// - etc.
```

---

## Browser/Platform Support

```
✓ iOS 12+
✓ Android 5.0+ (API 21+)
✓ Expo
✓ React Native 0.63+

No new dependencies required!
Only style updates.
```

---

## Performance

```
✓ Smooth animations on all devices
✓ No jank or stuttering
✓ Uses native driver for animations
✓ No memory leaks
✓ Bundle size: No increase
✓ Rendering: Very fast
```

---

## Accessibility

### VoiceOver (iOS)

```
"Email Address, text field"
"Double tap to edit"
"Error: Invalid email format"
```

### TalkBack (Android)

```
"Email field, edit text"
"Double tap to activate"
"Error: Invalid email"
```

### Keyboard Navigation

```
Tab → Focus input
Enter → Activate if needed
Escape → Blur input (on some platforms)
```

---

## Troubleshooting

### Input looks stretched

**Solution**: Make sure parent View has proper width

```tsx
<View style={{ width: '100%' }}>
  <Input ... />
</View>
```

### Border not showing

**Solution**: Border is 1px, check if it's on transparent background

```tsx
// Good
<View style={{ backgroundColor: '#fff' }}>
  <Input ... />
</View>

// Also good (default)
{/* Input handles its own background */}
```

### Focus animation not working

**Solution**: Make sure Input is not wrapped in disabled component

```tsx
// This works
<Input enabled={true} ... />

// This doesn't
<View pointerEvents="none">
  <Input ... />  {/* Won't focus */}
</View>
```

---

## Migration from Old Inputs

### If you have old custom inputs, update to use new Input component:

```typescript
// OLD (custom underline)
<TextInput
  style={{
    borderBottomWidth: 1,
    paddingVertical: 8,
    marginBottom: 20,
  }}
/>

// NEW (modern)
<Input
  label="Field name"
  placeholder="Placeholder"
  hint="Helper text"
/>
```

---

## Testing

### Component works with standard React Native Testing Library

```typescript
import { render, fireEvent } from '@testing-library/react-native';

it('should update on text change', () => {
  const onChangeText = jest.fn();
  const { getByPlaceholderText } = render(
    <Input placeholder="Email" onChangeText={onChangeText} />
  );

  fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
  expect(onChangeText).toHaveBeenCalledWith('test@example.com');
});
```

---

## Version History

```
v2.0 (Jan 12, 2026) - Modern Design 2025
├─ Rounded corners 16px
├─ Glassmorphism effect
├─ Subtle borders
├─ Smooth animations
└─ Full documentation

v1.0 - Original design
├─ Platform-specific styles
├─ Border-bottom (iOS)
├─ Material fill (Android)
└─ Basic functionality
```

---

## Resources

- 📖 Full Docs: `doc/MODERN_INPUT_DESIGN_2025.md`
- 🎨 Visual Guide: `doc/MODERN_INPUTS_VISUAL_GUIDE.md`
- 🎯 State Examples: `doc/MODERN_INPUTS_STATE_EXAMPLES.md`
- 📋 Changelog: `doc/CHANGELOG_INPUTS_2025.md`
- 💻 Examples: `src/shared/components/ModernInputExamples.tsx`

---

## Questions?

Check documentation files or view examples in `ModernInputExamples.tsx`

**Status**: ✅ Production Ready  
**Version**: 2.0 Modern Design  
**Last Update**: January 12, 2026
