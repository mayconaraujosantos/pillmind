#!/bin/bash

# Quick Health Check for PillMind Authentication Setup
# Run this script to verify everything is configured correctly

echo "🏥 PillMind Authentication Health Check"
echo "========================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counter
CHECKS_PASSED=0
CHECKS_FAILED=0

# Helper function
check_pass() {
    echo -e "${GREEN}✅ $1${NC}"
    ((CHECKS_PASSED++))
}

check_fail() {
    echo -e "${RED}❌ $1${NC}"
    ((CHECKS_FAILED++))
}

check_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo "📋 Checking System Requirements..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    check_pass "Node.js installed: $NODE_VERSION"
else
    check_fail "Node.js not found"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    check_pass "npm installed: $NPM_VERSION"
else
    check_fail "npm not found"
fi

# Check Node-RED
if command -v node-red &> /dev/null; then
    NODE_RED_VERSION=$(node-red --version 2>/dev/null || echo "unknown")
    check_pass "Node-RED installed: $NODE_RED_VERSION"
elif npm list node-red &> /dev/null 2>&1; then
    check_warn "Node-RED installed locally (use 'npm run nodered')"
else
    check_warn "Node-RED not installed (run 'npm install -g node-red')"
fi

echo ""
echo "📁 Checking Project Files..."
echo ""

# Check key files
if [ -f "package.json" ]; then
    check_pass "package.json found"
else
    check_fail "package.json not found"
fi

if [ -f "settings.js" ]; then
    check_pass "settings.js found"
    
    # Check if 0.0.0.0 is configured
    if grep -q "0\.0\.0\.0" settings.js; then
        check_pass "settings.js configured for 0.0.0.0 (all interfaces)"
    else
        check_warn "settings.js may not be configured for all interfaces"
    fi
else
    check_fail "settings.js not found (required for Node-RED config)"
fi

if [ -f "node-red-flow.json" ]; then
    check_pass "node-red-flow.json found"
    
    # Check for required endpoints
    if grep -q "/api/auth/signup" node-red-flow.json; then
        check_pass "  ✓ /api/auth/signup endpoint found"
    else
        check_warn "  /api/auth/signup endpoint not found"
    fi
    
    if grep -q "/api/auth/signin" node-red-flow.json; then
        check_pass "  ✓ /api/auth/signin endpoint found"
    else
        check_warn "  /api/auth/signin endpoint not found"
    fi
    
    if grep -q "/api/auth/google" node-red-flow.json; then
        check_pass "  ✓ /api/auth/google endpoint found"
    else
        check_warn "  /api/auth/google endpoint not found"
    fi
    
    if grep -q "/api/auth/apple" node-red-flow.json; then
        check_pass "  ✓ /api/auth/apple endpoint found"
    else
        check_warn "  /api/auth/apple endpoint not found"
    fi
else
    check_fail "node-red-flow.json not found"
fi

if [ -f "src/features/onboarding/presentation/components/OnboardingSignUp.tsx" ]; then
    check_pass "OnboardingSignUp.tsx found"
    
    # Check for getSocialAuthUrl function
    if grep -q "getSocialAuthUrl" src/features/onboarding/presentation/components/OnboardingSignUp.tsx; then
        check_pass "  ✓ getSocialAuthUrl() function found"
    else
        check_warn "  getSocialAuthUrl() function not found"
    fi
    
    # Check for 10.0.2.2
    if grep -q "10\.0\.2\.2" src/features/onboarding/presentation/components/OnboardingSignUp.tsx; then
        check_pass "  ✓ Android emulator host (10.0.2.2) configured"
    else
        check_warn "  Android emulator host not found"
    fi
else
    check_fail "OnboardingSignUp.tsx not found"
fi

echo ""
echo "🌐 Checking Network Configuration..."
echo ""

# Check localhost
if timeout 2 bash -c 'echo > /dev/tcp/127.0.0.1/1880' 2>/dev/null; then
    check_pass "Port 1880 is open on localhost (Node-RED running)"
else
    check_warn "Port 1880 is NOT open on localhost (start with 'npm run nodered')"
fi

echo ""
echo "📚 Checking Documentation..."
echo ""

if [ -f "doc/NODERED_SETUP.md" ]; then
    check_pass "NODERED_SETUP.md found"
else
    check_warn "NODERED_SETUP.md not found"
fi

if [ -f "STARTUP.md" ]; then
    check_pass "STARTUP.md found"
else
    check_warn "STARTUP.md not found"
fi

if [ -f "doc/ARCHITECTURE.md" ]; then
    check_pass "ARCHITECTURE.md found"
else
    check_warn "ARCHITECTURE.md not found"
fi

if [ -f "doc/AUTHENTICATION_TESTING.md" ]; then
    check_pass "AUTHENTICATION_TESTING.md found"
else
    check_warn "AUTHENTICATION_TESTING.md not found"
fi

echo ""
echo "========================================"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All critical checks passed!${NC}"
    echo ""
    echo "📝 Next Steps:"
    echo "1. Start Node-RED: npm run nodered"
    echo "2. Open Node-RED editor: http://localhost:1880"
    echo "3. Click 'Deploy' button to deploy the flow"
    echo "4. In another terminal: npm run android (or npm run ios)"
    echo "5. Test authentication from the app"
    echo ""
    echo "📖 For detailed setup instructions, read: STARTUP.md"
else
    echo -e "${RED}❌ Some checks failed. Please review the errors above.${NC}"
    echo ""
    echo "💡 Tips:"
    echo "- Run 'npm install' to install dependencies"
    echo "- Run 'npm install -g node-red' to install Node-RED globally"
    echo "- Check doc/NODERED_SETUP.md for detailed setup"
fi

echo ""
echo "📊 Summary: $CHECKS_PASSED passed, $CHECKS_FAILED failed"
