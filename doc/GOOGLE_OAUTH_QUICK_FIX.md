# 🔥 FIX RÁPIDO - Google OAuth Error Code 10

## O Problema
```
❌ Error Code 10 (DEVELOPER_ERROR)
❌ SHA-1 certificate mismatch
```

## ✅ A Solução (5 Minutos)

### 1️⃣ Google Cloud Console
🔗 **Acesse:** https://console.cloud.google.com/

### 2️⃣ Vá para Credentials
📍 **APIs & Services** → **Credentials**

### 3️⃣ Android OAuth Client

**Se NÃO existe:**
- Clique: **+ CREATE CREDENTIALS** → **OAuth client ID** → **Android**

**Se JÁ existe:**
- Clique para editar

### 4️⃣ Configure com estes valores EXATOS:

```
📦 Package name:
com.pillmind.app

🔑 SHA-1 Certificate #1:
5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25

🔑 SHA-1 Certificate #2: (clique + Add fingerprint)
15:19:55:3D:EA:B3:6F:72:44:7B:77:2F:19:3E:50:B6:7B:D3:99:84
```

### 5️⃣ Salvar
💾 Clique **CREATE** ou **SAVE**

### 6️⃣ Aguardar
⏰ Aguarde **5-10 minutos** para propagar

### 7️⃣ Limpar e Rebuild
```bash
cd android && ./gradlew clean && cd ..
npm start -- --clear
npx expo run:android
```

---

## ✅ Verificar se Funcionou

Execute:
```bash
./scripts/check-google-oauth.sh
```

Deve mostrar tudo ✓ verde.

---

## 📚 Documentação Completa

- 📖 [GOOGLE_OAUTH_FIX.md](./GOOGLE_OAUTH_FIX.md) - Guia completo
- 🔧 [GOOGLE_OAUTH_TROUBLESHOOTING.md](./GOOGLE_OAUTH_TROUBLESHOOTING.md) - Troubleshooting
- 📋 [README.md](./README.md) - Índice de toda documentação

---

## 🆘 Ainda com Problemas?

1. Verifique se adicionou **AMBOS** os SHA-1
2. Confirme que o package é **com.pillmind.app**
3. Aguardou 5-10 minutos?
4. Limpou o cache?
5. Reconstruiu o app?

Se sim para tudo, veja: [GOOGLE_OAUTH_TROUBLESHOOTING.md](./GOOGLE_OAUTH_TROUBLESHOOTING.md)

---

**🎉 Pronto! O login com Google vai funcionar agora.**

