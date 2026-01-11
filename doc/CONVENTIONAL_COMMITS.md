# Conventional Commits

Este projeto segue o padrão **Conventional Commits** para manter um histórico de commits limpo, organizado e automatizado.

## Formato

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Exemplo

```
feat(onboarding): add email verification step

Implement email verification in the onboarding flow.
Users now receive a verification code and must confirm
their email before proceeding to the next step.

Closes #123
```

## Tipos de Commit

| Tipo         | Descrição                                | Impacto         |
| ------------ | ---------------------------------------- | --------------- |
| **feat**     | Nova funcionalidade                      | Minor version ↑ |
| **fix**      | Correção de bug                          | Patch version ↑ |
| **docs**     | Documentação apenas                      | Sem versão      |
| **style**    | Formatação, semicolons, etc.             | Sem versão      |
| **refactor** | Refatoração sem mudança de comportamento | Sem versão      |
| **perf**     | Melhorias de performance                 | Patch version ↑ |
| **test**     | Testes apenas                            | Sem versão      |
| **chore**    | Dependências, build, CI/CD               | Sem versão      |
| **ci**       | Alterações em CI/CD                      | Sem versão      |
| **build**    | Alterações no build system               | Sem versão      |
| **revert**   | Reverter commit anterior                 | Patch version ↑ |

## Escopo (Scope)

O escopo deve indicar qual parte da aplicação foi afetada:

**Exemplos:**

- `onboarding` - Feature de onboarding
- `auth` - Autenticação
- `appointments` - Agendamentos
- `home` - Tela inicial
- `api` - Integração com API
- `i18n` - Internacionalização
- `storage` - Armazenamento local
- `navigation` - Sistema de navegação
- `ui` - Componentes UI genéricos

## Subject (Assunto)

- Máximo 50 caracteres
- Começar com letra minúscula
- NÃO terminar com ponto (.)
- Imperativo: "add" em vez de "added" ou "adds"
- Descrever O QUÊ foi feito

### Bons exemplos:

```
feat(auth): add oauth2 integration
fix(appointments): prevent duplicate bookings
docs(readme): update installation steps
```

### Maus exemplos:

```
✗ feat(auth): Added OAuth2 integration.  (maiúscula, ponto, passado)
✗ fix(appts): Fixes duplicate bookings  (scope inválido)
✗ chore: Updated deps  (sem scope, vago)
```

## Body (Corpo)

- **Opcional** para commits simples
- **Obrigatório** para commits complexos
- Explicar POR QUÊ e COMO foi feito
- Quebrar em múltiplas linhas se necessário
- Deixar uma linha em branco entre subject e body

## Footer (Rodapé)

- **Opcional**
- Referenciar issues: `Closes #123`, `Fixes #456`
- Breaking changes: `BREAKING CHANGE: description`

### Exemplo com breaking change:

```
refactor(api): reorganize error handling

Rewrite error handling to use new ErrorHandler class.

BREAKING CHANGE: errorHandler is now a singleton
```

## Validação Automática

Seus commits são validados automaticamente por:

1. **commitlint** - Valida formato no `commit-msg` hook
2. **lefthook** - Executa testes e linting antes de push

### Se um commit for rejeitado:

```bash
# ❌ Erro: "type must be one of [feat, fix, docs, ...]"
git commit -m "bugfix: fix login issue"

# ✅ Correto:
git commit -m "fix(auth): fix login issue"
```

## VS Code Integration

Para melhor experiência no VS Code:

### Opção 1: Commitizen (Interativo)

```bash
npm install -g commitizen cz-conventional-changelog
cz commit
```

Será aberto um wizard interativo para criar commits.

### Opção 2: Extensão VS Code

Instale a extensão **Conventional Commits** para autocomplete:

- **Extensão**: `vivaxy.vscode-conventional-commits`
- Atalho: `Ctrl+Shift+K` ou `Cmd+Shift+K`

## Workflow Típico

```bash
# 1. Fazer mudanças
code src/features/auth/LoginScreen.tsx

# 2. Verificar status
git status

# 3. Adicionar arquivos
git add src/features/auth/LoginScreen.tsx

# 4. Criar commit com formato correto
git commit -m "feat(auth): add remember me option"

# 5. Push será validado automaticamente
git push origin feature/remember-me
```

## CI/CD Integration

O Conventional Commits permite:

- ✅ **Automatic versioning** (semver)
- ✅ **Automatic changelog generation**
- ✅ **Better git history navigation**
- ✅ **Automated release notes**

## Dúvidas Frequentes

**P: E se eu já fiz um commit errado?**

```bash
git commit --amend -m "feat(scope): correct message"
git push --force-with-lease
```

**P: Como desfazer o último commit?**

```bash
git reset --soft HEAD~1  # Desfaz, mantém mudanças
git reset --hard HEAD~1  # Desfaz tudo
```

**P: Qual scope usar se afeta vários locais?**
Crie múltiplos commits menores ou use scope genérico:

```bash
git commit -m "refactor(core): optimize state management"
```

## Recursos

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitizen](http://commitizen.github.io/cz-cli/)
- [commitlint](https://commitlint.js.org/)
- [Semantic Versioning](https://semver.org/)
