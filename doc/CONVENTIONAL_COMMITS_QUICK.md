# Conventional Commits - Guia Rápido

## Como Usar

### Opção 1: Commitizen (Interativo) ⭐ Recomendado

```bash
npm run commit
```

Um wizard interativo vai te guiar:

```
? Select the type of change:
❯ feat:     A new feature
  fix:      A bug fix
  docs:     Documentation only changes
  style:    Changes that don't affect code meaning
  refactor: Code change that neither fixes bugs nor adds features
  ...

? What is the scope of this change?
❯ onboarding

? Write a short, imperative tense description:
❯ add email verification step

? Provide a longer description:
❯ Implement email verification in the onboarding flow

? Are there any breaking changes?
(y/n)
n

? Does this change affect any open issues?
(y/n)
y

? Add issue references (e.g. #123, #456):
❯ #123
```

✅ Commit criado automaticamente com formato correto!

---

### Opção 2: Commit Manual (Git)

```bash
git commit -m "feat(onboarding): add email verification step"
```

Se o formato estiver errado, o commitlint rejeitará:

```
❌ Error: type must be one of [feat, fix, docs, style, refactor, perf, test, chore, ci, build, revert]
```

---

## Exemplos de Commits

### ✅ Válidos

```bash
# Nova feature
git commit -m "feat(auth): add oauth2 integration"

# Correção de bug
git commit -m "fix(appointments): prevent duplicate bookings"

# Documentação
git commit -m "docs(readme): update installation steps"

# Refatoração
git commit -m "refactor(core): optimize state management"

# Testes
git commit -m "test(auth): add login unit tests"

# Com corpo
git commit -m "feat(payments): add stripe integration

Integrate Stripe payment gateway for premium features.
Users can now subscribe to monthly plans.

Closes #456"

# Breaking change
git commit -m "refactor(api): reorganize error handling

BREAKING CHANGE: errorHandler is now a singleton
Users must update imports from errorHandler to use new pattern"
```

### ❌ Inválidos

```bash
git commit -m "bugfix: fix login"  # ❌ tipo errado, deve ser 'fix'
git commit -m "Fixed the bug."     # ❌ sem tipo
git commit -m "FEAT: Add feature." # ❌ tipo em maiúscula
git commit -m "feat: added new feature." # ❌ passado, deve ser imperativo
```

---

## Tipos Disponíveis

| Tipo         | Uso                          |
| ------------ | ---------------------------- |
| **feat**     | Nova funcionalidade          |
| **fix**      | Correção de bug              |
| **docs**     | Documentação                 |
| **style**    | Formatação, lint, semicolons |
| **refactor** | Refatoração sem mudança      |
| **perf**     | Melhorias de performance     |
| **test**     | Testes e cobertura           |
| **chore**    | Deps, build, CI, scripts     |
| **ci**       | Alterações em GitHub Actions |
| **build**    | Alterações no build system   |
| **revert**   | Reverter commit anterior     |

---

## Escopos Comuns

```
onboarding    - Feature de onboarding
auth          - Autenticação e login
appointments  - Agendamentos
home          - Tela inicial
api           - Integração com API
i18n          - Internacionalização
storage       - AsyncStorage e dados locais
navigation    - Sistema de navegação
ui            - Componentes genéricos
theme         - Sistema de temas
```

---

## Workflow Git Típico

```bash
# 1. Criar branch
git checkout -b feat/email-verification

# 2. Fazer mudanças
code src/features/onboarding/

# 3. Adicionar arquivos
git add .

# 4. Criar commit interativo
npm run commit

# 5. Ver histórico
git log --oneline

# 6. Push
git push origin feat/email-verification

# 7. Pull Request no GitHub
# - Histórico limpo
# - Changelog automático
# - Release automático
```

---

## Dicas

💡 **Commits menores** → histórico mais limpo
💡 **Escopos específicos** → fácil de navegar
💡 **Mensagens claras** → manutenção futura

```bash
# ❌ Evite
git commit -m "feat(core): updated stuff"

# ✅ Prefira
git commit -m "feat(auth): add password strength validator"
```

---

## Ajuda

```bash
# Ver este guia
npm run commit:help

# Ver guia completo
cat doc/CONVENTIONAL_COMMITS.md

# Ver últimos commits
git log --oneline -10

# Desfazer último commit (mantém mudanças)
git reset --soft HEAD~1

# Reescrever último commit
git commit --amend -m "feat(scope): new message"
```

---

## Benefícios

✅ Histórico Git organizado e legível  
✅ Changelog automático  
✅ Versionamento automático (semver)  
✅ Melhor rastreabilidade de features e bugs  
✅ Integração com CI/CD  
✅ Histórico de mudanças por escopo

---

**Dúvida?** Verifique [CONVENTIONAL_COMMITS.md](CONVENTIONAL_COMMITS.md)
