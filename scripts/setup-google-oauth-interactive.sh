#!/bin/bash

# Interactive Google OAuth Setup Helper
# This script guides you through fixing Error Code 10

echo ""
echo "🔧 Google OAuth Setup - Interactive Helper"
echo "==========================================="
echo ""
echo "⚠️  You're getting Error Code 10 because the Google Cloud Console"
echo "    is not configured with your app's Android OAuth Client."
echo ""
echo "📋 This script will help you fix it step by step."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Package name
PACKAGE_NAME="com.pillmind.app"

# SHA-1 certificates
SHA1_PRIMARY="5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25"
SHA1_SECONDARY="15:19:55:3D:EA:B3:6F:72:44:7B:77:2F:19:3E:50:B6:7B:D3:99:84"

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 1: Open Google Cloud Console${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "🌐 Open this URL in your browser:"
echo -e "${GREEN}https://console.cloud.google.com/${NC}"
echo ""
read -p "Press ENTER when you have opened Google Cloud Console... "

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 2: Go to Credentials${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "In the Google Cloud Console:"
echo "1. Click on the menu (☰) on the top-left"
echo "2. Go to: ${YELLOW}APIs & Services${NC}"
echo "3. Click on: ${YELLOW}Credentials${NC}"
echo ""
read -p "Press ENTER when you're on the Credentials page... "

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 3: Check for Android OAuth Client${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Look for a section called: ${YELLOW}OAuth 2.0 Client IDs${NC}"
echo ""
echo "Do you see an Android OAuth Client in the list?"
echo "(Look for one with Type: Android)"
echo ""
echo "1) Yes, I see an Android OAuth Client"
echo "2) No, I don't see one"
echo ""
read -p "Enter your choice (1 or 2): " has_android_client

if [ "$has_android_client" == "1" ]; then
    echo ""
    echo -e "${GREEN}✓ Great! Click on the Android OAuth Client to edit it.${NC}"
    echo ""
    read -p "Press ENTER when you've opened it for editing... "
else
    echo ""
    echo -e "${GREEN}✓ No problem! We'll create one.${NC}"
    echo ""
    echo "Click the button: ${YELLOW}+ CREATE CREDENTIALS${NC}"
    echo "Then select: ${YELLOW}OAuth client ID${NC}"
    echo "Then choose Application type: ${YELLOW}Android${NC}"
    echo ""
    read -p "Press ENTER when you see the Android form... "
fi

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 4: Fill in the Package Name${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "In the ${YELLOW}Package name${NC} field, paste this EXACT value:"
echo ""
echo -e "${GREEN}${PACKAGE_NAME}${NC}"
echo ""
echo "💡 TIP: You can select and copy it from above!"
echo ""
read -p "Press ENTER after you've pasted the package name... "

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 5: Add SHA-1 Certificate #1${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "In the ${YELLOW}SHA-1 certificate fingerprint${NC} field, paste:"
echo ""
echo -e "${GREEN}${SHA1_PRIMARY}${NC}"
echo ""
echo "💡 TIP: You can select and copy it from above!"
echo ""
read -p "Press ENTER after you've pasted SHA-1 #1... "

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 6: Add SHA-1 Certificate #2${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Now click the button: ${YELLOW}+ Add fingerprint${NC}"
echo ""
echo "A new field will appear. In this new field, paste:"
echo ""
echo -e "${GREEN}${SHA1_SECONDARY}${NC}"
echo ""
echo "💡 TIP: You can select and copy it from above!"
echo ""
read -p "Press ENTER after you've pasted SHA-1 #2... "

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 7: Save the Configuration${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Click the ${YELLOW}CREATE${NC} or ${YELLOW}SAVE${NC} button at the bottom."
echo ""
read -p "Press ENTER after you've saved... "

echo ""
echo -e "${GREEN}✅ Configuration saved!${NC}"
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 8: Wait for Propagation${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "⏰ ${YELLOW}Important:${NC} Google needs 5-10 minutes to propagate the changes."
echo ""
echo "Would you like to:"
echo "1) Wait now (I'll set a 10-minute timer)"
echo "2) Continue manually later"
echo ""
read -p "Enter your choice (1 or 2): " wait_choice

if [ "$wait_choice" == "1" ]; then
    echo ""
    echo "⏰ Starting 10-minute timer..."
    echo ""
    echo "💡 Feel free to grab a coffee ☕"
    echo ""

    for i in {10..1}; do
        echo -ne "⏰ ${i} minutes remaining...\r"
        sleep 60
    done

    echo ""
    echo -e "${GREEN}✅ 10 minutes passed! Let's continue.${NC}"
else
    echo ""
    echo -e "${YELLOW}⏰ Remember: Wait at least 5-10 minutes before testing!${NC}"
    echo ""
    echo "When you're ready to continue, run this script again or"
    echo "manually execute the cleanup and rebuild steps."
    echo ""
    exit 0
fi

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 9: Clean Cache and Rebuild${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Now we need to clean the cache and rebuild the app."
echo ""
read -p "Press ENTER to start cleaning... "

echo ""
echo "🧹 Cleaning Android build..."
cd android
./gradlew clean
cd ..

echo ""
echo "🧹 Cleaning Metro cache..."
npm start -- --clear &
METRO_PID=$!
sleep 5
kill $METRO_PID 2>/dev/null

echo ""
echo -e "${GREEN}✅ Cache cleaned!${NC}"
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}STEP 10: Rebuild the App${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Now rebuild the app with:"
echo ""
echo -e "${GREEN}npx expo run:android${NC}"
echo ""
echo "Would you like me to start the rebuild now?"
echo "1) Yes, start rebuilding"
echo "2) No, I'll do it manually"
echo ""
read -p "Enter your choice (1 or 2): " rebuild_choice

if [ "$rebuild_choice" == "1" ]; then
    echo ""
    echo "🔨 Starting rebuild..."
    echo ""
    npx expo run:android
else
    echo ""
    echo -e "${YELLOW}📝 When you're ready, run:${NC}"
    echo -e "${GREEN}npx expo run:android${NC}"
fi

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "✅ Google Cloud Console configured"
echo "✅ Cache cleaned"
echo "✅ App rebuilt (or ready to rebuild)"
echo ""
echo "📱 ${YELLOW}Next step:${NC} Test the Google Sign-In in your app!"
echo ""
echo "If it still doesn't work, check:"
echo "- Wait a few more minutes for propagation"
echo "- Close the app completely and reopen"
echo "- Check the logs for any new errors"
echo ""
echo "📖 For more help, see: doc/GOOGLE_OAUTH_TROUBLESHOOTING.md"
echo ""

