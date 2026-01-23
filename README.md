# PillMind

Aplicativo de gerenciamento de medicamentos e lembretes desenvolvido com React Native e Expo.

## 🚀 Tecnologias

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **TypeScript** - Tipagem estática
- **React Navigation** - Navegação entre telas
- **Jest** - Framework de testes
- **ESLint** - Linter de código
- **Prettier** - Formatador de código
- **Node-RED** - Mock backend para autenticação (desenvolvimento)

## 📁 Estrutura do Projeto

O projeto utiliza uma arquitetura **Feature-Based com Clean Architecture**. Para mais detalhes, consulte a [documentação de arquitetura](./doc/ARCHITECTURE.md).

## ⚡ Quick Start

👉 **Novo no projeto?** Leia o [Guia de Startup](./STARTUP.md) para configuração inicial.

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm start

# Executar no Android
npm run android

# Executar no iOS
npm run ios
```

### ⚠️ Importante: Backend de Autenticação

Para que a autenticação funcione, você precisa apontar o app para o **pillmind-backend** (Java) e definir as variáveis de ambiente:

```bash
# URL base do backend (sem /api)
EXPO_PUBLIC_API_URL=http://localhost:8080

# Google OAuth Web Client ID
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_web_client_id.apps.googleusercontent.com
```

Se estiver usando o backend antigo via Node-RED (desenvolvimento), inicie em um terminal separado:

```bash
npm run nodered
# Node-RED estará disponível em http://localhost:1880
```

Veja [NODERED_SETUP.md](./doc/NODERED_SETUP.md) para mais detalhes.

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia o servidor Expo
npm start:clear        # Inicia com cache limpo
npm reset              # Reseta o cache completamente
npm run nodered        # Inicia o backend Node-RED (para autenticação)

# Build
npm run build:dev:android  # Build de desenvolvimento para Android
npm run build:dev:ios      # Build de desenvolvimento para iOS

# Qualidade de código
npm run lint           # Executa o ESLint
npm run lint:fix       # Corrige problemas do ESLint
npm run format         # Formata o código com Prettier
npm run format:check   # Verifica formatação

# Testes
npm test               # Executa os testes
npm run test:watch     # Executa testes em modo watch
npm run test:coverage  # Gera relatório de cobertura
```

## 🌿 Git Flow

Este projeto utiliza **Git Flow** para gerenciamento de branches. As branches principais são:

- `main` - Branch de produção
- `develop` - Branch de desenvolvimento

### Comandos Git Flow

#### Features

Criar uma nova feature:

```bash
git flow feature start nome-da-feature
```

Finalizar uma feature (merge em develop):

```bash
git flow feature finish nome-da-feature
```

#### Releases

Criar uma release:

```bash
git flow release start 1.0.0
```

Finalizar uma release (merge em main e develop):

```bash
git flow release finish 1.0.0
```

#### Hotfixes

Criar um hotfix (a partir de main):

```bash
git flow hotfix start nome-do-hotfix
```

Finalizar um hotfix (merge em main e develop):

```bash
git flow hotfix finish nome-do-hotfix
```

### Exemplo de Fluxo de Trabalho

1. Criar uma feature:

   ```bash
   git flow feature start adicionar-lembrete-medicamento
   # ... fazer as alterações ...
   git add .
   git commit -m "feat: adicionar funcionalidade de lembrete"
   git push origin feature/adicionar-lembrete-medicamento
   # Criar Pull Request no GitHub
   # Após merge, a feature será finalizada automaticamente pelo CI/CD
   ```

2. Criar uma release:
   ```bash
   git flow release start 1.0.0
   # ... ajustar versão, changelog, etc ...
   git flow release finish 1.0.0
   ```

## 🚀 CI/CD

O projeto utiliza **GitHub Actions** para automatizar o Git Flow e garantir qualidade de código.

### Workflows Automatizados

#### 1. Feature PR Validation

- **Trigger**: Quando um PR de feature é aberto ou atualizado
- **Ações**:
  - ✅ Valida formatação do código (Prettier)
  - ✅ Executa linter (ESLint)
  - ✅ Roda testes com cobertura
  - ✅ Valida nome da branch (deve começar com `feature/`)
  - ✅ Valida mensagens de commit (Conventional Commits)

#### 2. Auto Finish Feature

- **Trigger**: Quando um PR de feature é mergeado em `develop`
- **Ações**:
  - ✅ Limpa branch local da feature
  - ✅ Deleta branch remota da feature
  - ✅ Mantém histórico no GitHub

#### 3. Develop CI

- **Trigger**: Push ou PR para `develop`
- **Ações**:
  - ✅ Quality checks (format, lint, test)
  - ✅ Verificação de build TypeScript
  - ✅ Validação de configuração Expo

#### 4. Release

- **Trigger**: Push para `release/**` ou tag `v*`
- **Ações**:
  - ✅ Validação completa antes do release
  - ✅ Geração automática de changelog
  - ✅ Criação de GitHub Release

#### 5. EAS Update Preview

- **Trigger**: Quando um PR de feature é aberto ou atualizado
- **Ações**:
  - ✅ Publica preview de atualização EAS para o PR
  - ✅ Adiciona comentário no PR com QR code para teste
  - ✅ Permite testar mudanças sem build completo

#### 6. EAS Build

- **Trigger**:
  - Manual (workflow_dispatch)
  - Push para `develop` (build development)
  - Push para `main` ou tag (build production)
  - Push para `release/**` (build preview)
- **Ações**:
  - ✅ Build automático para Android/iOS
  - ✅ Perfis: development, preview, production

### Fluxo Completo com CI/CD

1. **Criar Feature**:

   ```bash
   git flow feature start minha-feature
   # ... desenvolver ...
   git push origin feature/minha-feature
   ```

2. **Criar Pull Request**:

   - Abra PR no GitHub de `feature/minha-feature` para `develop`
   - CI/CD valida automaticamente (lint, test, format)
   - EAS Update Preview é criado automaticamente para teste
   - Após aprovação e merge, a feature é finalizada automaticamente

3. **Release**:
   ```bash
   git flow release start 1.0.0
   # ... ajustes finais ...
   git flow release finish 1.0.0
   # CI/CD cria release automaticamente no GitHub
   ```

### Configuração Necessária

Para que o CI/CD funcione completamente, configure os seguintes secrets no GitHub:

- `EXPO_TOKEN`: Token do Expo para builds EAS (obtenha em: https://expo.dev/accounts/[seu-usuario]/settings/access-tokens)

### Benefícios

- ✅ **Automação**: Git Flow executado automaticamente
- ✅ **Qualidade**: Validações antes de cada merge
- ✅ **Rastreabilidade**: Histórico completo no GitHub
- ✅ **Builds Automáticos**: Builds EAS acionados automaticamente
- ✅ **Previews em PRs**: Teste de mudanças sem build completo
- ✅ **Consistência**: Padrões aplicados automaticamente
- ✅ **Boas Práticas**: Segue recomendações oficiais do Expo ([docs.expo.dev/eas-update/github-actions](https://docs.expo.dev/eas-update/github-actions/))

## 📚 Documentação

- [Arquitetura](./doc/ARCHITECTURE.md) - Documentação da arquitetura do projeto
- [Path Aliases](./doc/PATH_ALIASES.md) - Documentação sobre aliases de importação

## 🔧 Configuração

### Path Aliases

O projeto utiliza aliases para facilitar os imports:

- `@shared` - Componentes e utilitários compartilhados
- `@features` - Features do aplicativo
- `@core` - Configurações centrais
- `@src` - Raiz do diretório src

Exemplo:

```typescript
import { Button } from '@shared/components';
import { HomeScreen } from '@features/home/presentation/screens/HomeScreen';
```

## 📦 Build e Deploy

O projeto está configurado com **EAS (Expo Application Services)** para builds:

```bash
# Build de desenvolvimento para Android
npm run build:dev:android

# Build de desenvolvimento para iOS
npm run build:dev:ios
```

## 🤝 Contribuindo

1. Certifique-se de estar na branch `develop`
2. Crie uma feature usando Git Flow
3. Faça seus commits seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/)
4. Finalize a feature e faça push

## 📄 Licença

Este projeto é privado.
