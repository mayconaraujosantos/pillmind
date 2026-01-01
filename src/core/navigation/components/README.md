# TabBarIcon Component

Component responsible for rendering navigation tab bar icons with focused/unfocused states.

## Type Safety Decision

### Chosen Approach: Option 1 - Strict Type Safety (No Fallback)

**Implementation:**

```typescript
interface TabBarIconProps {
  routeName: keyof TabParamList; // Only valid routes accepted
  focused: boolean;
  color: string;
  size: number;
}
```

### Reasoning

✅ **Type Safety at Compile Time**: TypeScript guarantees only valid routes can be passed  
✅ **No Dead Code**: Removed unreachable fallback logic  
✅ **Clear Contract**: Component explicitly declares what it accepts  
✅ **Early Error Detection**: Invalid routes caught during development, not runtime  
✅ **Better Performance**: No unnecessary conditional checks

### Alternative Approaches (Not Chosen)

#### Option 2: Partial Record with Runtime Fallback

```typescript
const TAB_ICONS: Partial<Record<keyof TabParamList, IconConfig>> = { ... };

// Runtime check needed
if (!icons) {
  return <Ionicons name="help-outline" size={size} color={color} />;
}
```

**Why not chosen**: Adds runtime overhead for a scenario that TypeScript already prevents.

#### Option 3: Union Type (string | keyof TabParamList)

```typescript
interface TabBarIconProps {
  routeName: keyof TabParamList | string; // Too permissive
  focused: boolean;
  color: string;
  size: number;
}
```

**Why not chosen**: SonarQube warning - union type makes the specific keys redundant. Loses type safety benefits.

## Benefits of Current Approach

1. **Compiler as Documentation**: The type system documents valid routes
2. **Refactoring Safety**: Adding/removing routes updates types automatically
3. **Zero Runtime Cost**: No conditional logic needed
4. **Cleaner Code**: Fewer lines, clearer intent
5. **SonarQube Compliant**: No code smell warnings

## Usage

```typescript
<TabBarIcon
  routeName="HomeTab"  // ✅ Type-checked
  focused={true}
  color="#007AFF"
  size={24}
/>

<TabBarIcon
  routeName="InvalidTab"  // ❌ Compile error
  focused={true}
  color="#007AFF"
  size={24}
/>
```

## Related Files

- [`TabBarIcon.tsx`](TabBarIcon.tsx) - Component implementation
- [`__tests__/TabBarIcon.test.tsx`](__tests__/TabBarIcon.test.tsx) - Unit tests
- [`../types.ts`](../types.ts) - TabParamList type definition
