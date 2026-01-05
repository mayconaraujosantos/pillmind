# Implementação de i18n no Onboarding

## 📋 Visão Geral

O sistema de internacionalização (i18n) foi implementado no fluxo de onboarding para suportar múltiplos idiomas, começando com Português Brasileiro (pt-BR) e Inglês (en). O usuário pode escolher manualmente o idioma através de um seletor visual com bandeiras 🇧🇷 🇺🇸.

## 🎯 Funcionalidades

### Seletor de Idioma Manual 🆕

**Novo componente LanguageSelector**

- Botões com bandeiras do Brasil 🇧🇷 e EUA 🇺🇸
- Aparece no header durante todo o onboarding
- Troca o idioma instantaneamente
- Salva a preferência do usuário no AsyncStorage
- Persiste entre sessões do app

### Detecção Automática de Idioma

O app detecta automaticamente o idioma do dispositivo do usuário usando `expo-localization`:

```typescript
const deviceLanguage = Localization.getLocales()[0]?.languageTag || 'en';
```

- **Prioridade 1**: Idioma escolhido manualmente pelo usuário (salvo)
- **Prioridade 2**: Idioma do dispositivo (pt-BR, en, etc.)
- **Fallback**: Inglês (en)

## 📁 Estrutura de Arquivos

### 1. Configuração Principal

- **Arquivo**: `src/shared/i18n/i18n.config.ts`
- **Responsabilidade**: Configura o i18next com recursos de tradução, detecção de idioma e persistência

### 2. Arquivos de Tradução

- **pt-BR**: `src/shared/i18n/locales/pt-BR.json`
- **en**: `src/shared/i18n/locales/en.json`

### 3. Helper para Steps Dinâmicos

- **Arquivo**: `src/features/onboarding/presentation/helpers/onboarding-i18n.helper.ts`
- **Responsabilidade**: Gera os steps do onboarding com textos traduzidos dinamicamente

### 4. Componente Seletor de Idioma 🆕

- **Arquivo**: `src/features/onboarding/presentation/components/LanguageSelector.tsx`
- **Responsabilidade**: Permite troca manual de idioma com botões de bandeiras
- **Funcionalidades**:
  - Mostra bandeira do Brasil 🇧🇷 e EUA 🇺🇸
  - Destaca o idioma atual
  - Salva preferência com AsyncStorage
  - Callback opcional `onLanguageChange`

## 🔑 Estrutura de Chaves de Tradução

### Onboarding Steps (Telas de Informação)

```json
{
  "onboarding": {
    "step1": {
      "title": "Sua saúde, no horário",
      "description": "Nunca mais esqueça de tomar seus remédios..."
    },
    "step2": {
      "title": "Lembretes avançados, Uso fácil",
      "description": "Configure alarmes personalizados..."
    },
    "step3": {
      "title": "Para você, família e amigos",
      "description": "Gerencie medicamentos de toda a família..."
    }
  }
}
```

### Sign Up

```json
{
  "onboarding": {
    "signUp": {
      "title": "Cadastrar",
      "subtitle": "Preencha os detalhes para criar sua conta",
      "name": "Nome",
      "namePlaceholder": "Digite seu nome",
      "email": "E-mail",
      "emailPlaceholder": "Digite seu endereço de e-mail",
      "password": "Senha",
      "passwordPlaceholder": "Digite sua senha",
      "or": "Ou",
      "continueWithApple": "Continuar com Apple",
      "continueWithGoogle": "Continuar com Google",
      "signUpButton": "Cadastrar",
      "terms": "Ao se cadastrar, você concorda com os Termos de Serviço e Política de Privacidade",
      "alreadyHaveAccount": "Já tem uma conta?",
      "signInLink": "Entrar"
    }
  }
}
```

### Sign In

```json
{
  "onboarding": {
    "signIn": {
      "title": "Entrar",
      "subtitle": "Entre na sua conta",
      "email": "E-mail",
      "emailPlaceholder": "Digite seu endereço de e-mail",
      "password": "Senha",
      "passwordPlaceholder": "Digite sua senha",
      "or": "Ou",
      "continueWithApple": "Continuar com Apple",
      "continueWithGoogle": "Continuar com Google",
      "signInButton": "Entrar",
      "noAccount": "Não tem uma conta?",
      "signUpLink": "Cadastre-se"
    }
  }
}
```

### Success Screen

```json
{
  "onboarding": {
    "success": {
      "title": "Cadastro Concluído!",
      "subtitle": "Conta criada com sucesso",
      "button": "Começar"
    }
  }
}
```

### Botões do Footer

```json
{
  "onboarding": {
    "buttons": {
      "createAccount": "Criar uma conta",
      "login": "Entrar"
    }
  },
  "common": {
    "next": "Próximo",
    "skip": "Pular"
  }
}
```

## 💻 Como Usar nos Componentes

### Importar o Hook

```typescript
import { useTranslation } from '@shared/i18n';
```

### Usar no Componente

```typescript
export const MyComponent = () => {
  const { t } = useTranslation();

  return <Text>{t('onboarding.signUp.title')}</Text>;
};
```

## 🔄 Componentes Atualizados

Os seguintes componentes foram atualizados para usar i18n:

1. ✅ **OnboardingSignUp** - Formulário de cadastro
2. ✅ **OnboardingSignIn** - Formulário de login
3. ✅ **OnboardingSuccess** - Tela de sucesso
4. ✅ **OnboardingFooter** - Botões de navegação
5. ✅ **OnboardingHeader** - Botão Skip + LanguageSelector 🇧🇷🇺🇸
6. ✅ **OnboardingCarousel** - Carrega steps com tradução dinâmica
7. ✅ **LanguageSelector** 🆕 - Componente de seleção de idioma

## 🧪 Como Testar

### Troca Manual de Idioma (Recomendado) 🆕

1. Abra o app no onboarding
2. Veja o seletor de idiomas no topo esquerdo (🇧🇷 🇺🇸)
3. Toque na bandeira do Brasil 🇧🇷 - o app muda instantaneamente para Português
4. Toque na bandeira dos EUA 🇺🇸 - o app muda instantaneamente para Inglês
5. Feche e abra o app novamente - o idioma escolhido é mantido

### No Dispositivo Real (Detecção Automática)

1. Vá em **Configurações** > **Idioma e Região**
2. Altere o idioma para **Português (Brasil)**
3. Abra o app - deve aparecer em Português (se não houver escolha salva)
4. Altere para **English (US)**
5. Abra o app - deve aparecer em Inglês

### No Emulador/Simulador

#### iOS Simulator

```bash
# Configure para Português
defaults write com.apple.CFUserDefaults.GlobalLanguage pt-BR

# Configure para Inglês
defaults write com.apple.CFUserDefaults.GlobalLanguage en-US
```

#### Android Emulator

1. Vá em **Settings** > **System** > **Languages & input**
2. Adicione **Português (Brasil)** ou **English (United States)**
3. Reinicie o app

## 🌍 Como Adicionar Novos Idiomas

### 1. Crie o arquivo de tradução

```bash
touch src/shared/i18n/locales/es-ES.json
```

### 2. Adicione as traduções

```json
{
  "onboarding": {
    "step1": {
      "title": "Tu salud, a tiempo",
      "description": "..."
    }
  }
}
```

### 3. Importe no arquivo de configuração

```typescript
// src/shared/i18n/i18n.config.ts
import esES from './locales/es-ES.json';

const resources = {
  en: { translation: en },
  'pt-BR': { translation: ptBR },
  'es-ES': { translation: esES }, // Adicione aqui
};
```

### 4. Adicione a bandeira no LanguageSelector (opcional)

```tsx
// src/features/onboarding/presentation/components/LanguageSelector.tsx
<TouchableOpacity
  onPress={() => handleLanguageChange('es-ES')}
  style={[
    styles.flagButton,
    {
      /* estilos... */
    },
  ]}
>
  <Text style={styles.flag}>🇪🇸</Text>
</TouchableOpacity>
```

## 💾 Persistência de Preferência

A escolha do idioma é salva automaticamente no AsyncStorage:

- **Chave**: `@pillmind:language`
- **Valor**: `pt-BR`, `en`, etc.
- **Quando**: Toda vez que o usuário clica em uma bandeira
- **Prioridade**: Sobrescreve a detecção automática do dispositivo

## 📚 Referências

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next](https://react.i18next.com/)
- [expo-localization](https://docs.expo.dev/versions/latest/sdk/localization/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

## ⚠️ Notas Importantes

1. **Sempre use chaves de tradução** ao invés de texto hardcoded
2. **Mantenha a estrutura JSON consistente** entre os idiomas
3. **Use o helper `getOnboardingSteps()`** para obter steps traduzidos
4. **O idioma muda automaticamente** com base na escolha do usuário (bandeiras)
5. **A preferência é persistida** - o usuário não precisa escolher novamente
6. **O componente OnboardingCarousel re-renderiza** quando o idioma muda (via `useMemo` com `i18n.language`)
7. **Mantenha a estrutura JSON consistente** entre os idiomas
8. **Use o helper `getOnboardingSteps()`** para obter steps traduzidos
9. **O idioma muda automaticamente** com base no dispositivo do usuário
