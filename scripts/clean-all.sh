#!/bin/bash

echo "🧹 Limpando cache e dados corrompidos do Expo..."

# Cores para output
RED='\033[0:31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}1. Parando processos do Expo...${NC}"
pkill -f "expo" 2>/dev/null || true
pkill -f "react-native" 2>/dev/null || true

echo -e "${YELLOW}2. Limpando cache do npm...${NC}"
npm cache clean --force

echo -e "${YELLOW}3. Removendo node_modules...${NC}"
rm -rf node_modules

echo -e "${YELLOW}4. Removendo cache do Metro Bundler...${NC}"
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/haste-*

echo -e "${YELLOW}5. Removendo cache do Expo...${NC}"
rm -rf ~/.expo/cache
rm -rf node_modules/.cache

echo -e "${YELLOW}6. Reinstalando dependências...${NC}"
npm install

echo -e "${GREEN}✅ Limpeza concluída!${NC}"
echo -e "${YELLOW}Agora execute: npm run start:clear${NC}"
