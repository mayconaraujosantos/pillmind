# Sistema de Logs e Tracking de Erros - PillMind

## 📋 Visão Geral

O sistema de logs foi implementado para rastrear bugs, crashes e comportamentos do usuário no app. Isso ajuda a:

- **Identificar crashes** antes que afetem os usuários
- **Rastrear navegação** entre telas
- **Monitorar performance** de operações
- **Debugar problemas** em produção
- **Entender padrões** de uso do app

## 🛠️ Componentes do Sistema

### 1. Logger (`@shared/utils/logger.ts`)
Sistema básico de logs com níveis:
- `DEBUG`: Informações de desenvolvimento
- `INFO`: Eventos importantes
- `WARN`: Situações de atenção
- `ERROR`: Erros que não quebram o app

### 2. Crash Reporter (`@shared/utils/crashReporter.ts`)
Sistema avançado que captura:
- **JavaScript errors** globais
- **Unhandled promise rejections**
- **Ações do usuário** (últimas 20)
- **Informações do dispositivo**
- **Estado da aplicação** no momento do crash

### 3. Navigation Logger (`@shared/hooks/useNavigationLogger.ts`)
Hook para tracking automático de navegação:
- Entrada e saída de telas
- Tempo gasto em cada tela
- Parâmetros de navegação
- Logs de eventos customizados

### 4. Error Boundary Melhorado (`@shared/components/ErrorBoundary.tsx`)
Component que captura erros React:
- **Stack trace** completo
- **Component stack** para debugar
- **Interface de recovery** para o usuário
- **Logs detalhados** do erro

## 📖 Como Usar

### 1. Em Qualquer Componente/Serviço

```typescript
import { logger } from '@shared/utils/logger';
import { crashReporter } from '@shared/utils/crashReporter';

// Logs básicos
logger.info('ComponentName', 'User logged in', { userId: '123' });
logger.warn('ComponentName', 'API response slow', { responseTime: 3000 });
logger.error('ComponentName', 'Failed to save data', {}, error);

// Crash reporting
crashReporter.recordUserAction('Button Pressed', { buttonId: 'save' });
crashReporter.reportCrash(error, 'Save Operation Failed', false);
```

### 2. Em Telas (Screen Components)

```typescript
import { useNavigationLogger } from '@shared/hooks';

export const MyScreen = () => {
  const { logScreenEvent, logError } = useNavigationLogger({
    screenName: 'MyScreen',
    additionalData: { version: '1.0' }
  });

  const handleButtonPress = () => {
    try {
      logScreenEvent('Button Pressed', { buttonId: 'save' });
      // ... fazer alguma operação
    } catch (error) {
      logError(error, 'Button Press Handler');
    }
  };
};
```

### 3. Em Componentes Comuns

```typescript
import { useComponentTracker } from '@shared/hooks';

export const MyComponent = () => {
  const { trackEvent, trackError } = useComponentTracker('MyComponent');

  useEffect(() => {
    trackEvent('data_loaded', { itemCount: data.length });
  }, [data]);

  const handleError = (error: Error) => {
    trackError(error, 'Data processing failed');
  };
};
```

### 4. Com HOC (Higher Order Component)

```typescript
import { withErrorTracking } from '@shared/hooks';

const MyComponent = () => {
  // Componente normal
  return <View>...</View>;
};

// Adiciona tracking automático
export default withErrorTracking(MyComponent, 'MyComponent');
```

## 🔍 Visualizando os Logs

### Durante Desenvolvimento
- **Console do Metro**: Todos os logs aparecem automaticamente
- **Flipper**: Se configurado, logs aparecem na aba de logs
- **React Native Debugger**: Suporte completo a logs

### Logs Estruturados
```javascript
// Exemplo de log estruturado no console:
[2026-03-25T16:57:15.470Z] [INFO] [HomeScreen] User searched medicines {
  "query": "aspirin",
  "totalMedicines": 5,
  "filteredCount": 1
}
```

### Crash Reports
```javascript
// Exemplo de crash report:
🚨 CRASH REPORT
Error: Failed to load medicines
Context: HomeScreen - API Call
Device Info: {"platform": "ios", "version": "18.3"}
Recent User Actions: [
  "2026-03-25T16:57:10.000Z: Navigation: Splash → Home",
  "2026-03-25T16:57:12.000Z: HomeScreen: screen_focus_sync",
  "2026-03-25T16:57:15.000Z: API GET /api/medicines - success: false"
]
```

## 📊 Exemplos de Tracking Implementados

### HomeScreen (Exemplo Completo)
- ✅ **Navegação**: Entrada/saída da tela
- ✅ **Ações do usuário**: Adicionar, editar, deletar medicamentos
- ✅ **Busca**: Filtros aplicados
- ✅ **Sync de dados**: Carregamento de medicamentos
- ✅ **Erros**: Falhas de API, navegação, etc.

### App-wide
- ✅ **Splash screen**: Tempo de carregamento
- ✅ **Onboarding**: Conclusão, pulos
- ✅ **Google Sign-in**: Configuração, falhas
- ✅ **Crashes globais**: JavaScript errors, promise rejections

## 🎯 Próximos Passos

### Para Debugar Crashes Atuais:
1. **Rode o app** com as mudanças aplicadas
2. **Reproduza o crash** (navegar entre telas)
3. **Verifique o console** para logs detalhados
4. **Analise o crash report** para entender a causa

### Para Adicionar em Outras Telas:
```typescript
// 1. Importe o hook
import { useNavigationLogger } from '@shared/hooks';

// 2. Configure no componente
const { logScreenEvent, logError } = useNavigationLogger({
  screenName: 'NomeDaTela'
});

// 3. Adicione logs em handlers
const handleAction = () => {
  try {
    logScreenEvent('Action Started');
    // ... ação
    logScreenEvent('Action Completed');
  } catch (error) {
    logError(error, 'Action Handler');
  }
};
```

## 🔧 Configurações Avançadas

### Aumentar Histórico de Ações
```typescript
// Em crashReporter.ts, linha 15:
private maxActionHistory = 50; // padrão: 20
```

### Filtrar Logs em Produção
```typescript
// Em logger.ts, personalizar por nível:
if (!__DEV__ && level === LogLevel.DEBUG) return;
```

### Integração com Serviços Externos
```typescript
// Em crashReporter.ts, método reportCrash:
// Adicionar integração com Sentry, Bugsnag, etc.
if (!__DEV__) {
  Sentry.captureException(error);
  Bugsnag.notify(error);
}
```

## 🎯 Benefícios Esperados

- **Debugging mais rápido**: Logs estruturados mostram exatamente onde o erro ocorreu
- **Melhor UX**: Error boundaries evitam que a app trave completamente  
- **Monitoramento proativo**: Identificar problemas antes que usuários reportem
- **Analytics de uso**: Entender como usuários interagem com o app
- **Releases mais estáveis**: Detectar regressions rapidamente