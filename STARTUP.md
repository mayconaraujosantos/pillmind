# PillMind - Development Startup Guide

## Prerequisites

- Node.js 16+ and npm
- Android Emulator or iOS Simulator configured
- Expo CLI: `npm install -g expo-cli`
- Node-RED: `npm install -g node-red` (or use local installation)

## Quick Start (First Time)

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Node-RED Backend (in a new terminal)

```bash
npm run nodered
# Wait until you see "Node-RED running at http://localhost:1880/"
```

**Important**: The app authentication endpoints require Node-RED to be running!

### 3. Verify Node-RED (optional but recommended)

```bash
# In another terminal, test the endpoints:
bash scripts/test-nodered.sh

# Or manually test:
curl -X POST http://localhost:1880/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 4. Start the App (in a third terminal)

```bash
# For Android
npm run android

# For iOS
npm run ios
```

## During Development

### Terminals You'll Need

1. **Terminal 1 - Node-RED** (backend):

   ```bash
   npm run nodered
   # Keep this running - it's your mock auth server
   ```

2. **Terminal 2 - Expo** (frontend):

   ```bash
   npm run android
   # or: npm run ios
   ```

3. **Terminal 3** (for git, npm commands, etc.):
   ```bash
   # Run linting, testing, building, etc.
   npm run lint
   npm test
   # etc.
   ```

### Common Tasks

#### Authentication Testing

1. **Manually test endpoints**:

   ```bash
   curl -X POST http://localhost:1880/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@example.com","password":"test123"}'
   ```

2. **In the app**:
   - Go to Onboarding
   - Click Google/Apple button
   - Watch the device logs for detailed timing and error info

#### View Device Logs

```bash
# Android
npm run android:logs

# iOS
npm run ios:logs
```

#### Reset Development Environment

```bash
npm run reset
# This clears cache and rebuilds - useful if something gets weird
```

#### Run Tests

```bash
npm test
npm run test:watch
npm run coverage
```

#### Code Quality

```bash
npm run lint
npm run lint:fix
npm run typecheck
```

## Architecture Overview

### Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│ PillMind App (React Native)                             │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ OnboardingSignUp / OnboardingSignIn Components     │ │
│ │                                                     │ │
│ │ 1. User clicks "Google" or "Apple" button         │ │
│ │ 2. App calls fetchWithTimeout() → Node-RED API     │ │
│ │ 3. getSocialAuthUrl() determines correct endpoint  │ │
│ │    - Android: http://10.0.2.2:1880/api/auth/*    │ │
│ │    - iOS:     http://localhost:1880/api/auth/*    │ │
│ │ 4. Node-RED returns { user, token }               │ │
│ │ 5. AuthContext saves user + token                 │ │
│ └─────────────────────────────────────────────────────┘ │
│ Platform: Android (Emulator) / iOS (Simulator)         │
└─────────────────────────────────────────────────────────┘
              ↓ (HTTP Request)
┌─────────────────────────────────────────────────────────┐
│ Node-RED (Backend - Running on Host Machine)            │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ /api/auth/signup   → Validates email/password      │ │
│ │ /api/auth/signin   → Validates credentials         │ │
│ │ /api/auth/google   → Mock Google login             │ │
│ │ /api/auth/apple    → Mock Apple login              │ │
│ │                                                     │ │
│ │ All endpoints return: { user: { id, name, email }, │ │
│ │                        token: "xyz..." }            │ │
│ └─────────────────────────────────────────────────────┘ │
│ Port: 1880 (configured in settings.js)                 │
│ Listen address: 0.0.0.0 (all interfaces)               │
└─────────────────────────────────────────────────────────┘
```

### Key Components

- **OnboardingSignUp/SignIn**: Authentication screens with modern UI
- **Button**: Animated button component (primary, secondary, outline, ghost, danger)
- **Input**: Platform-aware input (iOS underline, Android Material Design)
- **AuthContext**: Manages authenticated state and user data
- **logger utility**: Provides structured logging with emoji indicators
- **Node-RED flow**: Mock backend with 4 auth endpoints

## Networking Details

### Why Different Hosts?

- **iOS Simulator**: Runs on same machine as Node-RED

  - Can reach `localhost:1880` directly
  - Uses: `http://localhost:1880/api/auth/*`

- **Android Emulator**: Runs in virtual machine, has separate network namespace
  - Cannot reach `localhost` (refers to the emulator, not the host)
  - Uses special alias `10.0.2.2` to reach host machine
  - Uses: `http://10.0.2.2:1880/api/auth/*`

### Device Logs Analysis

When you see in device logs:

- ✅ `⏱️ Request started at` → Network call initiated
- ⏱️ `⏱️ Request completed in XXXms` → Success! Node-RED responded
- 🔴 `⏱️ google request timeout` → Node-RED didn't respond in 30 seconds

**If you get timeout**:

1. ✅ Verify Node-RED is running: `curl http://localhost:1880`
2. ✅ Verify endpoints exist: Check Node-RED editor at http://localhost:1880
3. ✅ Check logs: `npm run nodered` should show request details
4. 🔍 Test from terminal: `curl -X POST http://localhost:1880/api/auth/google ...`
5. 🔍 Try on iOS simulator if Android fails (uses localhost directly)

## Files You'll Modify

### Component Files

- `src/features/onboarding/presentation/components/OnboardingSignUp.tsx` - Sign up logic
- `src/features/onboarding/presentation/components/OnboardingSignIn.tsx` - Sign in logic
- `src/features/onboarding/presentation/components/OnboardingAuth.tsx` - Shared form component
- `src/shared/components/Button.tsx` - Button styling/behavior
- `src/shared/components/Input.tsx` - Input styling/behavior

### Config Files

- `settings.js` - Node-RED configuration (listening address, port, CORS)
- `.env.nodered` - Environment variables reference (optional)
- `package.json` - npm scripts including `npm run nodered`

### Documentation

- `doc/NODERED_SETUP.md` - Detailed Node-RED setup
- `doc/ARCHITECTURE.md` - Overall app architecture

## Debugging Tips

### Enable Debug Logs

Look for logs with timestamps like:

```
[18:53:44.148Z] [DEBUG] [OnboardingSignUp] 📡 Calling google endpoint
[18:53:44.262Z] [DEBUG] [OnboardingSignUp] ⏱️ Request started at
[18:53:50.324Z] [DEBUG] [OnboardingSignUp] ⏱️ Request completed in 6062ms
```

### Check Endpoint Responsiveness

```bash
# From host terminal
curl -X POST http://localhost:1880/api/auth/google \
  -H "Content-Type: application/json" \
  -w "\n%{http_code}\n"
```

Expected output:

- HTTP 200 with JSON response
- Response time < 500ms normally

### Check Node-RED Logs

```bash
# Terminal running Node-RED shows:
[18:53:44.262Z] [auth] Incoming request from 10.0.2.2
[18:53:44.324Z] [auth] Generated token: ...
```

### Check Emulator Connectivity

From Android Emulator terminal (or via device logs):

- If you see network errors in logs, Node-RED might not be reachable
- Try connecting to iOS simulator instead (uses localhost)
- If both fail, Node-RED probably isn't running

## Environment Variables

Optional config in `.env`:

```
EXPO_PUBLIC_NODERED_AUTH_URL=http://localhost:1880/api/auth
```

If not set, the app will auto-detect based on platform:

- Android: `http://10.0.2.2:1880/api/auth`
- iOS: `http://localhost:1880/api/auth`

## Production Notes

⚠️ **Before shipping**:

1. Replace Node-RED with real authentication backend
2. Update `getSocialAuthUrl()` to use real API endpoint
3. Remove mock CORS configuration from settings.js
4. Implement proper error handling for real auth failures
5. Add refresh token logic for expired tokens
6. Enable HTTPS for all API communication
7. Add secure token storage (not in plain text)
8. Implement logout functionality

## Troubleshooting

### "Cannot find module..." errors

```bash
npm install
npm run reset
```

### Android emulator can't reach Node-RED

1. Check Node-RED is running: `curl http://localhost:1880`
2. Check it's listening on 0.0.0.0: Check console output from `npm run nodered`
3. Try iOS simulator instead (uses localhost directly)

### iOS simulator can't reach Node-RED

1. Check Node-RED is running
2. From iOS terminal, run a test - should hit `http://localhost:1880`
3. Check for firewall issues blocking port 1880

### TypeScript compilation errors

```bash
npm run typecheck
npm run lint
```

### Timeout errors in logs

1. Verify Node-RED is actually running (not just installed)
2. Verify flow is deployed in Node-RED editor
3. Test endpoint with curl: `curl -X POST http://localhost:1880/api/auth/google ...`

## Next Steps After Setup

1. ✅ Get authentication working (Node-RED connection)
2. ✅ Test all 4 auth endpoints (signup, signin, google, apple)
3. 📝 Implement real authentication backend
4. 📱 Add navigation to authenticated screens after login
5. 🔐 Add token refresh logic
6. 📊 Add analytics/error tracking
7. 🌍 Expand i18n translations
8. ✨ Add more features based on requirements

## Getting Help

- Check device logs: Device shows detailed timing and error messages
- Check Node-RED logs: Terminal running `npm run nodered` shows request details
- Check network: Try curl commands from terminal
- Check configuration: Verify settings.js and component code
- Read architecture docs: `doc/ARCHITECTURE.md` and `doc/NODERED_SETUP.md`
