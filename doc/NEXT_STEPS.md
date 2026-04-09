# ✅ Próximos Passos - Configuração Completa

## 📋 Status Atual

✅ **Implementado:**

- API Service (fetch wrapper)
- Auth Service (signup/signin)
- useAuth Hook
- Componentes integrados (OnboardingSignUp, OnboardingSignIn)
- Testes unitários (377 testes passando)
- Arquivo .env configurado
- Flow JSON do Node-RED criado

✅ **Node-RED:**

- Instalado e pronto para uso
- Flow JSON disponível em: `node-red-flow.json`

## 🎯 Ação Necessária (VOCÊ DEVE FAZER)

### 1️⃣ Importar o Flow no Node-RED

**Execute em um terminal separado:**

```bash
node-red
```

**Então:**

1. **Abra no navegador:** http://127.0.0.1:1880/
2. **Clique no menu** ☰ (canto superior direito)
3. **Selecione:** Import
4. **Clique em:** "select a file to import"
5. **Selecione:** `node-red-flow.json` (na raiz do projeto)
6. **Clique em:** Import
7. **Clique em:** Deploy (botão vermelho no topo)
8. **Aguarde:** "Successfully deployed"

### 2️⃣ Testar as APIs

**Em um novo terminal, execute:**

```bash
./test-api.sh
```

Ou teste manualmente:

**Sign Up:**

```bash
curl -X POST http://localhost:1880/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Sign In:**

```bash
curl -X POST http://localhost:1880/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### 3️⃣ Testar no App

**Inicie o app:**

```bash
npm start
```

**Teste a funcionalidade:**

1. Abra o app no emulador/dispositivo
2. Complete o onboarding até o último passo
3. Clique em "Create an account"
4. Preencha os dados e clique em "Sign Up"
5. Veja o alert de sucesso! 🎉

## 📱 Configurações Específicas

### Para Android Emulator

Edite o `.env`:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:1880/api
```

### Para Dispositivo Físico

1. Descubra seu IP:

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

2. Edite o `.env`:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP:1880/api
```

3. Reinicie o app

## 🐛 Troubleshooting

### Erro: "Network request failed"

- ✅ Verifique se Node-RED está rodando: `curl http://localhost:1880/`
- ✅ Verifique se o flow foi importado e deployed
- ✅ Verifique a URL no .env

### Erro: "Cannot find element"

- ✅ Aguarde alguns segundos na tela de onboarding
- ✅ Role até o último passo (passo 2)

### Node-RED não inicia

```bash
# Kill processos anteriores
pkill -f node-red

# Inicie novamente
node-red
```

## 📚 Documentação Detalhada

- **Guia Completo:** [doc/NODE_RED_API_SETUP.md](doc/NODE_RED_API_SETUP.md)
- **Quick Start:** [NODERED_QUICKSTART.md](NODERED_QUICKSTART.md)

## 🎉 Pronto!

Após seguir estes passos, você terá:

- ✅ API faker funcionando
- ✅ Telas de Sign Up/Sign In integradas
- ✅ Validações funcionando
- ✅ Feedback visual (loading + alerts)

**Aproveite! 🚀**
