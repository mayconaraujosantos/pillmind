# 🔄 Guia de Reset do AsyncStorage - Expo Go iOS

Este guia mostra como resetar o AsyncStorage no Expo Go (iOS) e no app nativo (Android).

## 📱 Métodos Disponíveis

### Método 1: DebugConsole (Mais Fácil) ✅

O app já tem um DebugConsole integrado:

1. **Abra o app no Expo Go**
2. **Procure o botão "Debug"** no topo da tela (canto superior)
3. **Toque no botão** para abrir o modal
4. **Toque no ícone de refresh (🔄)** no header do modal
5. **Pronto!** Todo o AsyncStorage será limpo

**O que é limpo:**

- ✅ Dados de autenticação (`@pillmind_auth`)
- ✅ Status de onboarding (`@pillmind:has_seen_onboarding`)
- ✅ Todos os outros dados do AsyncStorage

---

### Método 2: Botão na HomeScreen (Desenvolvimento)

Se `SHOW_DEBUG_CONTROLS` estiver ativo:

1. **Navegue para a HomeScreen**
2. **Role até o final** da tela
3. **Procure o card "🛠️ Debug Controls"**
4. **Toque em "🗑️ Clear All Storage"**
5. **Confirme** e o app será reiniciado

---

### Método 3: Via Terminal/Console (Desenvolvimento)

Execute no terminal do Expo:

```bash
# No terminal onde o Expo está rodando
# Pressione 'r' para reload
# Ou use o comando:
npx expo start --clear
```

**Nota:** Isso limpa o cache do Metro, mas não o AsyncStorage do dispositivo.

---

### Método 4: Desinstalar e Reinstalar o Expo Go (iOS)

**Para iOS (Expo Go):**

1. **Desinstale o app Expo Go** do seu iPhone
2. **Reinstale** da App Store
3. **Abra o projeto novamente**

**Limitações:**

- Isso limpa TUDO do Expo Go (todos os projetos)
- Você precisará escanear o QR code novamente

---

### Método 5: Limpar Dados do Expo Go (iOS)

**No iPhone:**

1. **Vá em Configurações** → **Geral** → **Armazenamento do iPhone**
2. **Procure por "Expo Go"**
3. **Toque em "Expo Go"**
4. **Toque em "Descarregar App"** ou **"Excluir App"**
5. **Reinstale** se necessário

---

### Método 6: Via Código (Programático)

Adicione este código temporariamente em qualquer tela:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Função para limpar tudo
const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
    Alert.alert('Success', 'Storage cleared!');
  } catch (error) {
    Alert.alert('Error', 'Failed to clear storage');
  }
};

// Chame quando necessário
clearAllStorage();
```

---

## 🔑 Chaves do AsyncStorage Usadas

O app usa estas chaves:

| Chave                           | Descrição                           |
| ------------------------------- | ----------------------------------- |
| `@pillmind_auth`                | Dados de autenticação (user, token) |
| `@pillmind:has_seen_onboarding` | Status se usuário viu onboarding    |

---

## 🎯 Recomendação

**Para desenvolvimento/testes:**

- Use o **DebugConsole** (Método 1) - mais rápido e fácil
- Ou o **botão na HomeScreen** (Método 2) se estiver visível

**Para reset completo:**

- Use o **Método 4** (desinstalar Expo Go) se quiser limpar tudo

---

## 📝 Notas Importantes

1. **Expo Go vs App Nativo:**

   - **Expo Go (iOS)**: Storage compartilhado entre todos os projetos
   - **App Nativo (Android)**: Storage isolado por app

2. **Limpar Storage não limpa:**

   - Cache do Metro Bundler
   - Cache de imagens
   - Dados do sistema operacional

3. **Após limpar:**
   - Usuário precisará fazer login novamente
   - Onboarding será mostrado novamente
   - Todas as preferências serão resetadas

---

## 🐛 Troubleshooting

**Problema:** Storage não está sendo limpo

**Soluções:**

1. Verifique se está usando `AsyncStorage.clear()` e não `removeItem()`
2. Feche e reabra o app após limpar
3. Use o Método 4 (desinstalar Expo Go) para reset completo

**Problema:** App não reinicia após limpar

**Soluções:**

1. Feche o app manualmente (swipe up no iOS)
2. Reabra o app
3. Ou use `npx expo start --clear` no terminal

---

## ✅ Verificação

Após limpar, você deve ver:

- ✅ Tela de onboarding aparecendo
- ✅ Nenhum usuário logado
- ✅ Todos os dados resetados

---

**Última atualização:** 2026-01-10
