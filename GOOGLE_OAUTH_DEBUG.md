# Google OAuth2 Debug - Code 10 Error Fix

## Problem

You're getting error code 10 (DEVELOPER_ERROR) when trying to sign in with Google. This means the app's signing certificate SHA-1 doesn't match what's configured in Google Cloud Console.

## Your Debug Keystore SHA-1

```
5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
```

## Solution: Configure Google Cloud Console

### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Select your project (the one where you created credentials for PillMind)

### Step 2: Add SHA-1 Fingerprint to OAuth Client

1. Navigate to **Credentials** (left sidebar)
2. Find your **Web OAuth 2.0 Client ID** (NOT the debug/Android one yet)
3. Click on it to edit
4. Under **Authorized JavaScript origins**, ensure it includes:
   - `http://localhost:19006` (for Expo Go testing)
   - `http://localhost:8081` (for local testing)

### Step 3: Create/Update Android OAuth Client

1. Click **+ Create Credentials** → **OAuth Client ID**
2. Select **Android** as Application type
3. Package name: `com.mayconaraujosantos.pillmind`
4. Under **SHA-1 certificate fingerprints**, add:
   ```
   5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
   ```
5. Click **Create**
6. Copy the **Client ID** that's generated (this is your Android Client ID)

### Step 4: Update Your Environment

The Web Client ID format should be like: `xxxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`

Update your `.env` file:

```bash
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
```

### Step 5: Update app.json with Android Client ID

Edit `app.json` and update the iOS/Android client IDs from Google Cloud Console:

```json
{
  "plugins": [
    [
      "@react-native-google-signin/google-signin",
      {
        "iosUrlScheme": "com.googleusercontent.apps.YOUR_IOS_CLIENT_ID"
      }
    ]
  ]
}
```

## Important Notes

### For Development (Current Setup)

- **Package Name**: `com.mayconaraujosantos.pillmind`
- **SHA-1**: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25` (debug.keystore)
- This is what you're using now with `eas build --profile development`

### For Production (Future)

When you're ready to release:

1. Generate a production keystore
2. Extract its SHA-1 fingerprint
3. Create a NEW Android OAuth Client in Google Cloud Console with the production SHA-1
4. Update app.json with production IDs before building

### Common Issues

**Error Code 10 (DEVELOPER_ERROR)**:

- SHA-1 in Google Cloud doesn't match app's signing certificate
- Solution: Verify SHA-1 above matches what you configured

**Error Code 12501**:

- Usually means Google Play Services error or wrong Client ID
- Solution: Verify Client ID is correct in .env

**Error Code 12502**:

- Usually means the app is not properly configured
- Solution: Check package name and SHA-1 again

## Next Steps

1. ✅ Get your SHA-1 (done - see above)
2. ⬜ Go to Google Cloud Console and add this SHA-1 to your Android OAuth Client
3. ⬜ Update `.env` with your Web Client ID
4. ⬜ Rebuild with EAS: `eas build --platform android --profile development`
5. ⬜ Test Google Sign-In again

## Troubleshooting

If you still get code 10 after these steps:

1. **Verify package name is correct**:

   ```bash
   grep -r "com.mayconaraujosantos.pillmind" app.json package.json
   ```

2. **Check Google Cloud Console** - Make sure you're looking at the right project

3. **Clear app data** on device/emulator before testing

4. **Check logcat for more details**:
   ```bash
   adb logcat | grep -i "google\|oauth"
   ```

## References

- [React Native Google Signin Troubleshooting](https://react-native-google-signin.github.io/docs/troubleshooting)
- [Google OAuth Setup Guide](https://developers.google.com/identity/gsi/web)
