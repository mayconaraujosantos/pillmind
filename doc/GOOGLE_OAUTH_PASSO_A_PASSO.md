# 🎯 Google OAuth - Passo a Passo VISUAL

## ✅ SIM, você deve COPIAR e COLAR os SHA-1!

---

## 📋 PREPARAÇÃO: Copie estes valores

### 1. Package Name (copie):
```
com.pillmind.app
```

### 2. SHA-1 Certificate #1 (copie):
```
5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
```

### 3. SHA-1 Certificate #2 (copie):
```
15:19:55:3D:EA:B3:6F:72:44:7B:77:2F:19:3E:50:B6:7B:D3:99:84
```

---

## 🚀 PASSO A PASSO

### PASSO 1: Acessar Google Cloud Console

🔗 **Abra seu navegador e acesse:**
```
https://console.cloud.google.com/
```

### PASSO 2: Selecionar o Projeto

1. No topo da página, clique no **seletor de projetos**
2. Selecione o projeto do **PillMind**

### PASSO 3: Ir para Credentials

1. No menu lateral esquerdo, procure por: **APIs & Services**
2. Clique em: **Credentials** (Credenciais)

### PASSO 4: Verificar se existe Android OAuth Client

**Olhe na lista de "OAuth 2.0 Client IDs"**

#### Se NÃO EXISTE um do tipo "Android":

1. Clique no botão: **+ CREATE CREDENTIALS** (topo da página)
2. Selecione: **OAuth client ID**
3. Uma tela vai abrir perguntando "Application type"
4. Selecione: **Android**
5. Pule para o **PASSO 5** ⬇️

#### Se JÁ EXISTE um do tipo "Android":

1. Clique no **nome** do Android OAuth Client para editá-lo
2. Pule para o **PASSO 5** ⬇️

### PASSO 5: Preencher os Campos

Agora você vai ver um formulário. Preencha assim:

#### Campo: "Name" (Nome)
```
PillMind Android (Debug)
```
Você pode digitar qualquer nome descritivo.

#### Campo: "Package name"
**✅ COPIE e COLE este valor:**
```
com.pillmind.app
```

⚠️ **ATENÇÃO:** Cole EXATAMENTE como está, sem espaços extras!

#### Campo: "SHA-1 certificate fingerprint"

**IMPORTANTE:** Você precisa adicionar **DOIS** SHA-1!

**SHA-1 #1:**
1. No campo "SHA-1 certificate fingerprint"
2. **✅ COPIE e COLE este valor:**
```
5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
```

**SHA-1 #2:**
1. Clique no botão **"+ Add fingerprint"** (Adicionar fingerprint)
2. Um novo campo vai aparecer
3. **✅ COPIE e COLE este valor:**
```
15:19:55:3D:EA:B3:6F:72:44:7B:77:2F:19:3E:50:B6:7B:D3:99:84
```

### PASSO 6: Salvar

1. Clique no botão **"CREATE"** (se está criando novo)
   OU
2. Clique no botão **"SAVE"** (se está editando)

### PASSO 7: Aguardar Propagação

⏰ **IMPORTANTE:** As mudanças levam **5 a 10 minutos** para propagar nos servidores do Google.

**Enquanto isso, NÃO faça nada no app. Aguarde.**

### PASSO 8: Limpar Cache do Projeto

Após esperar 5-10 minutos, no terminal do seu projeto execute:

```bash
cd android
./gradlew clean
cd ..
```

E depois:

```bash
npm start -- --clear
```

### PASSO 9: Reconstruir o App

```bash
npx expo run:android
```

### PASSO 10: Testar

1. Abra o app no dispositivo/emulador
2. Vá para a tela de login
3. Clique em **"Continuar com Google"**
4. Selecione sua conta Google
5. ✅ **Deve funcionar!**

---

## 🎯 Resumo Visual

```
┌─────────────────────────────────────────────────┐
│  Google Cloud Console                            │
├─────────────────────────────────────────────────┤
│                                                  │
│  📝 Name: PillMind Android (Debug)              │
│                                                  │
│  📦 Package name:                                │
│  ┌─────────────────────────────────────────┐    │
│  │ com.pillmind.app                        │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│  🔑 SHA-1 certificate fingerprint #1:           │
│  ┌─────────────────────────────────────────┐    │
│  │ 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:... │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│  [+ Add fingerprint]  ← CLIQUE AQUI             │
│                                                  │
│  🔑 SHA-1 certificate fingerprint #2:           │
│  ┌─────────────────────────────────────────┐    │
│  │ 15:19:55:3D:EA:B3:6F:72:44:7B:77:2F:... │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│  [CREATE] ou [SAVE]  ← CLIQUE AQUI              │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## ❓ Perguntas Frequentes

### 1. Posso digitar o SHA-1 manualmente?
**NÃO recomendado!** É muito fácil errar um caractere. **Sempre COPIE e COLE.**

### 2. Precisa adicionar os dois SHA-1?
**SIM!** Ambos são necessários. Se adicionar apenas um, pode não funcionar.

### 3. O que acontece se eu colar com espaços extras?
O Google Cloud Console geralmente remove espaços automaticamente, mas é melhor colar corretamente.

### 4. Posso usar qualquer nome no campo "Name"?
Sim, o nome é apenas para você identificar. Use algo descritivo como "PillMind Android (Debug)".

### 5. Tenho que esperar mesmo 5-10 minutos?
Sim. Se testar antes, ainda vai dar erro Code 10 porque as mudanças não propagaram.

### 6. Como sei se está funcionando?
Quando você tentar fazer login com Google e não der mais o erro "Code 10".

---

## 🔍 Verificar se Copiou Certo

Após colar no Google Cloud Console, compare:

### Package Name
```
Deve estar: com.pillmind.app
```
✅ Sem espaços
✅ Tudo minúsculo
✅ Pontos no lugar certo

### SHA-1 #1
```
Deve começar com: 5E:8F:16:...
Deve terminar com: ...:F6:25
Total: 59 caracteres (com os dois-pontos)
```

### SHA-1 #2
```
Deve começar com: 15:19:55:...
Deve terminar com: ...:99:84
Total: 59 caracteres (com os dois-pontos)
```

---

## 🎬 Fluxo Completo Simplificado

```
1. 📋 Copiar valores desta página
       ↓
2. 🌐 Abrir Google Cloud Console
       ↓
3. 🔑 Ir para Credentials
       ↓
4. ➕ Criar/Editar Android OAuth Client
       ↓
5. 📝 Colar Package Name
       ↓
6. 🔑 Colar SHA-1 #1
       ↓
7. ➕ Adicionar SHA-1 #2
       ↓
8. 🔑 Colar SHA-1 #2
       ↓
9. 💾 Salvar
       ↓
10. ⏰ Aguardar 5-10 min
       ↓
11. 🧹 Limpar cache
       ↓
12. 🔨 Rebuild app
       ↓
13. ✅ Testar login
```

---

## 🎯 Checklist de Conferência

Antes de salvar no Google Cloud Console, confira:

- [ ] ✅ Package name: `com.pillmind.app`
- [ ] ✅ SHA-1 #1 começa com `5E:8F:16:`
- [ ] ✅ SHA-1 #1 termina com `:F6:25`
- [ ] ✅ SHA-1 #2 começa com `15:19:55:`
- [ ] ✅ SHA-1 #2 termina com `:99:84`
- [ ] ✅ Tem DOIS SHA-1 (não apenas um)
- [ ] ✅ Cliquei em SAVE/CREATE

Depois de salvar:

- [ ] ⏰ Aguardei 5-10 minutos
- [ ] 🧹 Limpei o cache: `cd android && ./gradlew clean && cd ..`
- [ ] 🧹 Limpei o Metro: `npm start -- --clear`
- [ ] 🔨 Reconstruí: `npx expo run:android`
- [ ] ✅ Testei o login

---

## 💡 Dica Extra

Se você tem dificuldade para copiar deste arquivo, pode usar o script:

```bash
./scripts/check-google-oauth.sh
```

Ele vai exibir os mesmos valores no terminal, e você pode copiar diretamente de lá!

---

## 🆘 Se Ainda Não Funcionar

Se após seguir TODOS os passos ainda não funcionar:

1. Verifique se realmente adicionou **DOIS** SHA-1
2. Confirme que o package name está **exatamente** como `com.pillmind.app`
3. Aguarde mais 5 minutos (às vezes demora mais)
4. Limpe o cache novamente
5. Reconstrua o app do zero
6. Consulte: `doc/GOOGLE_OAUTH_TROUBLESHOOTING.md`

---

**🎉 Sucesso! Agora você sabe exatamente o que fazer.**

**Última atualização:** 2025-02-18

