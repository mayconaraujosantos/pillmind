# 📱 Modern Inputs 2025 - State Examples

## Component States

### 1. Empty State (Default)

#### iOS

```
┌──────────────────────────────┐
│ Email Address                │
│                              │
│ ┌────────────────────────────┐
│ │                            │
│ │ your.email@example.com     │  ← Placeholder text
│ │                            │
│ └────────────────────────────┘  ← Light gray border
│                              │
│ We'll never share your email │  ← Hint text (gray)
│                              │
└──────────────────────────────┘
```

#### Android

```
┌──────────────────────────────┐
│                              │
│ Email Address                │  ← Label
│ ┌────────────────────────────┐
│ │ your.email@example.com  │╱ │  ← Cursor placeholder
│ └────────────────────────────┘
│                              │
│ We'll never share your email │  ← Hint text
│                              │
└──────────────────────────────┘
```

---

### 2. Focused State

#### iOS (Focus Animation)

```
BEFORE FOCUS:
┌──────────────────────────────┐
│ Email Address                │
│ ┌────────────────────────────┐
│ │ your.email@example.com     │
│ └────────────────────────────┘  ← Gray border
└──────────────────────────────┘

AFTER FOCUS (200ms animation):
┌──────────────────────────────┐
│ Email Address                │
│ ┌────────────────────────────┐
│ │ your.email@example.com  ✓│ │
│ └────────────────────────────┘  ← Blue border
└──────────────────────────────┘

Changes:
• Border color: Gray → Primary Blue
• Border opacity: 0 → 1 (animated)
• Label color: Gray → Blue
• Cursor visible
```

#### Android (Focus Animation)

```
BEFORE FOCUS:
┌──────────────────────────────┐
│ Email Address                │
│ ┌────────────────────────────┐
│ │ your.email@example.com     │
│ └────────────────────────────┘  ← Elevation: 1
└──────────────────────────────┘

AFTER FOCUS (Spring animation):
┌──────────────────────────────┐
│ Email Address                │
│ ╭────────────────────────────╮ │
│ │ your.email@example.com  ✓  │ │
│ ╰────────────────────────────╯ │  ← Scale: 1.02
└──────────────────────────────┘

Changes:
• Scale: 1 → 1.02 (spring)
• Border color: Gray → Primary Blue
• Label color: Gray → Blue
• Cursor visible
```

---

### 3. Filled State (With Value)

#### iOS

```
┌──────────────────────────────┐
│ Email Address                │
│ ┌────────────────────────────┐
│ │ user@example.com           │  ← User input
│ │ (Active - Cursor possible) │
│ └────────────────────────────┘
│                              │
│ We'll never share your email │
│                              │
└──────────────────────────────┘
```

#### Android

```
┌──────────────────────────────┐
│ Email Address                │
│ ┌────────────────────────────┐
│ │ user@example.com       ✓   │  ← Input value
│ └────────────────────────────┘
│                              │
│ We'll never share your email │
│                              │
└──────────────────────────────┘
```

---

### 4. Error State

#### iOS

```
┌──────────────────────────────┐
│ Email Address                │
│ ┌────────────────────────────┐
│ │ invalid.email              │
│ └────────────────────────────┘  ← Red border (0.8 opacity)
│                              │
│ ✕ Invalid email format       │  ← Error message (red)
│                              │
└──────────────────────────────┘

Background: rgba(255, 250, 250, 0.8)
Border Color: #FF0000 (error red)
Text Color: Error color
```

#### Android

```
┌──────────────────────────────┐
│ Email Address                │
│ ┌────────────────────────────┐
│ │ invalid.email              │
│ └────────────────────────────┘  ← Red border
│                              │
│ ✕ Invalid email format       │  ← Error message
│                              │
└──────────────────────────────┘

Background: rgba(255, 240, 245, 0.6)
Border Color: #FF0000
```

---

### 5. Password Field (Focused)

#### iOS

```
┌──────────────────────────────┐
│ Password                     │
│ ┌────────────────────────────┐
│ │ ••••••••••          [👁️]   │  ← Toggle visibility
│ └────────────────────────────┘
│                              │
│ Minimum 8 characters         │
│                              │
└──────────────────────────────┘

Click eye icon → Show password
Click again → Hide password
```

#### Android

```
┌──────────────────────────────┐
│ Password                     │
│ ┌────────────────────────────┐
│ │ ••••••••••          [👁️]   │  ← Toggle button
│ └────────────────────────────┘
│                              │
│ Minimum 8 characters         │
│                              │
└──────────────────────────────┘
```

---

### 6. Disabled State (Future)

#### iOS

```
┌──────────────────────────────┐
│ Email Address                │  ← Gray text
│ ┌────────────────────────────┐
│ │ your@example.com (grayed)  │  ← Disabled appearance
│ └────────────────────────────┘  ← Faded border
│                              │
│ This field is disabled       │
│                              │
└──────────────────────────────┘

Opacity: 0.6
Border: Faded
Background: Lighter
```

---

## Form Layouts

### Sign Up Form

```
┌────────────────────────────────────┐
│                                    │
│  Create Account                    │  ← Title
│  Join our community today          │  ← Subtitle
│                                    │
│  Full Name                         │
│  ┌──────────────────────────────┐  │
│  │ John Doe                     │  │
│  └──────────────────────────────┘  │
│                                    │
│  Email Address                     │
│  ┌──────────────────────────────┐  │
│  │ john@example.com             │  │
│  └──────────────────────────────┘  │
│                                    │
│  Password                          │
│  ┌──────────────────────────────┐  │
│  │ ••••••••••          [👁️]     │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  SIGN UP                     │  │
│  └──────────────────────────────┘  │
│                                    │
│  Already have an account? Sign in  │
│                                    │
└────────────────────────────────────┘
```

---

### Login Form

```
┌────────────────────────────────────┐
│                                    │
│  Welcome Back                      │
│  Sign in to your account           │
│                                    │
│  Email Address                     │
│  ┌──────────────────────────────┐  │
│  │ your@email.com               │  │
│  └──────────────────────────────┘  │
│                                    │
│  Password                          │
│  ┌──────────────────────────────┐  │
│  │ ••••••••••          [👁️]     │  │
│  └──────────────────────────────┘  │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  SIGN IN                     │  │
│  └──────────────────────────────┘  │
│                                    │
│  Forgot password?    New here? →   │
│                                    │
└────────────────────────────────────┘
```

---

## Responsive Behavior

### Small Device (320px)

```
┌─────────────────┐
│ Email           │
│ ┌─────────────┐ │
│ │ email@ex... │ │  ← Text truncated
│ └─────────────┘ │
│ We'll never...  │  ← Text truncated
│                 │
└─────────────────┘
```

### Normal Device (375px)

```
┌──────────────────────────┐
│ Email Address            │
│ ┌──────────────────────┐ │
│ │ your.email@example.. │ │
│ └──────────────────────┘ │
│ We'll never share email  │
│                          │
└──────────────────────────┘
```

### Large Device (600px+)

```
┌────────────────────────────────────────┐
│ Email Address                          │
│ ┌────────────────────────────────────┐ │
│ │ your.email@example.com             │ │
│ └────────────────────────────────────┘ │
│ We'll never share your email address   │
│                                        │
└────────────────────────────────────────┘
```

---

## Animation Timings

### Focus In (200ms)

```
Timeline:
0ms     ─── Start (Blur state)
50ms    ─── Label color changes
100ms   ─── Border starts glowing
150ms   ─── Animation in progress
200ms   ─── Complete (Focus state)

Easing: Easing.ease (smooth)
```

### Focus Out (200ms)

```
Timeline:
0ms     ─── Start (Focus state)
100ms   ─── Border starts fading
150ms   ─── Label color reverting
200ms   ─── Complete (Blur state)

Easing: Easing.ease (smooth)
```

### Android Spring Animation

```
Scale: 1 → 1.02
Speed: 20
Tension: 100
Duration: ~300ms

Creates bouncy, modern feel
```

---

## Color Transitions

### Border Color Animation

```
Default State:
borderColor: rgba(200, 200, 200, 0.3)  ← Light gray

Focus State:
borderColor: #007AFF  ← Primary blue

Animation:
0%   → rgba(200, 200, 200, 0.3)
50%  → rgba(0, 122, 255, 0.5)
100% → #007AFF

Duration: 200ms
```

### Label Color Animation

```
Default State:
color: #333333  ← Dark gray

Focus State:
color: #007AFF  ← Primary blue

Animation:
Instant color change or gradual?
Current: Instant for clarity
```

---

## Accessibility States

### Focus Indicator

```
Visual indicator for keyboard navigation:
┌──────────────────────────────┐
│ Email Address                │
│ ┌─────────────────────────────┐ │
│ │ ◇ ─────────────────────────│ │  ← Focus indicator
│ │ your@example.com            │ │
│ │ ─────────────────────────── ◇ │
│ └─────────────────────────────┘ │
│                              │
└──────────────────────────────┘

VoiceOver/TalkBack: "Email Address, text field, focused"
```

### Error State with A11y

```
Visual + Audio feedback:

VoiceOver: "Error: Invalid email format"
TalkBack: "Email field, edit text, error, invalid email format"

Border: Red (color alone isn't enough)
Icon: ✕ symbol added
Text: Error message shown
```

---

## Dark Mode Preview (Future)

### Empty State - Dark Mode

```
┌──────────────────────────────┐
│ Email Address    (light text)│
│ ┌────────────────────────────┐
│ │ your.email@example.com     │  ← Light text
│ └────────────────────────────┘  ← Light border
│                              │
│ We'll never share your email │  ← Light secondary
│                              │
└──────────────────────────────┘

Background: Dark (#1A1A1A)
Input BG: Dark semi-transparent
Border: Light (rgba(200, 200, 200, 0.2))
Text: Light
```

---

**Version**: 2.0 Modern Design 2025  
**Last Updated**: January 12, 2026  
**Status**: Production Ready ✅
