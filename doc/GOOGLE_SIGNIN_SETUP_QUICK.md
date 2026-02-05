# 🚀 Setup Rápido - Google Sign-In no Expo

## ⚠️ Erro Atual

```
'RNGoogleSignin' could not be found
```

**Causa**: Módulo nativo não instalado. Você está usando Expo Go que não suporta módulos nativos personalizados.

## ✅ Solução: Usar Custom Development Build

### Opção 1: Desenvolvimento Local (Recomendado)

1. **Instale EAS CLI**:

   ```bash
   npm install -g eas-cli
   ```

2. **Login no Expo**:

   ```bash
   eas login
   ```

3. **Configure o projeto**:

   ```bash
   eas build:configure
   ```

4. **Crie um Development Build para iOS**:

   ```bash
   # Para iOS Simulator (mais rápido)
   eas build --platform ios --profile development --local

   # OU para device físico
   eas build --platform ios --profile development
   ```

5. **Após o build, instale no simulator/device**:

   ```bash
   # Se for simulator
   xcrun simctl install booted ./path-to-your-app.app

   # Se for device físico, baixe do EAS e instale via Xcode
   ```

6. **Rode o desenvolvimento**:
   ```bash
   npx expo start --dev-client
   ```

### Opção 2: Build na Nuvem (Mais Fácil)

1. **Instale EAS CLI**:

   ```bash
   npm install -g eas-cli
   ```

2. **Login no Expo**:

   ```bash
   eas login
   ```

3. **Build no EAS** (demora ~10-15 min):

   ```bash
   # Para iOS
   eas build --platform ios --profile development

   # Para Android
   eas build --platform android --profile development
   ```

4. **Baixe e instale** o app gerado

5. **Rode o app**:
   ```bash
   npx expo start --dev-client
   ```

## 📋 Antes de Fazer o Build

### 1. Configure os Client IDs do Google

**No Google Cloud Console**:

1. Crie um projeto
2. Ative a Google Sign-In API
3. Crie OAuth 2.0 Credentials:

   **a) Web Client ID** (obrigatório):

   ```
   Tipo: Web application
   Nome: PillMind Web Client
   Authorized redirect URIs: (deixe vazio)
   ```

   → Copie o Client ID: `123456789-abc.apps.googleusercontent.com`

   **b) iOS Client ID** (obrigatório para iOS):

   ```
   Tipo: iOS
   Nome: PillMind iOS
   Bundle ID: com.pillmind.app
   ```

   → Copie o Client ID: `123456789-ios.apps.googleusercontent.com`

   **c) Android Client ID** (obrigatório para Android):

   ```
   Tipo: Android
   Nome: PillMind Android
   Package name: com.pillmind.app
   SHA-1: (obtenha com comando abaixo)
   ```

   Para obter SHA-1:

   ```bash
   # Debug keystore (desenvolvimento)
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

   # Copie a linha SHA1 e cole no Google Console
   ```

### 2. Atualize o .env

```env
# Web Client ID (obrigatório - usa no app)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=123456789-abc.apps.googleusercontent.com
```

### 3. Atualize o app.json

```json
{
  "expo": {
    "plugins": [
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.googleusercontent.apps.123456789-ios"
        }
      ]
    ],
    "ios": {
      "bundleIdentifier": "com.pillmind.app",
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "android": {
      "package": "com.pillmind.app",
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

Substitua `123456789-ios` pelo seu iOS Client ID (sem o `.apps.googleusercontent.com`)

### 4. Baixe os arquivos de configuração do Google

**iOS (GoogleService-Info.plist)**:

1. Google Cloud Console → Credentials
2. Baixe o arquivo `GoogleService-Info.plist`
3. Coloque na raiz do projeto: `./GoogleService-Info.plist`

**Android (google-services.json)**:

1. Google Cloud Console → Credentials
2. Baixe o arquivo `google-services.json`
3. Coloque na raiz do projeto: `./google-services.json`

## 🎯 Resumo do Fluxo

```
1. Configure Google Cloud Console (Web + iOS/Android Client IDs)
2. Atualize .env com Web Client ID
3. Atualize app.json com iOS URL Scheme
4. Baixe GoogleService-Info.plist e google-services.json
5. Build: eas build --platform ios --profile development
6. Aguarde build (~15 min)
7. Instale o app no device/simulator
8. Rode: npx expo start --dev-client
9. Teste o Google Sign-In! 🎉
```

## ❌ Por que Expo Go não funciona?

Expo Go é um app genérico que roda projetos Expo, mas **não inclui módulos nativos customizados** como Google Sign-In.

Você precisa criar um **Development Build** que é basicamente seu próprio app com todos os módulos nativos incluídos.

## 📚 Documentação

- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Google Sign-In for Expo](https://github.com/react-native-google-signin/google-signin)

## 🆘 Problemas Comuns

**"Development build not found"**:

- Certifique-se de que instalou o app gerado pelo EAS
- Rode `npx expo start --dev-client`

**"Invalid client ID"**:

- Verifique se o Web Client ID está correto no .env
- Reinicie o app após mudar o .env

**"Play Services not available" (Android)**:

- Certifique-se de que o emulador tem Google Play Services
- Use um emulador com Play Store

**SHA-1 mismatch (Android)**:

- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Google Sign-In for Expo](https://github.com/react-native-google-signin/google-signin)

## 🆘 Problemas Comuns

**"Development build not found"**:

- Certifique-se de que instalou o app gerado pelo EAS
- Rode `npx expo start --dev-client`

**"Invalid client ID"**:

- Verifique se o Web Client ID está correto no .env
- Reinicie o app após mudar o .env

**"Play Services not available" (Android)**:

- Certifique-se de que o emulador tem Google Play Services
- Use um emulador com Play Store

**SHA-1 mismatch (Android)**:

- Use o SHA-1 do keystore correto
- Debug: use debug keystore
- Produção: use release keystore
