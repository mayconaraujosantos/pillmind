#!/bin/bash

# Test Node-RED connectivity from different endpoints
# This script helps diagnose Node-RED connection issues

echo "🔍 Testing Node-RED Connectivity..."
echo ""

# Test localhost (for iOS simulator and desktop)
echo "📱 Testing localhost:1880 (for iOS simulator)..."
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:1880/
echo ""

# Test 10.0.2.2 (for Android emulator)
echo "🤖 Testing 10.0.2.2:1880 (for Android emulator)..."
curl -s -o /dev/null -w "Status: %{http_code}\n" http://10.0.2.2:1880/ 2>&1 || echo "Cannot reach 10.0.2.2 from this machine (expected)"
echo ""

# Test auth endpoints if Node-RED is running
echo "✅ Testing auth endpoints..."
echo ""

echo "Testing signup endpoint..."
curl -X POST http://localhost:1880/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}' \
  -w "\nStatus: %{http_code}\n" \
  2>&1 | head -20
echo ""

echo "Testing signin endpoint..."
curl -X POST http://localhost:1880/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  -w "\nStatus: %{http_code}\n" \
  2>&1 | head -20
echo ""

echo "Testing google auth endpoint..."
curl -X POST http://localhost:1880/api/auth/google \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  2>&1 | head -20
echo ""

echo "Testing apple auth endpoint..."
curl -X POST http://localhost:1880/api/auth/apple \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  2>&1 | head -20
echo ""

echo "✅ Tests completed!"
