# 📊 Sistema de Observabilidade - Guia de Uso

## Visão Geral

O sistema de observabilidade foi implementado para rastrear e monitorar completamente os fluxos de Sign Up e Sign In. Ele fornece logging estruturado, rastreamento de performance e métricas em tempo real.

## Componentes

### 1. Logger Utility (`src/shared/utils/logger.ts`)

Utilitário centralizado para logging estruturado com suporte a:

- **Níveis de Log**: DEBUG, INFO, WARN, ERROR
- **Rastreamento de Requisições**: Request ID para correlação
- **Timing**: Medição de duração de operações
- **Armazenamento**: Até 100 últimas entradas em memória

#### Uso:

```typescript
import { logger } from '@shared/utils/logger';

// Logging básico
logger.info('MyComponent', 'Usuário iniciou sign up');
logger.debug('SignUpForm', 'Validando email', { email: 'user@example.com' });
logger.warn('AuthService', 'Password muito curta');
logger.error('ApiService', 'Falha na requisição', { status: 500 });

// Rastreamento de tempo
const requestId = 'req-12345';
logger.startTimer(requestId);
// ... operação
const duration = logger.endTimer(requestId);

// Consultar logs
const allLogs = logger.getLogs();
const signUpLogs = logger.getLogsByComponent('OnboardingSignUp');
const errors = logger.getLogsByLevel(LogLevel.ERROR);
const requestLogs = logger.getLogsByRequestId(requestId);

// Estatísticas
const stats = logger.getLogStats();
// { total: 42, byLevel: { DEBUG: 8, INFO: 25, WARN: 6, ERROR: 3 }, byComponent: {...} }

// Exportar
const json = logger.exportLogs();
```

### 2. Debug Console (`src/shared/components/DebugConsole.tsx`)

Componente flutuante que exibe logs em tempo real com:

- 🐛 Botão flutuante com badge de contagem
- 📋 Visualização de todos os logs
- 🔍 Filtros por nível (DEBUG, INFO, WARN, ERROR)
- 📥 Exportar logs em JSON
- 🗑️ Limpar histórico

#### Localização:

O DebugConsole está disponível em todas as telas (adicionado ao App.tsx). Procure pelo botão 🐛 no canto inferior direito.

#### Funcionalidades:

- **Tap no FAB**: Abre o console de debug
- **Filtros**: Clique nos botões de filtro (DEBUG, INFO, WARN, ERROR, ALL)
- **Download**: Exporta todos os logs em JSON
- **Limpar**: Remove todos os logs do armazenamento
- **Real-time**: Atualiza a cada 500ms

### 3. Performance Monitor (`src/shared/components/PerformanceMonitor.tsx`)

Exibe métricas de performance:

- Duração média de requisições
- Duração máxima
- Total de requisições
- Taxa de erro

## Fluxo de Dados Rastreado

### Sign Up

```
┌─────────────────────────────────────────┐
│  User toca no botão "Sign Up"           │
└────────────────────┬────────────────────┘
                     ▼
┌─────────────────────────────────────────┐
│  OnboardingSignUp logs button press     │
│  - email: user@example.com              │
│  - campos validados                     │
└────────────────────┬────────────────────┘
                     ▼
┌─────────────────────────────────────────┐
│  useAuth.signUp() logs início           │
│  - email: user@example.com              │
└────────────────────┬────────────────────┘
                     ▼
┌─────────────────────────────────────────┐
│  AuthService.signUp() logs requisição   │
│  - email, password (hash)               │
└────────────────────┬────────────────────┘
                     ▼
┌─────────────────────────────────────────┐
│  ApiService logs request                │
│  - requestId: uuid                      │
│  - método: POST                         │
│  - endpoint: /auth/signup               │
│  - headers, body (sem senha)            │
└────────────────────┬────────────────────┘
                     ▼
┌─────────────────────────────────────────┐
│  Node-RED recebe requisição             │
│  (API Faker responde)                   │
└────────────────────┬────────────────────┘
                     ▼
┌─────────────────────────────────────────┐
│  ApiService logs resposta               │
│  - requestId: uuid (correlação)         │
│  - status: 201                          │
│  - duration: 245ms                      │
│  - userId: user-uuid                    │
└────────────────────┬────────────────────┘
                     ▼
┌─────────────────────────────────────────┐
│  AuthService logs sucesso               │
│  - email: user@example.com              │
│  - userId: user-uuid                    │
└────────────────────┬────────────────────┘
                     ▼
┌─────────────────────────────────────────┐
│  useAuth logs sucesso                   │
│  - userId: user-uuid                    │
│  - loading: false                       │
└────────────────────┬────────────────────┘
                     ▼
┌─────────────────────────────────────────┐
│  OnboardingSignUp logs sucesso          │
│  - userId: user-uuid                    │
│  - Alert: "Bem-vindo!"                  │
└─────────────────────────────────────────┘
```

## Cenários de Teste

### 1. Sign Up Bem-Sucedido

```bash
# Test data
Email: john@example.com
Password: Senha123!
Name: John Doe

# Verificar logs esperados
- DEBUG: "Validando campos de formulário"
- INFO: "Iniciando sign up com email john@example.com"
- DEBUG: "Enviando requisição POST /auth/signup"
- INFO: "Sign up bem-sucedido, userId: ..."
```

### 2. Validação de Email

```bash
# Test data
Email: invalid.email
Password: Senha123!

# Verificar logs esperados
- WARN: "Email inválido: invalid.email"
- DEBUG: "Botão desabilitado - validação falhou"
```

### 3. Validação de Senha

```bash
# Test data
Email: john@example.com
Password: 123

# Verificar logs esperados
- WARN: "Password deve ter no mínimo 8 caracteres"
- DEBUG: "Botão desabilitado - validação falhou"
```

### 4. Falha de Conexão

```bash
# Desligue a API Node-RED antes de testar

# Verificar logs esperados
- INFO: "Iniciando sign up..."
- ERROR: "Falha na requisição: Network timeout"
- WARN: "Erro ao fazer sign up"
- DEBUG: "Estado de erro exibido ao usuário"
```

### 5. Sign In

```bash
# Test data
Email: john@example.com
Password: Senha123!

# Verificar logs esperados
- INFO: "Iniciando sign in com email john@example.com"
- DEBUG: "Requisição POST /auth/signin"
- INFO: "Sign in bem-sucedido, userId: ..."
```

## Interpretando os Logs

### Formato de Timestamp

- `[2024-01-15T10:30:45.123Z]` - ISO 8601 timestamp
- Útil para correlacionar com logs do servidor

### Níveis de Log

| Nível | Cor      | Ícone                 | Uso                               |
| ----- | -------- | --------------------- | --------------------------------- |
| DEBUG | Cinza    | 🐛 bug                | Informações detalhadas (dev only) |
| INFO  | Verde    | ℹ️ information-circle | Eventos importantes               |
| WARN  | Laranja  | ⚠️ alert-circle       | Aviso (validação falhou, etc)     |
| ERROR | Vermelho | ❌ close-circle       | Erros e exceções                  |

### Componentes Rastreados

- `OnboardingSignUp` - Interações do formulário de sign up
- `OnboardingSignIn` - Interações do formulário de sign in
- `useAuth` - Hook de autenticação (lógica de negócio)
- `AuthService` - Serviço de autenticação (camada de domínio)
- `ApiService` - Serviço HTTP (requisições)

## Performance Baseline

Métricas esperadas (com Node-RED local):

| Métrica        | Esperado     | Limite   |
| -------------- | ------------ | -------- |
| Duração média  | 200-300ms    | < 500ms  |
| Duração máxima | < 500ms      | < 1000ms |
| Taxa de erro   | 0% (sucesso) | < 5%     |

## Troubleshooting

### Logs não aparecem no Debug Console

1. Verifique se o FORCE_SHOW_ONBOARDING está true em constants
2. Verifique se DebugConsole está adicionado ao App.tsx
3. Toque no botão 🐛 no canto inferior direito

### Requisições lentas (> 1000ms)

1. Verifique se Node-RED está rodando: `curl http://127.0.0.1:1880/`
2. Verifique a latência de rede
3. Verifique logs do Node-RED em http://127.0.0.1:1880

### Taxa de erro alta

1. Verifique os logs de ERROR no Debug Console
2. Procure pela mensagem de erro específica
3. Copie o requestId e correlacione com logs do servidor

### Exportar logs para análise

1. Abra o Debug Console
2. Toque em "📥" (Download)
3. Verificar console.log para o JSON exportado
4. Copiar e analisar no JSON viewer

## Arquivo de Dados de Teste

Veja `TEST_DATA.sh` para dados pré-configurados:

```bash
# Usuários para Sign Up (sucesso esperado)
john@example.com / Senha123!
jane@example.com / Senha456!
bob@example.com / Senha789!

# Casos de erro
invalid.email / Senha123! (email inválido)
test@example.com / 123 (password curta)
```

## Próximas Melhorias

- [ ] Persistência de logs em SQLite
- [ ] Dashboard de analytics
- [ ] Export para arquivo
- [ ] Integração com Sentry/DataDog
- [ ] Monitoria de memória
- [ ] Rate limiting análise

## Documentação Relacionada

- [Architecture](doc/ARCHITECTURE.md)
- [I18N System](doc/I18N_SYSTEM.md)
- [Theme System](doc/THEME_SYSTEM.md)
- [Path Aliases](doc/PATH_ALIASES.md)
