# Node-RED API Faker Setup Guide

Este guia explica como configurar uma API faker usando Node-RED para testar as funcionalidades de Sign Up e Sign In do PillMind.

## 📋 Pré-requisitos

- Node.js instalado
- Node-RED instalado globalmente (`npm install -g node-red`)

## 🚀 Instalação do Node-RED

Se você ainda não tem o Node-RED instalado:

```bash
npm install -g node-red
```

Para iniciar o Node-RED:

```bash
node-red
```

Acesse o editor em: http://localhost:1880

## 🔧 Configuração dos Endpoints

### 1. Endpoint de Sign Up

**POST** `/api/auth/signup`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**

```json
{
  "user": {
    "id": "{{$randomUUID}}",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "{{$randomAlphaNumeric(64)}}"
}
```

**Response (Error - 400):**

```json
{
  "message": "Email already exists",
  "code": "EMAIL_EXISTS"
}
```

### 2. Endpoint de Sign In

**POST** `/api/auth/signin`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**

```json
{
  "user": {
    "id": "{{$randomUUID}}",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "{{$randomAlphaNumeric(64)}}"
}
```

**Response (Error - 401):**

```json
{
  "message": "Invalid credentials",
  "code": "INVALID_CREDENTIALS"
}
```

## 🎯 Fluxo Node-RED (Exemplo)

### Sign Up Flow

```
[http in: POST /api/auth/signup]
    ↓
[function: Validate Input]
    ↓
[switch: Check if valid]
    ├─ Valid → [function: Generate User Data]
    │             ↓
    │          [http response: 200]
    │
    └─ Invalid → [function: Error Response]
                    ↓
                 [http response: 400]
```

### Sign In Flow

```
[http in: POST /api/auth/signin]
    ↓
[function: Validate Credentials]
    ↓
[switch: Check credentials]
    ├─ Valid → [function: Generate Token]
    │             ↓
    │          [http response: 200]
    │
    └─ Invalid → [function: Error Response]
                    ↓
                 [http response: 401]
```

## 📝 Código dos Function Nodes

### Sign Up - Validate Input Function

```javascript
const { name, email, password } = msg.payload;

if (!name || !email || !password) {
  msg.statusCode = 400;
  msg.payload = {
    message: 'All fields are required',
    code: 'MISSING_FIELDS',
  };
  return [null, msg];
}

// Simple email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  msg.statusCode = 400;
  msg.payload = {
    message: 'Invalid email format',
    code: 'INVALID_EMAIL',
  };
  return [null, msg];
}

return [msg, null];
```

### Sign Up - Generate User Data Function

```javascript
const { name, email, password } = msg.payload;

// Generate random ID (simple version)
const userId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

// Generate random token
const token = Array(64)
  .fill(0)
  .map(
    () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[
        Math.floor(Math.random() * 62)
      ]
  )
  .join('');

msg.statusCode = 200;
msg.payload = {
  user: {
    id: userId,
    name: name,
    email: email,
  },
  token: token,
};

return msg;
```

### Sign In - Validate Credentials Function

```javascript
const { email, password } = msg.payload;

if (!email || !password) {
  msg.statusCode = 400;
  msg.payload = {
    message: 'Email and password are required',
    code: 'MISSING_FIELDS',
  };
  return [null, msg];
}

// Mock validation - aceita qualquer email/senha para teste
// Em produção, você verificaria com um banco de dados
if (password.length < 6) {
  msg.statusCode = 401;
  msg.payload = {
    message: 'Invalid credentials',
    code: 'INVALID_CREDENTIALS',
  };
  return [null, msg];
}

return [msg, null];
```

### Sign In - Generate Token Function

```javascript
const { email } = msg.payload;

// Generate random ID and token
const userId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
const token = Array(64)
  .fill(0)
  .map(
    () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[
        Math.floor(Math.random() * 62)
      ]
  )
  .join('');

msg.statusCode = 200;
msg.payload = {
  user: {
    id: userId,
    name: 'Test User',
    email: email,
  },
  token: token,
};

return msg;
```

## 🔌 Configuração no App

### 1. Arquivo .env

O arquivo `.env` já foi criado na raiz do projeto com a seguinte configuração:

```env
EXPO_PUBLIC_API_URL=http://localhost:1880/api
```

**Para Android Emulator:**

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:1880/api
```

**Para dispositivo físico (mesma rede):**

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:1880/api
```

### 2. Testando a Conexão

Após configurar o Node-RED e iniciar o app:

1. Navegue até a tela de Sign Up
2. Preencha os campos (nome, email, senha)
3. Pressione "Sign Up"
4. Você deve ver um alert de sucesso

Para Sign In:

1. Navegue até a tela de Sign In
2. Preencha email e senha (qualquer senha com 6+ caracteres)
3. Pressione "Sign In"
4. Você deve ver um alert de sucesso

## 🎨 Flow JSON para Importação

Você pode copiar e colar este JSON no Node-RED (Menu → Import):

```json
[
  {
    "id": "signup_http",
    "type": "http in",
    "z": "flow1",
    "name": "POST /api/auth/signup",
    "url": "/api/auth/signup",
    "method": "post",
    "upload": false,
    "swaggerDoc": "",
    "x": 150,
    "y": 100
  },
  {
    "id": "signup_validate",
    "type": "function",
    "z": "flow1",
    "name": "Validate Input",
    "func": "const { name, email, password } = msg.payload;\n\nif (!name || !email || !password) {\n    msg.statusCode = 400;\n    msg.payload = {\n        message: \"All fields are required\",\n        code: \"MISSING_FIELDS\"\n    };\n    return [null, msg];\n}\n\nreturn [msg, null];",
    "outputs": 2,
    "x": 350,
    "y": 100
  },
  {
    "id": "signup_generate",
    "type": "function",
    "z": "flow1",
    "name": "Generate User",
    "func": "const { name, email } = msg.payload;\nconst userId = Date.now().toString();\nconst token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);\n\nmsg.statusCode = 200;\nmsg.payload = {\n    user: { id: userId, name: name, email: email },\n    token: token\n};\nreturn msg;",
    "outputs": 1,
    "x": 550,
    "y": 80
  },
  {
    "id": "signup_response_success",
    "type": "http response",
    "z": "flow1",
    "name": "Response 200",
    "statusCode": "",
    "x": 750,
    "y": 80
  },
  {
    "id": "signup_response_error",
    "type": "http response",
    "z": "flow1",
    "name": "Response 400",
    "statusCode": "",
    "x": 750,
    "y": 120
  },
  {
    "id": "signin_http",
    "type": "http in",
    "z": "flow1",
    "name": "POST /api/auth/signin",
    "url": "/api/auth/signin",
    "method": "post",
    "upload": false,
    "swaggerDoc": "",
    "x": 150,
    "y": 250
  },
  {
    "id": "signin_validate",
    "type": "function",
    "z": "flow1",
    "name": "Validate Credentials",
    "func": "const { email, password } = msg.payload;\n\nif (!email || !password) {\n    msg.statusCode = 400;\n    msg.payload = {\n        message: \"Email and password are required\",\n        code: \"MISSING_FIELDS\"\n    };\n    return [null, msg];\n}\n\nif (password.length < 6) {\n    msg.statusCode = 401;\n    msg.payload = {\n        message: \"Invalid credentials\",\n        code: \"INVALID_CREDENTIALS\"\n    };\n    return [null, msg];\n}\n\nreturn [msg, null];",
    "outputs": 2,
    "x": 370,
    "y": 250
  },
  {
    "id": "signin_generate",
    "type": "function",
    "z": "flow1",
    "name": "Generate Token",
    "func": "const { email } = msg.payload;\nconst userId = Date.now().toString();\nconst token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);\n\nmsg.statusCode = 200;\nmsg.payload = {\n    user: { id: userId, name: \"Test User\", email: email },\n    token: token\n};\nreturn msg;",
    "outputs": 1,
    "x": 570,
    "y": 230
  },
  {
    "id": "signin_response_success",
    "type": "http response",
    "z": "flow1",
    "name": "Response 200",
    "statusCode": "",
    "x": 770,
    "y": 230
  },
  {
    "id": "signin_response_error",
    "type": "http response",
    "z": "flow1",
    "name": "Response 401",
    "statusCode": "",
    "x": 770,
    "y": 270
  }
]
```

## 🧪 Testando com cURL

### Sign Up

```bash
curl -X POST http://localhost:1880/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Sign In

```bash
curl -X POST http://localhost:1880/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 📱 Testando no Expo

1. Certifique-se de que o Node-RED está rodando
2. Inicie o app: `npm start`
3. Use a tela de Sign Up ou Sign In
4. Verifique os logs do Node-RED para ver as requisições

## 🐛 Troubleshooting

### Erro de conexão no Android Emulator

Use `http://10.0.2.2:1880/api` ao invés de `localhost`

### Erro de conexão no dispositivo físico

- Certifique-se de que o dispositivo e o computador estão na mesma rede
- Use o IP local do computador (ex: `http://192.168.1.100:1880/api`)
- Para descobrir o IP: `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)

### Node-RED não responde

- Verifique se o Node-RED está rodando
- Verifique se os endpoints estão configurados corretamente
- Verifique os logs do Node-RED no terminal

## 📚 Recursos Adicionais

- [Node-RED Documentation](https://nodered.org/docs/)
- [Node-RED HTTP nodes](https://nodered.org/docs/user-guide/nodes#http)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
