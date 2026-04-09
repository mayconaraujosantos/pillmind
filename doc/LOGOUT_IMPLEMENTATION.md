# 🚪 Logout Implementation Guide

## Overview

O sistema de logout foi implementado de forma robusta com rastreamento completo, persistência de sessão e contexto global de autenticação.

## Arquitetura

### 1. AuthService (`src/features/onboarding/domain/services/auth.service.ts`)

Método `logout()` simples que registra o evento:

```typescript
logout(): void {
  logger.info('AuthService', '🚪 Logout initiated');
  // Aqui você pode limpar dados de sessão, tokens, etc.
  logger.info('AuthService', '✅ Logout successful');
}
```

### 2. useAuth Hook (`src/features/onboarding/presentation/hooks/useAuth.ts`)

Hook com estado de loading e error:

```typescript
const logout = () => {
  logger.info('useAuth', '🚪 Logout hook called');
  setLoading(true);
  setError(null);

  try {
    authService.logout();
    logger.info('useAuth', '✅ Logout hook completed successfully');
    return { success: true };
  } catch (err) {
    // ...erro handling
  } finally {
    setLoading(false);
  }
};
```

### 3. AuthContext (`src/features/onboarding/presentation/contexts/AuthContext.tsx`)

Contexto global que gerencia:

- **User State**: dados do usuário logado
- **Token**: token de autenticação
- **Persistence**: salva/restaura sessão em AsyncStorage
- **Login/Logout**: métodos para autenticar e desautenticar

```typescript
export interface AuthContextType {
  user: AuthResponse['user'] | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (authData: AuthResponse) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}
```

### 4. HomeScreen UI

Componente que exibe:

- Card com informações do usuário (nome e email)
- Botão "Logout" em vermelho com ícone
- Dialog de confirmação antes de logout
- Loading state durante operação

## Fluxo de Logout Completo

```
┌─────────────────────────────────────┐
│  User toca no botão "Logout"        │
└────────────────┬────────────────────┘
                 ▼
┌─────────────────────────────────────┐
│  HomeScreen logs button press       │
│  - LOG: "Logout button pressed"     │
└────────────────┬────────────────────┘
                 ▼
┌─────────────────────────────────────┐
│  Alert.alert() pede confirmação     │
│  - User clica "Logout"              │
└────────────────┬────────────────────┘
                 ▼
┌─────────────────────────────────────┐
│  useAuth.logout() chamado           │
│  - LOG: "Logout hook called"        │
│  - setLoading(true)                 │
└────────────────┬────────────────────┘
                 ▼
┌─────────────────────────────────────┐
│  AuthService.logout()               │
│  - LOG: "Logout initiated"          │
│  - LOG: "Logout successful"         │
└────────────────┬────────────────────┘
                 ▼
┌─────────────────────────────────────┐
│  AuthContext.logout()               │
│  - setUser(null)                    │
│  - setToken(null)                   │
│  - AsyncStorage.removeItem()        │
│  - LOG: "Logout successful"         │
└────────────────┬────────────────────┘
                 ▼
┌─────────────────────────────────────┐
│  HomeScreen exibe sucesso           │
│  - Alert: "You have been logged out"│
│  - Component desmontado/remontado   │
└─────────────────────────────────────┘
```

## Observabilidade

Todos os passos do logout são rastreados com logs estruturados:

| Nível | Component   | Mensagem              | Data      |
| ----- | ----------- | --------------------- | --------- |
| INFO  | HomeScreen  | Logout button pressed | timestamp |
| INFO  | HomeScreen  | Initiating logout     | timestamp |
| INFO  | useAuth     | Logout hook called    | timestamp |
| DEBUG | AuthService | Logout initiated      | timestamp |
| INFO  | AuthService | Logout successful     | timestamp |
| INFO  | AuthContext | Logout called         | timestamp |
| INFO  | AuthContext | Logout successful     | timestamp |

### Exemplos de Logs

```
[2026-01-05T14:30:45.123Z] [INFO] [HomeScreen] 📤 Logout button pressed
[2026-01-05T14:30:46.456Z] [INFO] [HomeScreen] 🚪 Initiating logout
[2026-01-05T14:30:46.457Z] [INFO] [useAuth] 🚪 Logout hook called
[2026-01-05T14:30:46.458Z] [DEBUG] [AuthService] 🚪 Logout initiated
[2026-01-05T14:30:46.459Z] [INFO] [AuthService] ✅ Logout successful
[2026-01-05T14:30:46.460Z] [INFO] [AuthContext] 🚪 Logout called
[2026-01-05T14:30:46.461Z] [INFO] [AuthContext] ✅ Logout successful
```

## Persistência de Sessão

### Login

Ao fazer Sign Up/Sign In, a sessão é persistida:

```typescript
// Em OnboardingSignUp.tsx e OnboardingSignIn.tsx
const result = await signUp({ name, email, password });
if (result.success && result.data) {
  await authContext.login(result.data); // Salva em AsyncStorage
}
```

### Restauração

Ao iniciar o app, a sessão é restaurada automaticamente:

```typescript
// Em AuthContext.tsx - useEffect
useEffect(() => {
  restoreSession();
}, []);

// Restaura dados do AsyncStorage
const restoreSession = async () => {
  const authData = await AsyncStorage.getItem('@pillmind_auth');
  if (authData) {
    const parsedData = JSON.parse(authData);
    setUser(parsedData.user);
    setToken(parsedData.token);
  }
};
```

### Logout

Ao fazer logout, os dados são removidos:

```typescript
const logout = async () => {
  setUser(null);
  setToken(null);
  await AsyncStorage.removeItem('@pillmind_auth');
};
```

## Testing Guide

### Cenário 1: Login → Home → Logout

1. Complete onboarding
2. Use credenciais: `joao.silva@email.com` / `senha123`
3. Veja o card com suas informações
4. Clique "Logout"
5. Confirme no alert
6. Deve voltar à tela de onboarding (sem sessão salva)

### Cenário 2: Login → Kill App → Restart

1. Login com `joao.silva@email.com` / `senha123`
2. Pressione `Ctrl+C` no terminal npm
3. Execute `npm start` novamente
4. O app deve abrir direto na HomeScreen (sessão restaurada)

### Cenário 3: Login → Logout → Restart

1. Login
2. Clique logout
3. Confirme
4. Restart o app
5. Deve abrir na tela de onboarding (nenhuma sessão)

## Debug Console Integration

Você pode monitorar todos os eventos de logout no Debug Console:

1. Clique no botão 🐛 no canto inferior direito
2. Filtre por "HomeScreen", "AuthContext", ou "useAuth"
3. Veja em tempo real todos os logs de logout

## Próximas Melhorias

- [ ] Token refresh/expiration
- [ ] Logout em todos os devices
- [ ] Session timeout após inatividade
- [ ] Encrypted token storage
- [ ] Biometric re-authentication
- [ ] Analytics para logout tracking

## Documentação Relacionada

- [Observability Guide](OBSERVABILITY_GUIDE.md)
- [Architecture](ARCHITECTURE.md)
- [Theme System](THEME_SYSTEM.md)
