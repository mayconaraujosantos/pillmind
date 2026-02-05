# Node-RED Setup Guide

## Quick Start

1. **Start Node-RED with the correct configuration:**

   ```bash
   npm run nodered
   # or
   node-red --settings settings.js
   ```

2. **Open Node-RED Editor:**
   Open your browser to `http://localhost:1880`

3. **Verify endpoints are loaded:**
   You should see the flow with these endpoints:
   - `POST /api/auth/signup`
   - `POST /api/auth/signin`
   - `POST /api/auth/google`
   - `POST /api/auth/apple`

## Testing Connectivity

### From Desktop/Browser:

```bash
# Test signup
curl -X POST http://localhost:1880/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'

# Test signin
curl -X POST http://localhost:1880/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test social auth
curl -X POST http://localhost:1880/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{}'
```

Or use the provided test script:

```bash
bash scripts/test-nodered.sh
```

### From iOS Simulator:

- Device uses `localhost:1880` to reach Node-RED on host machine
- Test endpoint: `http://localhost:1880/api/auth/google`

### From Android Emulator:

- Emulator uses special alias `10.0.2.2` to reach host machine
- Test endpoint: `http://10.0.2.2:1880/api/auth/google`
- In terminal: `curl http://10.0.2.2:1880` (will fail from host, but works from emulator)

## Configuration Details

The `settings.js` file configures Node-RED to:

1. **Listen on all interfaces** (`0.0.0.0`):

   - Makes Node-RED accessible from Android emulator (10.0.2.2)
   - Makes Node-RED accessible from iOS simulator (localhost)
   - Makes Node-RED accessible from browser (localhost)

2. **Enable CORS** (`httpCors: { origin: '*' }`):

   - Allows requests from different origins (mobile app to backend)
   - Only for development - use proper CORS in production

3. **Expose API at root** (`httpNodeRoot: '/'`):
   - All HTTP endpoints accessible at http://localhost:1880/api/\*

## Troubleshooting

### Node-RED not starting?

```bash
# Make sure Node-RED is installed globally
npm install -g node-red

# Or install locally and use npm script
npm install node-red
npm run nodered
```

### Getting 404 on endpoints?

1. Make sure Node-RED is running: `http://localhost:1880`
2. Make sure the flow is deployed (look for "Deploy" button in editor)
3. Check that the flow has HTTP nodes with correct paths

### Android emulator can't reach Node-RED?

1. Make sure Node-RED is running on host machine
2. Verify it's listening on 0.0.0.0: `netstat -tuln | grep 1880` (Mac/Linux)
3. Check firewall isn't blocking port 1880
4. From emulator, test: Try the app - should now work with http://10.0.2.2:1880

### Still timing out?

1. Check Node-RED logs for errors:

   ```bash
   npm run nodered
   # Look for error messages in console output
   ```

2. Verify endpoints exist in Node-RED:

   - Open http://localhost:1880
   - You should see the auth flow with HTTP endpoints

3. Test endpoint from terminal:
   ```bash
   curl -v -X POST http://localhost:1880/api/auth/google \
     -H "Content-Type: application/json" \
     -d '{}'
   ```

## How the App Works

1. **iOS Simulator**: App → `http://localhost:1880/api/auth/*` → Node-RED
2. **Android Emulator**: App → `http://10.0.2.2:1880/api/auth/*` → Node-RED
3. **Both**: Node-RED returns `{ user: { id, name, email }, token }`
4. **AuthContext**: Saves user + token for authenticated requests

## Port Conflicts?

If port 1880 is already in use:

```bash
# Change port in settings.js
# uiPort: 3000, // or any other port

# Then connect to that port from app (modify getSocialAuthUrl in OnboardingSignUp/SignIn)
```

## Environment Variables

Optional - can be set in `.env.nodered`:

```
NODE_RED_HOST=0.0.0.0
NODE_RED_PORT=1880
NODE_RED_ENABLE_PROJECTS=false
```

But the main settings come from `settings.js` when run with:

```bash
node-red --settings settings.js
```
