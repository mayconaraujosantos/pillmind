# 🔧 Google OAuth Error Code 10 - FIX COMPLETO

## 🚨 Problema Atual

Erro ao fazer login com Google:
```
Error Code 10 (DEVELOPER_ERROR): This usually means the app signing certificate SHA-1 does not match Google Cloud Console configuration.
```

## ✅ Configuração Correta (Verificada em 2026-02-18)

### Package Name
```
com.pillmind.app
```

### SHA-1 Certificates (AMBOS necessários)
```
Primary:   5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
Secondary: 15:19:55:3D:EA:B3:6F:72:44:7B:77:2F:19:3E:50:B6:7B:D3:99:84
```

## 🔨 Passo a Passo para Corrigir

### 1️⃣ Acessar Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Selecione seu projeto do PillMind

### 2️⃣ Configurar OAuth Client ID para Android

1. Vá em **APIs & Services** → **Credentials**
2. Procure por um **OAuth 2.0 Client ID** do tipo **Android**
   - Se NÃO existir, clique em **+ CREATE CREDENTIALS** → **OAuth client ID** → **Android**
   - Se JÁ existir, clique para editá-lo

3. Configure com os seguintes valores:

   **Name:** `PillMind Android Client (Debug)`
   
   **Package name:**
   ```
   com.pillmind.app
   ```
   
   **SHA-1 certificate fingerprint:** (Adicione AMBOS)
   ```
   5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
   ```
   
   Clique em **+ Add fingerprint** e adicione o segundo:
   ```
   15:19:55:3D:EA:B3:6F:72:44:7B:77:2F:19:3E:50:B6:7B:D3:99:84
   ```

4. Clique em **CREATE** ou **SAVE**

### 3️⃣ Verificar Web Client ID

1. Ainda em **Credentials**, localize o **OAuth 2.0 Client ID** do tipo **Web application**
2. Copie o **Client ID** (formato: `XXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX.apps.googleusercontent.com`)

### 4️⃣ Atualizar arquivo .env

Edite o arquivo `.env` na raiz do projeto e certifique-se de que contém:

```bash
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=SEU_WEB_CLIENT_ID.apps.googleusercontent.com
```

> ⚠️ **IMPORTANTE:** Use o **Web Client ID**, NÃO o Android Client ID!

### 5️⃣ Limpar e Reconstruir

Execute os seguintes comandos:

```bash
# Limpar cache do Metro
npm start -- --clear

# OU, para uma limpeza completa:
cd android && ./gradlew clean && cd ..
npm start -- --reset-cache
```

### 6️⃣ Reconstruir o App

```bash
npx expo run:android
```

## 🧪 Testar

1. Abra o app no dispositivo/emulador
2. Vá para a tela de login
3. Clique em "Continuar com Google"
4. O login deve funcionar corretamente agora ✅

## 🔍 Verificar SHA-1 Atual (se necessário)

Se precisar verificar novamente os SHA-1 certificates:

```bash
cd android/app
keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android
```

E também do sistema:

```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

## 📝 Notas Importantes

### Para Desenvolvimento (Atual)
- **Package:** `com.pillmind.app`
- **SHA-1 Certificates:** Ambos os listados acima
- **Build Command:** `npx expo run:android` ou `eas build --profile development`

### Para Produção (Futuro)
Quando for fazer o build de produção:

1. Gere um keystore de produção
2. Extraia o SHA-1 do keystore de produção
3. Crie um NOVO Android OAuth Client no Google Cloud Console
4. Configure com o package name `com.pillmind.app` e o SHA-1 de produção

## ❓ Troubleshooting

### Ainda recebendo erro Code 10?

1. **Aguarde 5-10 minutos** após salvar as configurações no Google Cloud Console
2. **Feche completamente o app** e abra novamente
3. **Limpe o cache:**
   ```bash
   npm start -- --clear
   ```
4. **Reconstrua o app:**
   ```bash
   npx expo run:android
   ```

### Verificar se o Web Client ID está correto

Abra o arquivo de serviço do OAuth e verifique se está usando o Web Client ID:

```bash
cat src/shared/services/oauth.service.ts | grep -A 5 "GoogleSignin.configure"
```

Deve mostrar algo como:
```typescript
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  // ...
});
```

### Logs úteis

Se o erro persistir, verifique os logs completos:
```bash
npx expo run:android
```

E procure por:
- `[OAuthService]` - Logs do serviço de OAuth
- `[AuthContext]` - Logs do contexto de autenticação
- `DEVELOPER_ERROR` - Erros específicos do Google Sign-In

## 📚 Referências

- [Google Sign-In Troubleshooting](https://react-native-google-signin.github.io/docs/troubleshooting)
- [Google Cloud Console](https://console.cloud.google.com/)
- [React Native Google Sign-In Docs](https://react-native-google-signin.github.io/docs/install)

