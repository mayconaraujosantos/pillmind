# 🔍 Guia de Depuração - Tela Branca no iOS Expo Go

## Problema Identificado

A tela branca no iOS Expo Go pode ter múltiplas causas. Implementamos as seguintes correções:

## ✅ Correções Aplicadas

### 1. **ErrorBoundary Adicionado**

- Criado `ErrorBoundary.tsx` para capturar erros de renderização
- Wraps toda a aplicação para evitar crashes silenciosos
- Mostra tela de erro amigável ao usuário

### 2. **Tratamento de Erros no AuthContext**

- Melhorado parsing de dados do AsyncStorage
- Tratamento específico para JSON corrompido
- Limpeza automática de dados inválidos no storage

### 3. **Logs Melhorados**

- Adicionados logs no carregamento de fontes
- Logs em cada etapa do ciclo de vida do app

## 🐛 Como Debugar no iOS

### Passo 1: Limpar Cache do Expo

```bash
# Limpar cache completamente
npm run start:clear

# Ou manualmente
rm -rf node_modules/.cache
npx expo start --clear
```

### Passo 2: Limpar AsyncStorage Corrompido

Abra o App no Expo Go e execute no DevTools (shake device > Debug Remote JS):

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
AsyncStorage.clear();
```

### Passo 3: Verificar Logs no Metro Bundler

Quando abrir o QR Code, observe a saída do terminal:

- ✅ `[INFO] [App] Application started` - App iniciando
- ✅ `📱 Device Info` - Informações do dispositivo
- ✅ `[INFO] [AuthContext] 🔄 Restoring session` - Restaurando sessão
- ❌ Qualquer `[ERROR]` indica problema

### Passo 4: Ativar Modo Debug no Expo Go

1. Abra o app no iOS
2. Shake o device (⌘+D no simulador)
3. Tap em "Debug Remote JS"
4. Abra Chrome DevTools (http://localhost:19000/debugger-ui)
5. Verifique Console tab para erros JavaScript

### Passo 5: Verificar React DevTools

```bash
npm install -g react-devtools
react-devtools
```

- Conecta automaticamente quando o app abre
- Veja a árvore de componentes renderizados
- Se a árvore estiver vazia = erro de renderização

## 🔧 Troubleshooting Específico

### Tela Branca Persistente

#### Causa 1: Fontes não carregadas

**Sintoma**: Log `"Waiting for fonts to load..."` não aparece
**Solução**:

```bash
npx expo install expo-font
npx expo start --clear
```

#### Causa 2: Módulo nativo incompatível

**Sintoma**: Erro no Metro sobre módulos nativos
**Solução**:

```bash
# iOS Simulator
cd ios && pod install && cd ..
npx expo run:ios
```

#### Causa 3: Erro no i18n

**Sintoma**: Log de erro relacionado a tradução
**Solução**: Verificar se todos os arquivos de tradução existem

```bash
ls -la src/shared/i18n/locales/
```

#### Causa 4: Dimensões inválidas

**Sintoma**: Erro em `dimensions.ts` ou `SCREEN_HEIGHT`
**Solução**: Verificar se `Dimensions.get('window')` retorna valores válidos

### Verificar se App Está Renderizando Algo

Adicione temporariamente em `App.tsx` logo após imports:

```typescript
console.log('🚀 App.tsx carregado');

export default function App() {
  console.log('🎬 App function executando');
  // ... resto do código
}
```

Se não aparecer no console = problema no bundler/metro.

## 📱 Comandos Úteis

```bash
# Reiniciar completamente
pkill -f "expo" && rm -rf node_modules/.cache && npm run start:clear

# Verificar se portas estão livres
lsof -i :19000
lsof -i :19001

# Reinstalar dependências iOS
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..

# Logs do iOS Simulator
xcrun simctl spawn booted log stream --level debug

# Ver logs filtrados do Expo
npx expo start 2>&1 | grep -E "(ERROR|WARN|App|AuthContext)"
```

## 🎯 Checklist de Depuração

- [ ] Cache do Expo limpo
- [ ] AsyncStorage limpo no device
- [ ] Logs do Metro Bundle sem erros
- [ ] Chrome DevTools conectado e sem erros
- [ ] React DevTools mostrando árvore de componentes
- [ ] Fontes carregadas com sucesso
- [ ] `FORCE_SHOW_ONBOARDING` configurado corretamente
- [ ] Sem erros TypeScript (`npm run typecheck`)
- [ ] Testes passando (`npm test`)

## 📊 Monitoramento em Produção

Para debugar em produção, adicione Sentry ou similar:

```bash
npx expo install @sentry/react-native
```

## 🔗 Links Úteis

- [Expo Go Debugging](https://docs.expo.dev/debugging/runtime-issues/)
- [React Native Debugging](https://reactnative.dev/docs/debugging)
- [AsyncStorage Debugging](https://react-native-async-storage.github.io/async-storage/docs/advanced/debugging/)
