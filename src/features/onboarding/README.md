# 🚀 Onboarding Feature

> Sistema profissional de onboarding para o app PillMind

## 📋 Visão Geral

O sistema de onboarding é responsável por guiar novos usuários através da introdução ao app e processo de autenticação. Implementado seguindo Clean Architecture e boas práticas de desenvolvimento React Native.

## 🏗️ Arquitetura

```
src/features/onboarding/
├── domain/                     # Regras de negócio
│   ├── models/                 # Modelos de dados
│   └── services/               # Serviços (API, OAuth)
├── presentation/               # UI e lógica de apresentação
│   ├── components/             # Componentes reutilizáveis
│   ├── contexts/               # Context API
│   ├── hooks/                  # Custom hooks
│   ├── screens/                # Telas principais
│   ├── constants/              # Constantes centralizadas
│   └── utils/                  # Utilitários
├── __tests__/                  # Dados de teste
└── types.ts                    # Tipos centralizados
```

## 🎯 Funcionalidades

### ✨ Carousel Introdutório

- 3 telas informativas sobre o app
- Navegação por swipe ou botões
- Progresso visual com indicadores
- Botão "Pular" (disponível nos 2 primeiros steps)

### 🔐 Autenticação

- **Registro**: Email, nome e senha
- **Login**: Email e senha
- **OAuth**: Google e Apple Sign-In
- Validação em tempo real
- Feedback visual de loading

### 🎨 Design System

- Tema claro/escuro automático
- Responsividade completa (phone/tablet/landscape)
- Componentes acessíveis (Screen Reader)
- Animações suaves

## 🔧 Componentes Principais

### 📱 Telas

- **OnboardingContainer**: Orquestrador principal
- **OnboardingView**: Gerencia carousel + header + footer

### 🧩 Componentes

- **OnboardingCarousel**: Carousel com swipe
- **OnboardingHeader**: Header com botão pular
- **OnboardingAuth**: Formulários de auth
- **OnboardingPrimaryButton/SecondaryButton**: Botões padronizados
- **LanguageSelector**: Seletor de idioma (🇧🇷/🇺🇸)

### 🪝 Hooks

- **useAuth()**: Autenticação local (email/password)
- **useSocialAuth()**: OAuth (Google/Apple)
- **useOnboardingStorage()**: Persistência do status
- **usePostLoginPreparation()**: Loading pós-login
- **useOnboardingScroll()**: Detecção de scroll

### 🏪 Contexts

- **AuthContext**: Estado global de autenticação

## 🛠️ Como Usar

### Inicializar Onboarding

```typescript
import { OnboardingContainer } from '@features/onboarding';

// No App.tsx
const shouldShowOnboarding = !hasSeenOnboarding && !isAuthenticated;

return shouldShowOnboarding ? <OnboardingContainer /> : <MainApp />;
```

### Usar Hook de Autenticação

```typescript
import { useAuth } from '@features/onboarding/presentation/hooks';

const MyComponent = () => {
  const { signUp, signIn, loading, error } = useAuth();

  const handleSignUp = async () => {
    const result = await signUp({
      name: 'João Silva',
      email: 'joao@email.com',
      password: 'MinhaSenh@123',
    });

    if (result.success) {
      // Sucesso
    } else {
      console.error(result.error);
    }
  };
};
```

### Personalizar Temas

```typescript
import { getOnboardingColors } from '@features/onboarding/presentation/constants';
import { useColorScheme } from 'react-native';

const colors = getOnboardingColors(useColorScheme());
```

## ⚙️ Configuração

### Storage Keys

Todas as chaves estão centralizadas em `constants/storage.constants.ts`:

```typescript
import { STORAGE_KEYS } from '@features/onboarding/presentation/constants';

// ✅ Usar constantes
AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_SEEN);

// ❌ Não usar strings hard-coded
AsyncStorage.getItem('@pillmind:has_seen_onboarding');
```

### Validação

Utilizar funções de validação centralizadas:

```typescript
import {
  validateEmail,
  validateSignUpForm,
} from '@features/onboarding/presentation/utils';

const { isValid, error } = validateEmail(email);
const formValidation = validateSignUpForm({ email, password, name });
```

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes do onboarding
npm test -- src/features/onboarding

# Testes específicos
npm test -- useAuth.test.ts
npm test -- OnboardingAuth.test.tsx
```

### Dados de Teste

Usar constantes de teste em vez de dados hard-coded:

```typescript
import {
  TEST_DATA,
  TEST_SCENARIOS,
} from '@features/onboarding/__tests__/test-constants';

// ✅ Dados seguros e consistentes
auth.signUp(TEST_DATA);
auth.signIn(TEST_SCENARIOS.EXISTING_USER);

// ❌ Dados hard-coded
auth.signUp({ email: 'test@test.com', password: 'password123' });
```

## 📊 Estado e Fluxos

### Estados do Onboarding

```typescript
type OnboardingPhase = 'carousel' | 'auth' | 'postLoginLoading' | 'success';
```

### Fluxo de Navegação

```
📱 Carousel (steps 0,1,2)
   ↓ (usuário pula ou termina)
🔐 Autenticação
   ↓ (login bem-sucedido)
⏳ Post-login Loading
   ↓ (preparação completa)
✅ Success (navega para app principal)
```

## 🔒 Segurança

### Boas Práticas Implementadas

- ✅ Tokens armazenados com AsyncStorage
- ✅ Validação client-side e server-side
- ✅ Timeout em requisições (30s)
- ✅ Retry automático para erros de rede
- ✅ Logs estruturados para auditoria
- ⚠️ **TODO**: Implementar refresh token
- ⚠️ **TODO**: Keychain/Keystore para tokens sensíveis

## 🌐 Internacionalização

O onboarding suporta múltiplos idiomas:

- 🇧🇷 Português (padrão)
- 🇺🇸 English

Arquivos de tradução em `src/core/i18n/locales/`.

## 📱 Responsividade

Suporta todos os tamanhos de dispositivo:

- 📱 **Phone**: Layout otimizado para telas pequenas
- 📱 **Tablet**: Aproveita espaço extra com padding
- 📱 **Landscape**: Ajustes para orientação paisagem

## 🐛 Debug e Troubleshooting

### Logs Úteis

```typescript
import { logger } from '@shared/utils/logger';

// Logs estão categorizados por componente
logger.debug('OnboardingAuth', 'User attempting signup', { email });
logger.info('useAuth', 'Sign up successful', { userId: result.user.id });
logger.error('AuthContext', 'Token validation failed', { error });
```

### Reset Para Desenvolvimento

```typescript
import { useOnboardingStorage } from '@features/onboarding/presentation/hooks';

const { resetOnboarding } = useOnboardingStorage();
await resetOnboarding(); // Remove flag de "já viu onboarding"
```

### Storage Inspector

```bash
# Para debugar AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

const allKeys = await AsyncStorage.getAllKeys();
const allData = await AsyncStorage.multiGet(allKeys);
console.log('📱 AsyncStorage:', allData);
```

## 🚀 Próximos Passos

### Melhorias Planejadas

- [ ] **Biometria**: Touch ID / Face ID
- [ ] **Social**: Cadastro com Facebook, GitHub
- [ ] **Tutorial Interativo**: Guided tour no primeiro acesso
- [ ] **A/B Testing**: Diferentes variações de fluxo
- [ ] **Analytics**: Tracking de conversão e funnel

---

## 👥 Contributors

Para contribuir com melhorias:

1. **Leia**: [`CONTRIBUTING.md`](CONTRIBUTING.md)
2. **Teste**: Execute testes antes de commit
3. **Documente**: Atualize README se necessário
4. **Profile**: Use instruções de performance

---

> 📚 **Links Úteis**:
>
> - [Documentação Técnica Detalhada](../../doc/I18N_ONBOARDING_IMPLEMENTATION.md)
> - [Fluxos de Autenticação](../../doc/AUTHENTICATION_FLOW_DIAGRAMS.md)
> - [Melhorias de UX](../../doc/ONBOARDING_UX_IMPROVEMENTS.md)
