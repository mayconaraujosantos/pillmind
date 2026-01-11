#!/bin/bash

# Script para iniciar Node-RED e testar as APIs

echo "🚀 Iniciando Node-RED..."
echo ""
echo "📝 IMPORTANTE: Importe o flow manualmente no Node-RED:"
echo "   1. Acesse http://127.0.0.1:1880/"
echo "   2. Menu (☰) → Import"
echo "   3. Selecione o arquivo 'node-red-flow.json'"
echo "   4. Clique em Deploy"
echo ""
echo "⏳ Aguardando 10 segundos para você importar o flow..."
sleep 10

echo ""
echo "🧪 Testando endpoints..."
echo ""

echo "📤 Teste 1: Sign Up"
echo "Endpoint: POST /api/auth/signup"
SIGNUP_RESPONSE=$(curl -s -X POST http://localhost:1880/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }')

if [ -z "$SIGNUP_RESPONSE" ]; then
  echo "❌ Erro: Sem resposta. Certifique-se de que o flow foi importado!"
else
  echo "✅ Resposta:"
  echo "$SIGNUP_RESPONSE" | jq '.' 2>/dev/null || echo "$SIGNUP_RESPONSE"
fi

echo ""
echo "📤 Teste 2: Sign In"
echo "Endpoint: POST /api/auth/signin"
SIGNIN_RESPONSE=$(curl -s -X POST http://localhost:1880/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }')

if [ -z "$SIGNIN_RESPONSE" ]; then
  echo "❌ Erro: Sem resposta. Certifique-se de que o flow foi importado!"
else
  echo "✅ Resposta:"
  echo "$SIGNIN_RESPONSE" | jq '.' 2>/dev/null || echo "$SIGNIN_RESPONSE"
fi

echo ""
echo "📤 Teste 3: Validação de erro (senha curta)"
echo "Endpoint: POST /api/auth/signin"
ERROR_RESPONSE=$(curl -s -X POST http://localhost:1880/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "12345"
  }')

if [ -z "$ERROR_RESPONSE" ]; then
  echo "❌ Erro: Sem resposta. Certifique-se de que o flow foi importado!"
else
  echo "✅ Resposta:"
  echo "$ERROR_RESPONSE" | jq '.' 2>/dev/null || echo "$ERROR_RESPONSE"
fi

echo ""
echo "✨ Testes concluídos!"
echo ""
echo "📱 Próximo passo: Testar no app"
echo "   Execute: npm start"
