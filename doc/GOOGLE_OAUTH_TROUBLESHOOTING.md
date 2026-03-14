# 🚨 Google OAuth Error Code 10 - Troubleshooting Completo

## Causa Raiz do Erro

O erro **Code 10 (DEVELOPER_ERROR)** ocorre quando:

```
❌ O SHA-1 do certificado de assinatura do app NÃO está registrado no Google Cloud Console
❌ O package name está incorreto no Google Cloud Console  
❌ O Android OAuth Client não foi criado
❌ As configurações ainda não propagaram (demora 5-10 min)
```

---

## 🔍 Diagnóstico Automático

Execute o script de verificação:

```bash
./scripts/check-google-oauth.sh
```

**Output esperado:**
```
✓ Android Package: com.pillmind.app
✓ App SHA-1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
✓ System SHA-1: 15:19:55:3D:EA:B3:6F:72:44:7B:77:2F:19:3E:50:B6:7B:D3:99:84
✓ Web Client ID configured correctly
```

---

## 🎯 Checklist de Verificação

### 1. Package Name Correto

**Verificar:**
```bash
grep -A 5 '"android"' app.json | grep package
```

**Deve retornar:**
```json
"package": "com.pillmind.app"
```

**Verificar no Google Cloud Console:**
- OAuth Client ID → Android → Package name deve ser: `com.pillmind.app`

---

### 2. SHA-1 Certificates

**Verificar ambos os keystores:**

```bash
# SHA-1 do app
keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android | grep SHA1:

# SHA-1 do sistema
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android | grep SHA1:
```

**Deve retornar:**
```
SHA1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
SHA1: 15:19:55:3D:EA:B3:6F:72:44:7B:77:2F:19:3E:50:B6:7B:D3:99:84
```

**Verificar no Google Cloud Console:**
- OAuth Client ID → Android → SHA-1 certificate fingerprints
- Deve ter AMBOS os SHA-1 listados acima

---

### 3. Web Client ID

**Verificar .env:**
```bash
cat .env | grep EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
```

**Deve retornar:**
```bash
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=1047433217870-qnv3981dqkvlfb07od11f80bh6jakbei.apps.googleusercontent.com
```

**Formato correto:**
- Deve terminar com `.apps.googleusercontent.com`
- É o **Web Client ID**, NÃO o Android Client ID

---

### 4. Serviço OAuth Configurado

**Verificar o código:**
```bash
cat src/shared/services/oauth.service.ts | grep -A 10 "GoogleSignin.configure"
```

**Deve usar:**
```typescript
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  // ...
});
```

---

## 🛠️ Soluções por Cenário

### Cenário 1: Android OAuth Client não existe

**Solução:**
1. Acesse: https://console.cloud.google.com/
2. Vá em: **APIs & Services** → **Credentials**
3. Clique: **+ CREATE CREDENTIALS** → **OAuth client ID**
4. Escolha: **Android**
5. Configure:
   - Package name: `com.pillmind.app`
   - SHA-1 #1: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
   - Clique **+ Add fingerprint**
   - SHA-1 #2: `15:19:55:3D:EA:B3:6F:72:44:7B:77:2F:19:3E:50:B6:7B:D3:99:84`
6. Clique **CREATE**

---

### Cenário 2: Android OAuth Client existe mas está errado

**Solução:**
1. Acesse o Google Cloud Console
2. Edite o Android OAuth Client existente
3. Verifique o package name: `com.pillmind.app`
4. Verifique os SHA-1 (devem ter AMBOS)
5. Salve e aguarde 5-10 minutos

---

### Cenário 3: SHA-1 diferente

**Se o script mostrar SHA-1 diferentes dos esperados:**

1. **Copie os SHA-1 que o script exibiu**
2. **Adicione-os no Google Cloud Console**
3. **Mantenha os antigos também** (Google permite múltiplos)

**Por quê?**
- Diferentes máquinas podem ter keystores diferentes
- EAS Build usa keystores diferentes
- Múltiplos SHA-1 garantem compatibilidade

---

### Cenário 4: Configuração correta mas ainda não funciona

**Possíveis causas:**

1. **Cache não limpo**
   ```bash
   cd android && ./gradlew clean && cd ..
   npm start -- --clear
   ```

2. **App não reconstruído**
   ```bash
   npx expo run:android
   ```

3. **Mudanças não propagaram (demora 5-10 min)**
   - Aguarde mais alguns minutos
   - Tente novamente

4. **App ainda em execução com código antigo**
   - Feche o app completamente
   - Limpe dados do app: Settings → Apps → PillMind → Clear Data
   - Abra novamente

---

## 🔄 Processo Completo de Reset

Se nada funcionar, faça um reset completo:

```bash
# 1. Parar todos os processos
killall node
killall java

# 2. Limpar tudo
cd android
./gradlew clean
cd ..
rm -rf node_modules
rm -rf android/build
rm -rf android/app/build
rm -rf .expo
rm -rf .metro

# 3. Reinstalar
npm install

# 4. Verificar configuração
./scripts/check-google-oauth.sh

# 5. Rebuild
npx expo run:android
```

---

## 🧪 Testar Manualmente no Google Cloud Console

### Verificar se o Android Client está ativo

1. Acesse: https://console.cloud.google.com/
2. Vá em: **APIs & Services** → **Credentials**
3. Localize o **Android OAuth Client**
4. Deve ter:
   - ✅ Status: **Ativo**
   - ✅ Application type: **Android**
   - ✅ Package name: `com.pillmind.app`
   - ✅ SHA-1 certificates: 2 fingerprints

### Verificar se a API está ativada

1. Vá em: **APIs & Services** → **Library**
2. Procure: **Google Sign-In API** ou **Google+ API**
3. Verifique se está **habilitada**

---

## 📊 Logs para Diagnóstico

### Ver logs detalhados durante o login

```bash
npx expo run:android
```

**Procure por:**
- `[OAuthService]` - Logs do serviço OAuth
- `[AuthContext]` - Logs do contexto de autenticação
- `DEVELOPER_ERROR` - Erro específico
- `Error Code 10` - Código do erro

### Exemplo de log com erro:
```
ERROR [OAuthService] Error Code 10 (DEVELOPER_ERROR): 
This usually means the app signing certificate SHA-1 does not match 
Google Cloud Console configuration.
```

### Exemplo de log com sucesso:
```
LOG [OAuthService] 🔐 Google Sign-In started
LOG [OAuthService] ✅ Google Sign-In successful
LOG [AuthContext] ✅ User authenticated
```

---

## 🎯 Validação Final

Após aplicar a solução, valide:

### 1. Verificar no script
```bash
./scripts/check-google-oauth.sh
```

Deve mostrar tudo com ✓ verde

### 2. Testar no app
1. Abra o app
2. Vá para tela de login
3. Clique em "Continuar com Google"
4. Deve abrir o seletor de conta do Google
5. Selecione uma conta
6. Deve fazer login com sucesso ✅

---

## 📞 Ainda com Problemas?

Se após seguir TODOS os passos ainda não funcionar:

1. **Tire screenshots do Google Cloud Console:**
   - Página de Credentials
   - Detalhes do Android OAuth Client
   - Detalhes do Web OAuth Client

2. **Capture os logs completos:**
   ```bash
   npx expo run:android 2>&1 | tee google-oauth-debug.log
   ```
   (Tente fazer login e copie o arquivo `google-oauth-debug.log`)

3. **Execute o script de verificação e salve output:**
   ```bash
   ./scripts/check-google-oauth.sh > oauth-config-check.log
   ```

4. **Verifique novamente:**
   - Package name no `app.json`
   - Package name no `android/app/build.gradle`
   - SHA-1 no Google Cloud Console
   - Web Client ID no `.env`

---

## 📚 Referências

- [React Native Google Sign-In Docs](https://react-native-google-signin.github.io/docs/install)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Troubleshooting Guide](https://react-native-google-signin.github.io/docs/troubleshooting)

---

## ✅ Success Stories

### Problema Comum #1: Package Name Errado
**Era:** `com.mayconaraujosantos.pillmind`  
**Correto:** `com.pillmind.app`  
**Solução:** Atualizado no Google Cloud Console

### Problema Comum #2: Apenas 1 SHA-1
**Era:** Somente SHA-1 do app  
**Correto:** AMBOS (app + sistema)  
**Solução:** Adicionado o segundo SHA-1

### Problema Comum #3: Android Client não criado
**Era:** Somente Web Client ID  
**Correto:** Web + Android Client IDs  
**Solução:** Criado Android OAuth Client

---

**Última atualização:** 2026-02-18
**Status:** ✅ Configuração verificada e documentada

