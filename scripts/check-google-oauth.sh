#!/bin/bash

# Google OAuth Configuration Checker
# This script verifies the Google OAuth configuration for PillMind

echo "🔍 Google OAuth Configuration Checker"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Must be run from project root${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Package Configuration${NC}"
echo "------------------------"

# Check app.json
if [ -f "app.json" ]; then
    PACKAGE_NAME=$(grep -A 1 '"android":' app.json | grep '"package"' | sed 's/.*"package": *"\([^"]*\)".*/\1/')
    IOS_BUNDLE=$(grep -A 1 '"ios":' app.json | grep '"bundleIdentifier"' | sed 's/.*"bundleIdentifier": *"\([^"]*\)".*/\1/')

    echo -e "Android Package: ${GREEN}${PACKAGE_NAME}${NC}"
    echo -e "iOS Bundle ID:   ${GREEN}${IOS_BUNDLE}${NC}"
else
    echo -e "${RED}❌ app.json not found${NC}"
fi

echo ""
echo -e "${BLUE}🔐 SHA-1 Certificates${NC}"
echo "--------------------"

# Check Android debug keystore
if [ -f "android/app/debug.keystore" ]; then
    echo -e "${GREEN}✓${NC} App debug keystore found"
    SHA1_APP=$(keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android 2>/dev/null | grep "SHA1:" | head -1 | sed 's/.*SHA1: *//')
    echo -e "  App SHA-1: ${YELLOW}${SHA1_APP}${NC}"
else
    echo -e "${YELLOW}⚠${NC}  App debug keystore not found"
fi

# Check system debug keystore
if [ -f "$HOME/.android/debug.keystore" ]; then
    echo -e "${GREEN}✓${NC} System debug keystore found"
    SHA1_SYS=$(keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android 2>/dev/null | grep "SHA1:" | head -1 | sed 's/.*SHA1: *//')
    echo -e "  System SHA-1: ${YELLOW}${SHA1_SYS}${NC}"
else
    echo -e "${YELLOW}⚠${NC}  System debug keystore not found"
fi

echo ""
echo -e "${BLUE}🌐 Environment Configuration${NC}"
echo "---------------------------"

# Check .env file
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env file found"

    if grep -q "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID" .env; then
        WEB_CLIENT_ID=$(grep "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID" .env | sed 's/.*=\s*//')

        if [ -z "$WEB_CLIENT_ID" ]; then
            echo -e "  ${RED}❌ EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is empty${NC}"
        elif [[ $WEB_CLIENT_ID == *".apps.googleusercontent.com"* ]]; then
            echo -e "  ${GREEN}✓${NC} Web Client ID configured correctly"
            echo -e "    ${YELLOW}${WEB_CLIENT_ID}${NC}"
        else
            echo -e "  ${RED}❌ Web Client ID format seems incorrect${NC}"
            echo -e "    ${YELLOW}${WEB_CLIENT_ID}${NC}"
            echo -e "    ${YELLOW}Should end with .apps.googleusercontent.com${NC}"
        fi
    else
        echo -e "  ${RED}❌ EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID not found in .env${NC}"
    fi
else
    echo -e "${RED}❌ .env file not found${NC}"
fi

echo ""
echo -e "${BLUE}📋 Google Cloud Console Configuration${NC}"
echo "-------------------------------------"
echo ""
echo -e "To fix Error Code 10, configure in Google Cloud Console:"
echo -e "https://console.cloud.google.com/"
echo ""
echo -e "1. Go to: ${YELLOW}APIs & Services → Credentials${NC}"
echo -e "2. Create/Edit ${YELLOW}OAuth 2.0 Client ID${NC} of type ${YELLOW}Android${NC}"
echo -e "3. Use these values:"
echo ""
echo -e "   ${GREEN}Package name:${NC}"
echo -e "   ${YELLOW}${PACKAGE_NAME}${NC}"
echo ""
echo -e "   ${GREEN}SHA-1 certificates (add BOTH):${NC}"
if [ ! -z "$SHA1_APP" ]; then
    echo -e "   ${YELLOW}${SHA1_APP}${NC}"
fi
if [ ! -z "$SHA1_SYS" ]; then
    echo -e "   ${YELLOW}${SHA1_SYS}${NC}"
fi
echo ""

echo -e "${BLUE}🔄 Recommended Actions${NC}"
echo "---------------------"
echo ""
echo -e "After updating Google Cloud Console configuration:"
echo ""
echo -e "1. ${GREEN}Wait 5-10 minutes${NC} for changes to propagate"
echo -e "2. ${GREEN}Clean and rebuild:${NC}"
echo -e "   ${YELLOW}cd android && ./gradlew clean && cd ..${NC}"
echo -e "   ${YELLOW}npm start -- --clear${NC}"
echo -e "3. ${GREEN}Rebuild the app:${NC}"
echo -e "   ${YELLOW}npx expo run:android${NC}"
echo ""
echo -e "📖 For detailed instructions, see: ${YELLOW}doc/GOOGLE_OAUTH_FIX.md${NC}"
echo ""

