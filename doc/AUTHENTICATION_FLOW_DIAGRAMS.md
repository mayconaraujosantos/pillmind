# 📊 Authentication Flow Diagrams

## Complete Authentication Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                   PillMind Application                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          Onboarding Screen (Authentication)             │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  Sign Up Form                                      │ │  │
│  │  │  ├─ Name Input       (Platform-aware: iOS/Android)│ │  │
│  │  │  ├─ Email Input      (Border-bottom / Material)   │ │  │
│  │  │  └─ Password Input   (With eye icon)              │ │  │
│  │  │                                                    │ │  │
│  │  │  [Sign Up Button] - Modern animated button        │ │  │
│  │  │                                                    │ │  │
│  │  │  ─────────── or ───────────                       │ │  │
│  │  │                                                    │ │  │
│  │  │  [🔵 Google] [◇ Apple] - Social Auth             │ │  │
│  │  │                                                    │ │  │
│  │  │  [Already have account? Sign In]                  │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                            ↓
                  [Email/Password OR Social]
                            ↓
        ┌──────────────────────────────────────────────┐
        │   fetchWithTimeout() Network Layer           │
        │  (30s timeout, JSON headers, error handling) │
        └──────────────────────────────────────────────┘
                            ↓
          getSocialAuthUrl() Platform Detection
                            ↓
        ┌──────────────────────────────────────────────┐
        │  Platform-Specific Endpoint URL             │
        ├──────────────────────────────────────────────┤
        │  Android: http://10.0.2.2:1880/api/auth/*   │
        │  iOS:     http://localhost:1880/api/auth/*  │
        └──────────────────────────────────────────────┘
                            ↓
        ┌──────────────────────────────────────────────┐
        │          Node-RED Backend (Port 1880)        │
        │  Running on: 0.0.0.0 (all interfaces)        │
        │                                              │
        │  POST Endpoints:                             │
        │  ├─ /api/auth/signup                         │
        │  │  └─→ Validate & Generate User + Token     │
        │  ├─ /api/auth/signin                         │
        │  │  └─→ Validate Credentials + Token         │
        │  ├─ /api/auth/google                         │
        │  │  └─→ Mock Google Auth + Generate Token    │
        │  └─ /api/auth/apple                          │
        │     └─→ Mock Apple Auth + Generate Token     │
        └──────────────────────────────────────────────┘
                            ↓
                  Response: { user, token }
                            ↓
        ┌──────────────────────────────────────────────┐
        │     AuthContext.login(data)                  │
        │  Saves user + token to React Context         │
        └──────────────────────────────────────────────┘
                            ↓
        ┌──────────────────────────────────────────────┐
        │     Authenticated User State                 │
        │  ├─ User ID, Name, Email                     │
        │  ├─ Authentication Token                     │
        │  └─ Available for all subsequent requests    │
        └──────────────────────────────────────────────┘
                            ↓
        ┌──────────────────────────────────────────────┐
        │  Navigate to Authenticated Screens           │
        │  (Home, Appointments, Profile, etc.)         │
        └──────────────────────────────────────────────┘
```

## Email/Password Flow

```
User Onboarding Screen
        ↓
User fills form:
  • Name: "John Doe"
  • Email: "john@example.com"
  • Password: "SecurePassword123!"
        ↓
User taps "Sign Up" button
        ↓
App validates inputs
        ↓
  handleSignUp() executes:
    1. Calls signUp() hook with {name, email, password}
    2. Waits for response
    3. If success: Shows "Account created! Please sign in."
    4. If error: Shows error message
        ↓
  Success → Navigate to SignIn screen
  Error → Stay on SignUp screen with error
        ↓
Later: User does SignIn
        ↓
User fills form:
  • Email: "john@example.com"
  • Password: "SecurePassword123!"
        ↓
User taps "Sign In" button
        ↓
  handleSignIn() executes:
    1. Calls signIn() hook with {email, password}
    2. Waits for response
    3. If success: AuthContext saves user + token
    4. Shows "Signed in!" alert
    5. Navigates to authenticated screens
        ↓
✅ User authenticated!
```

## Social Auth Flow (Google/Apple)

```
User Onboarding Screen
        ↓
User taps Google/Apple button (56x56px circle icon)
        ↓
handleSocialSignUp(provider) OR handleSocialSignIn(provider)
        ↓
[REQUEST PHASE]
1. getSocialAuthUrl('google') generates endpoint:
   - Platform detection: Android vs iOS
   - Returns correct URL:
     • Android: "http://10.0.2.2:1880/api/auth/google"
     • iOS:     "http://localhost:1880/api/auth/google"

2. Logs: "🔐 google sign up started"
   (Device logs show: [timestamp] [OnboardingSignUp] 🔐 google sign up started)

3. Logs: "📡 Calling google endpoint"
   Includes endpoint URL and platform info

4. fetchWithTimeout() called:
   - Creates AbortController
   - Sets 30-second timeout
   - Makes POST request with:
     • JSON headers
     • Empty body {}
     • timeout signal

5. Logs: "⏱️ Request started at [timestamp]"
        ↓
[NETWORK PHASE - Waiting for Node-RED]

   Node-RED receives request:
   • Processes at /api/auth/google endpoint
   • Generates random user ID
   • Generates random 64-char token
   • Returns: {
       user: { id: "...", name: "...", email: "..." },
       token: "..."
     }
        ↓
[RESPONSE PHASE]
1. Logs: "⏱️ Request completed in [XXms]"
   (Example: "⏱️ Request completed in 245ms")

2. Logs: "📥 google response received"
   Includes status code, ok flag, statusText

3. Logs: "📦 google response data"
   Includes: hasUser, hasToken, dataKeys, message, error

4. If response.ok && data.user && data.token:
   ✅ Success path:
     a. Logs: "✅ google sign up successful"
     b. Calls: authContext.login(data)
        • Saves user to context
        • Saves token to context
     c. Shows alert: "Signed up with google!"
     d. Calls: onSignUpComplete?.()
        • Navigates to authenticated screens

   ❌ Error path (400/401/403/etc):
     a. Logs: "⚠️ google sign up failed"
     b. Shows alert with error message
     c. Stays on signup screen
        ↓
[TIMEOUT PATH - If >30 seconds pass]
   • AbortController sends abort signal
   • fetch() throws AbortError
   • err.name === 'AbortError' detected
   • Logs: "⏱️ google request timeout"
   • Shows alert: "google request timed out. Make sure Node-RED is running."
   • Stays on signup screen
```

## Timing Diagram

```
Timeline: Email/Password Signup

User Action → [Input validation] → 50ms
        ↓
handleSignUp() → [API call] → 1-2 seconds
        ↓
Response received
        ↓
[Parse response] → 10ms
        ↓
[Save to AuthContext] → 50ms
        ↓
[Navigate] → 300ms
        ↓
Total: 1.5-2.5 seconds

Timeline: Social Auth

User tap → [Get endpoint] → 5ms
        ↓
getSocialAuthUrl() → [Platform detection] → 1ms
        ↓
fetchWithTimeout() → [Network call] → 100-500ms
        ↓
Node-RED processes → [Generate data] → 50-100ms
        ↓
Response received
        ↓
[Parse JSON] → 10ms
        ↓
[Save to AuthContext] → 50ms
        ↓
[Navigate] → 300ms
        ↓
Total: 200-1000ms (Normal)
       30000ms (Timeout)
```

## Error Handling Flow

```
Network Request
        ↓
    ┌───┴───┐
    ↓       ↓
Success   Error
    ↓       ↓
  ┌─┴─┐   ┌─┴──────────┐
  ↓   ↓   ↓             ↓
 200 400 Timeout    Network
 300 401 (30s)      Error
 ...
        ↓
    Parse response
        ↓
    ┌─────┴─────┐
    ↓           ↓
 Valid       Invalid
  ↓            ↓
User+Token    Error
created       message
    ↓            ↓
Save to ctx  Show alert
    ↓            ↓
Navigate     Stay on
to home      screen
    ↓
✅ Done

Specific Error Cases:

1. TIMEOUT (AbortError)
   └─ User sees: "google request timed out. Make sure Node-RED is running."

2. NETWORK ERROR (e.g., ECONNREFUSED)
   └─ User sees: "Error signing up with google"
   └─ Device logs: Error details with code/message

3. BAD RESPONSE (200 but invalid data)
   └─ User sees: data.message or data.error
   └─ Device logs: Response data details

4. SERVER ERROR (500)
   └─ User sees: Error message from Node-RED
   └─ Device logs: "status: 500"
```

## Component Architecture

```
OnboardingSignUp.tsx
├── State:
│   ├─ name (string)
│   ├─ email (string)
│   ├─ password (string)
│   └─ loading (boolean)
│
├── Context:
│   ├─ useAuth() - signUp, loading, error
│   └─ useAuthContext() - login function
│
├── Helper Functions:
│   ├─ getSocialAuthUrl(provider)
│   │  ├─ Detects environment
│   │  └─ Returns platform-specific URL
│   │
│   └─ fetchWithTimeout(url, timeout=30000)
│      ├─ Creates AbortController
│      ├─ Sets timeout
│      └─ Returns Response
│
├── Event Handlers:
│   ├─ handleSignUp()
│   │  └─ Email/password signup
│   │
│   └─ handleSocialSignUp(provider)
│      ├─ Social auth
│      ├─ Detailed logging
│      └─ Error handling
│
└── Render:
    └─ OnboardingAuth component
       ├─ Form fields (name, email, password)
       ├─ Submit button
       ├─ Divider
       ├─ Social buttons (Google, Apple)
       └─ SignIn link
```

## State Management Flow

```
Initial State:
  user = null
  token = null
  isAuthenticated = false

        ↓
Authentication succeeds:
  authContext.login({
    user: { id, name, email },
    token
  })
        ↓
AuthContext saves to state:
  user = { id, name, email }
  token = "xyz123..."
  isAuthenticated = true
        ↓
Available to entire app:
  All screens can access user info
  All API calls can include token in header

        ↓
On logout:
  authContext.logout()

        ↓
AuthContext clears state:
  user = null
  token = null
  isAuthenticated = false
        ↓
Navigate back to Onboarding
```

## Network Topology

```
Development Machine (Host)
│
├─ Node-RED Server (0.0.0.0:1880)
│  ├─ Listening on all interfaces
│  ├─ CORS enabled for development
│  └─ 4 HTTP endpoints for auth
│
├─ iOS Simulator
│  └─ Uses: http://localhost:1880
│     └─ "localhost" = host machine
│
└─ Android Emulator
   └─ Uses: http://10.0.2.2:1880
      └─ "10.0.2.2" = special alias to host machine
```

## Device Log Example

```
[18:30:45.120Z] [OnboardingSignUp] 🔐 google sign up started
[18:30:45.142Z] [OnboardingSignUp] 📡 Calling google endpoint {
  endpoint: "http://10.0.2.2:1880/api/auth/google",
  platform: "android"
}
[18:30:45.158Z] [OnboardingSignUp] ⏱️ Request started at {
  time: "2024-01-15T18:30:45.158Z"
}
[18:30:45.382Z] [OnboardingSignUp] ⏱️ Request completed in 224ms {
  duration: 224,
  status: 200
}
[18:30:45.395Z] [OnboardingSignUp] 📥 google response received {
  status: 200,
  ok: true,
  statusText: "OK"
}
[18:30:45.412Z] [OnboardingSignUp] 📦 google response data {
  hasUser: true,
  hasToken: true,
  dataKeys: [ "user", "token" ],
  message: undefined,
  error: undefined
}
[18:30:45.425Z] [OnboardingSignUp] ✅ google sign up successful {
  userId: "1705343445382abc",
  email: "user-1705343445382@example.com"
}

Alert shown to user: "Signed up with google!"
AuthContext saved user + token
Navigation to authenticated screens
```

## Success Indicators

✅ **Fast Response** (100-500ms)

```
⏱️ Request started at 18:30:45.158Z
⏱️ Request completed in 224ms
```

✅ **All 4 Endpoints Working**

```
Google ✅, Apple ✅, Signup ✅, Signin ✅
```

✅ **Clear Error Messages**

```
Alert: "Email already exists"
or
Alert: "google request timed out. Make sure Node-RED is running."
```

❌ **Timeout** (30000ms exactly)

```
⏱️ google request timeout
Error: 'Request took more than 30 seconds'
```

---

These diagrams show the complete flow of authentication in PillMind from UI interaction through to authenticated state.
