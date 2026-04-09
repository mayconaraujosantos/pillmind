# 🚀 Guia Rápido - Configuração Node-RED

## ✅ Status Atual

- ✅ Node-RED instalado
- ✅ Node-RED rodando em http://127.0.0.1:1880/
- ✅ Arquivo .env configurado com `EXPO_PUBLIC_API_URL=http://localhost:1880/api`
- ✅ Flow JSON criado em `node-red-flow.json`

## 📝 Passos para Importar o Flow

### 1. Abrir o Editor Node-RED

O editor já está aberto no Simple Browser ou acesse: http://127.0.0.1:1880/

### 2. Importar o Flow

1. Clique no **menu** (☰) no canto superior direito
2. Selecione **Import**
3. Clique em **select a file to import**
4. Selecione o arquivo `node-red-flow.json` na raiz do projeto
5. Clique em **Import**

### 3. Deploy

1. Clique no botão vermelho **Deploy** no canto superior direito
2. Aguarde a mensagem "Successfully deployed"

## 🧪 Testar a API

### Teste 1: Sign Up (Terminal)

```bash
curl -X POST http://localhost:1880/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Resposta esperada:**

```json
{
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "..."
}
```

### Teste 2: Sign In (Terminal)

```bash
curl -X POST http://localhost:1880/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Resposta esperada:**

```json
{
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "john@example.com"
  },
  "token": "..."
}
```

## 📱 Testar no App

### 1. Iniciar o app

```bash
npm start
```

### 2. Testar Sign Up

1. Abra o app
2. Navegue até a tela de onboarding
3. No último passo, clique em "Create an account"
4. Preencha:
   - Nome: Seu nome
   - Email: teste@example.com
   - Senha: password123
5. Clique em "Sign Up"
6. Você deve ver um alert de sucesso!

### 3. Testar Sign In

1. Na tela de onboarding, clique em "Login"
2. Preencha:
   - Email: teste@example.com
   - Senha: password123
3. Clique em "Sign In"
4. Você deve ver um alert de sucesso!

## 🐛 Troubleshooting

### Erro de conexão no Android Emulator

Edite o arquivo `.env`:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:1880/api
```

### Erro de conexão no dispositivo físico

1. Descubra seu IP local:

   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. Edite o arquivo `.env`:
   ```env
   EXPO_PUBLIC_API_URL=http://SEU_IP:1880/api
   ```

### Node-RED não responde

Verifique se está rodando:

```bash
curl http://localhost:1880/
```

Se não estiver, inicie novamente:

```bash
node-red
```

## 📊 Ver Requisições no Node-RED

No editor do Node-RED, você pode adicionar nós de **debug** para ver as requisições:

1. Arraste um nó **debug** para o flow
2. Conecte-o aos nós de função
3. Clique em **Deploy**
4. Abra o painel **Debug** (ícone de bug no menu lateral direito)
5. Faça requisições e veja os logs em tempo real

## ✨ Pronto!

Agora você tem uma API fake funcionando perfeitamente para testar as telas de Sign Up e Sign In do PillMind! 🎉
