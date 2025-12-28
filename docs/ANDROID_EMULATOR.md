# Troubleshooting Android Emulator com Expo

## Problema: Reload não funciona no terminal

Quando o emulador Android (especialmente `Medium_Phone_API_36.1`) não responde aos comandos de reload do terminal, siga estas soluções:

## Soluções

### 1. Verificar conexão ADB

```bash
# Verificar se o emulador está conectado
npm run adb:devices

# Se não aparecer nenhum dispositivo, reinicie o ADB
npm run adb:kill

# Depois verifique novamente
npm run adb:devices
```

### 2. Iniciar Expo com flag Android

```bash
# Inicia o Expo especificamente para Android (força a conexão)
npm run start:android
```

### 3. Reload direto no Emulador

Quando o reload do terminal não funciona, use o menu de desenvolvedor do emulador:

**No Emulador Android:**

- Pressione `Ctrl + M` (Windows/Linux) ou `Cmd + M` (Mac)
- Ou agite o dispositivo virtual (botão de menu de hardware)
- Selecione **"Reload"** no menu que aparecer

### 4. Reiniciar tudo

Se nada funcionar, reinicie completamente:

```bash
# 1. Parar o Expo (Ctrl+C no terminal)

# 2. Matar o processo na porta 8081 (se necessário)
netstat -ano | findstr :8081
taskkill //F //PID <PID>

# 3. Reiniciar ADB
npm run adb:kill

# 4. Reiniciar o Expo
npm run start:android
```

### 5. Verificar se o app está rodando

Se o app não abriu automaticamente no emulador:

1. Certifique-se que o emulador está totalmente inicializado (não apenas na tela de boot)
2. No terminal do Expo, pressione `a` para abrir no Android
3. Ou escaneie o QR code se estiver usando Expo Go

### 6. Usar Development Build (Recomendado)

Se estiver usando `expo-dev-client`, certifique-se que o build de desenvolvimento está instalado no emulador:

```bash
# Build e instalação automática
npm run android
```

Isso vai:

- Compilar o app
- Instalar no emulador
- Iniciar o Expo dev server

### 7. Alternativas de Reload

- **Menu de desenvolvedor**: `Ctrl + M` → "Reload"
- **Shake gesture**: No emulador, clique no botão de menu de hardware (três pontos)
- **Hot reload automático**: O Expo faz hot reload quando você salva arquivos (se habilitado)

## Scripts Úteis

```bash
# Ver dispositivos conectados
npm run adb:devices

# Reiniciar ADB server
npm run adb:kill

# Iniciar Expo para Android
npm run start:android
```

## Troubleshooting Adicional

### Emulador não aparece no `adb devices`

1. Certifique-se que o emulador está totalmente iniciado
2. Execute `adb kill-server && adb start-server`
3. Verifique se o Android SDK Platform Tools está no PATH

### Expo não detecta o emulador

1. Use `expo start --android` em vez de apenas `expo start`
2. Verifique se há apenas um emulador rodando (vários podem causar conflito)
3. Feche outros emuladores e tente novamente

### Reload continua não funcionando

1. Use o menu de desenvolvedor no emulador (`Ctrl + M` → "Reload")
2. Feche o app completamente e reabra
3. Reinstale o app no emulador: `npm run android`
