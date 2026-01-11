# Authentication Testing Guide

## Overview

The PillMind app implements modern, platform-aware authentication with social login options. This guide explains how to test the authentication flow.

## Authentication Flow

```
User → Onboarding → SignUp/SignIn → Google/Apple Button
                                        ↓
                              Node-RED (Backend)
                                        ↓
                              AuthContext (State)
                                        ↓
                              Authenticated Screens
```

## Prerequisites for Testing

### 1. Node-RED Must Be Running

```bash
# Terminal 1
npm run nodered
# Wait for: Node-RED running at http://localhost:1880/
```

### 2. Verify Endpoints Are Loaded

1. Open browser: `http://localhost:1880`
2. You should see the flow with 4 HTTP nodes:

   - `POST /api/auth/signup`
   - `POST /api/auth/signin`
   - `POST /api/auth/google`
   - `POST /api/auth/apple`

3. Click "Deploy" button if flow hasn't been deployed

### 3. Start the App

```bash
# Terminal 2
npm run android
# or: npm run ios
```

## Test Scenarios

### Test 1: Email/Password Signup

**Goal**: Create new account with email and password

**Steps**:

1. In app, navigate to Onboarding screen
2. Fill in:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "Test123!"
3. Tap "Sign Up" button
4. Check device logs for:
   - ✅ `🔄 Sign up button pressed`
   - ✅ `📤 Calling signUp with data`
   - ✅ `✅ Sign up successful` (after ~1-2s)

**Expected Result**: Alert shows "Account created! Please sign in." and navigates to signin

### Test 2: Email/Password Signin

**Goal**: Login with email and password

**Steps**:

1. In app, navigate to OnboardingSignIn
2. Fill in:
   - Email: "test@example.com"
   - Password: "Test123!"
3. Tap "Sign In" button
4. Check device logs for similar timeline as signup

**Expected Result**: Alert shows "Signed in!" and user is authenticated

### Test 3: Google Social Auth

**Goal**: Test Google login flow (mocked by Node-RED)

**Steps**:

1. In app, tap Google icon/button on onboarding
2. Watch device logs closely:

   - `🔐 google sign up started`
   - `📡 Calling google endpoint` with endpoint URL
   - `⏱️ Request started at` with timestamp
   - `⏱️ Request completed in XXms` (should be <500ms)
   - `📥 google response received` with status 200
   - `📦 google response data` with user object
   - `✅ google sign up successful` with user id/email

3. If timeout (~30 seconds):
   - `⏱️ google request timeout`
   - This means Node-RED didn't respond

**Expected Result**:

- Alert shows "Signed up with google!"
- User is authenticated
- Endpoint response time <1000ms

### Test 4: Apple Social Auth

**Goal**: Test Apple login flow (mocked)

**Steps**:

1. In app, tap Apple icon/button on onboarding
2. Same flow as Google test above, but for "apple" instead

**Expected Result**: Same as Google test

## Troubleshooting Tests

### Getting Timeout Errors

```
⏱️ google request timeout
Request took more than 30 seconds
```

**Solutions**:

1. **Verify Node-RED is running**:

   ```bash
   curl http://localhost:1880
   # Should return HTML editor page
   ```

2. **Test endpoint directly**:

   ```bash
   curl -X POST http://localhost:1880/api/auth/google \
     -H "Content-Type: application/json" \
     -d '{}'
   # Should return: {"user":{"id":"...","name":"...","email":"..."},"token":"..."}
   ```

3. **Check which device has issue**:

   - iOS: Try both iOS simulator and Android emulator
   - Android emulator: Verify 10.0.2.2 host alias works
   - iOS simulator: Verify localhost works

4. **Inspect Node-RED logs**:
   ```bash
   # Check the terminal running "npm run nodered"
   # Look for error messages about requests
   ```

### Getting Network Errors (Other than Timeout)

**Check device logs for**:

- `❌ google error` message
- Actual error details

**Common causes**:

- Node-RED not running
- Port 1880 blocked by firewall
- Wrong endpoint URL in `getSocialAuthUrl()`
- Endpoint not deployed in Node-RED

### Getting Response Errors

```
⚠️ google sign up failed
Status: 400
Error: message
```

**Check Node-RED logs for**:

- Input validation errors
- Node configuration issues
- Missing environment variables

## Manual Testing with curl

### From Host Machine

```bash
# Test signup endpoint
curl -X POST http://localhost:1880/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}' \
  -w "\nHTTP %{http_code}\n"

# Test signin endpoint
curl -X POST http://localhost:1880/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  -w "\nHTTP %{http_code}\n"

# Test google auth
curl -X POST http://localhost:1880/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{}' \
  -w "\nHTTP %{http_code}\n"

# Test apple auth
curl -X POST http://localhost:1880/api/auth/apple \
  -H "Content-Type: application/json" \
  -d '{}' \
  -w "\nHTTP %{http_code}\n"
```

**Expected Output**:

```json
{
  "user": {
    "id": "1234567890abc",
    "name": "Test User",
    "email": "test@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
HTTP 200
```

### From Emulator

For **Android emulator**, test from host machine using `10.0.2.2`:

```bash
# This will fail from host machine (as expected)
curl http://10.0.2.2:1880
# But will work from within Android emulator
```

To test from Android emulator directly, you'd need to connect to the emulator shell:

```bash
adb shell
curl http://10.0.2.2:1880/api/auth/google
```

## Test Automation

### Unit Tests (Component-level)

```bash
npm test
```

This runs Jest tests for:

- Button component behavior
- Input component validation
- AuthContext state management
- Helper functions (getSocialAuthUrl, fetchWithTimeout)

### Integration Tests (Full flow)

```bash
# Run with coverage
npm run test:coverage
```

Tests should verify:

- Signup form validation
- Signin form validation
- Network error handling
- Timeout handling
- Response parsing
- AuthContext updates

## Performance Benchmarks

### Expected Response Times

| Scenario      | Expected Time | Max Timeout |
| ------------- | ------------- | ----------- |
| Email signup  | 200-500ms     | 30s         |
| Email signin  | 200-500ms     | 30s         |
| Google auth   | 200-500ms     | 30s         |
| Apple auth    | 200-500ms     | 30s         |
| Network error | Instant       | N/A         |
| Timeout       | 30s           | 30s         |

### Measuring Response Time

Check device logs:

```
⏱️ Request started at 2024-01-15T10:30:45.123Z
⏱️ Request completed in 245ms
```

Response time = completion time - start time

## Testing Checklist

- [ ] Node-RED running: `http://localhost:1880` accessible
- [ ] Endpoints deployed in Node-RED editor
- [ ] iOS simulator can reach `http://localhost:1880`
- [ ] Android emulator can reach `http://10.0.2.2:1880`
- [ ] Email signup works with new account
- [ ] Email signin works with existing account
- [ ] Google auth mocked successfully
- [ ] Apple auth mocked successfully
- [ ] Timeout errors show after ~30 seconds
- [ ] Error messages are clear and helpful
- [ ] Network errors are handled gracefully
- [ ] AuthContext updates with user/token after auth
- [ ] Device logs show detailed timing info

## Debug Logging

The app includes comprehensive logging. Check device logs for:

**Info level**:

```
🔐 google sign up started
✅ google sign up successful
```

**Debug level**:

```
📡 Calling google endpoint
⏱️ Request started at
⏱️ Request completed in 245ms
📥 google response received
📦 google response data
```

**Error level**:

```
❌ google error
⏱️ google request timeout
```

Filter logs in device console to see these messages.

## Next Steps After Auth Works

1. Verify all 4 endpoints work consistently
2. Test on both iOS simulator and Android emulator
3. Test with slow network (Network throttling in browser devtools)
4. Test with no network (airplane mode)
5. Replace Node-RED with real authentication backend
6. Implement token refresh logic
7. Add logout functionality
8. Add password reset flow
