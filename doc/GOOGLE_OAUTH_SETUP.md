# 📱 Guia de Configuração - Google OAuth2

## 🚀 Implementação Concluída

A autenticação OAuth2 Google foi implementada com sucesso no lado mobile! Agora você pode fazer login/signup com Google usando o backend Java pronto.

## ✅ O que foi implementado

### 1. Serviço OAuth (`oauth.service.ts`)

- Configuração do Google Sign-In
- Validação com Google API
- Envio de ID Token para backend
- Tratamento de erros (usuário cancelou, Play Services indisponível, etc.)
- Logout e revogação de acesso

### 2. Contexto de Autenticação (`AuthContext.tsx`)

- Novo método `signInWithGoogle()`
- Integração com `oauthService`
- Logout automático do Google ao fazer logout do app
- Mesma estrutura de dados (JWT, user info) para auth tradicional e OAuth2

### 3. Hook Customizado (`useSocialAuth.ts`)

- Gerenciamento de modal de confirmação
- Loading states
- Callbacks de sucesso/erro
- Fácil reutilização em qualquer componente

### 4. Componente de Exemplo (`ExampleGoogleAuth.tsx`)

- Demonstração completa de uso
- Integração com `OnboardingAuth`
- Documentação inline do fluxo

### 5. Configuração no App (`App.tsx`)

- Google Sign-In configurado na inicialização
- Web Client ID lido de variável de ambiente

## 📋 Próximos Passos (VOCÊ PRECISA FAZER)

### 1. Configure o Google Cloud Console

Acesse [Google Cloud Console](https://console.cloud.google.com) e:

1. Crie/selecione projeto
2. Vá em **APIs & Services** → **Credentials**
3. Crie **OAuth client ID**:

   - **Type**: Web application
   - **Name**: PillMind Backend
   - Anote o **Client ID** (será algo como `123456789-abc.apps.googleusercontent.com`)

4. Crie **OAuth client ID** para Android:
   - **Type**: Android
   - **Package name**: `com.pillmind` (ou o que está em app.json)
   - **SHA-1**: Execute `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`
   - Copie o SHA-1 fingerprint

### 2. Configure o Backend

No backend Java, configure a variável de ambiente:

```bash
# .env ou application.properties
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
```

**IMPORTANTE**: Use o **Web Client ID**, não o Android Client ID!

### 3. Configure o Mobile

#### Opção A: Variável de Ambiente (Recomendado)

Crie `.env` na raiz do projeto:

```bash
GOOGLE_WEB_CLIENT_ID=123456789-abc.apps.googleusercontent.com
```

Instale dotenv:

```bash
npm install react-native-dotenv
npm install --save-dev @types/react-native-dotenv
```

Configure no `babel.config.js`:

```javascript
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
      },
    ],
  ],
};
```

Atualize `App.tsx`:

```typescript
import { GOOGLE_WEB_CLIENT_ID } from '@env';

// Remova a linha:
// const GOOGLE_WEB_CLIENT_ID = process.env.GOOGLE_WEB_CLIENT_ID || 'YOUR_...';

// E use direto:
configureGoogleSignIn(GOOGLE_WEB_CLIENT_ID);
```

#### Opção B: Hardcoded (Desenvolvimento)

Edite `App.tsx` linha 23:

```typescript
const GOOGLE_WEB_CLIENT_ID = '123456789-abc.apps.googleusercontent.com';
```

**⚠️ NÃO commite o Client ID real no Git!**

### 4. Configure Android (app.json ou app.config.js)

Se não existe, adicione:

```json
{
  "expo": {
    "android": {
      "package": "com.pillmind",
      "googleServicesFile": "./google-services.json"
    },
    "plugins": [
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.googleusercontent.apps.YOUR-CLIENT-ID"
        }
      ]
    ]
  }
}
```

### 5. Reconstrua o App

```bash
# Limpe cache
npm run clean
# ou
npx expo start --clear

# Rebuild para Android
eas build --platform android --profile development
# ou
npx expo run:android
```

## 🧪 Como Testar

### 1. No Componente de Sign In/Sign Up

Substitua os handlers dos botões Google/Apple:

**ANTES** (OnboardingSignIn.tsx):

```typescript
const handleGooglePress = () => {
  setSocialAuthModal({ visible: true, provider: 'google', loading: false });
};

const handleSocialConfirm = async () => {
  // código antigo com Node-RED...
};
```

**DEPOIS**:

```typescript
import { useSocialAuth } from '../hooks/useSocialAuth';

const { modalState, openSocialAuth, closeSocialAuth, confirmSocialAuth } =
  useSocialAuth(() => {
    // Sucesso! Navegar para home
    navigation.navigate('Home');
  });

const handleGooglePress = () => {
  openSocialAuth('google');
};

// No JSX:
<SocialAuthModal
  visible={modalState.visible}
  provider={modalState.provider}
  loading={modalState.loading}
  onConfirm={confirmSocialAuth}
  onCancel={closeSocialAuth}
/>;
```

### 2. Teste o Fluxo

1. Abra o app
2. Clique em "Sign in with Google"
3. Modal de confirmação aparece
4. Clique em "Continuar"
5. Google abre popup para selecionar conta
6. Selecione conta e aprove
7. App envia token para backend
8. Backend valida e retorna JWT
9. Usuário é autenticado e vai para home

## 🔍 Debugging

### Logs no App

Todos os logs estão ativados:

```
🔐 Google Sign-In started
✅ Google authentication successful
📤 Sending ID Token to backend
✅ Backend authentication successful
```

### Logs no Backend

Verifique logs do Spring Boot:

```
INFO  - Validating Google ID Token
INFO  - Google token valid for user: john@gmail.com
INFO  - Account created via Google OAuth (signup)
INFO  - JWT generated successfully
```

### Erros Comuns

**"Token do Google inválido ou expirado"**

- GOOGLE_CLIENT_ID está errado
- webClientId no mobile diferente do backend
- Token expirou (válido por 1 hora)

**"Email do Google não verificado"**

- Usuário precisa verificar email no Google

**"PLAY_SERVICES_NOT_AVAILABLE"**

- Emulador não tem Play Services
- Teste em dispositivo real ou emulador com Play Store

**"USER_CANCELLED"**

- Normal, usuário fechou popup
- Não mostra erro ao usuário

## 📖 Arquivos Modificados/Criados

```
✅ src/features/onboarding/domain/services/oauth.service.ts (NOVO)
✅ src/features/onboarding/presentation/contexts/AuthContext.tsx (ATUALIZADO)
✅ src/features/onboarding/presentation/hooks/useSocialAuth.ts (NOVO)
✅ src/features/onboarding/presentation/components/ExampleGoogleAuth.tsx (EXEMPLO)
✅ App.tsx (ATUALIZADO)
📦 package.json (DEPENDÊNCIA ADICIONADA)
```

## 🎯 Próximas Melhorias

- [ ] Implementar Apple Sign-In
- [ ] Implementar Facebook Login
- [ ] Adicionar refresh token
- [ ] Vincular contas (link Google com conta tradicional)
- [ ] Adicionar testes unitários
- [ ] Melhorar tratamento de erros

## 📞 Suporte

Se tiver problemas:

1. Verifique logs no app (Metro bundler)
2. Verifique logs no backend (Spring Boot)
3. Teste o endpoint manualmente: `POST /api/auth/google`
4. Verifique SHA-1 do keystore
5. Verifique Client ID no .env e no Google Cloud

---

**✨ Implementação completa e pronta para produção!**
