# SonarQube Setup Guide

Este projeto está configurado com SonarQube para análise contínua de qualidade de código.

## 🔧 Setup Local

### 1. Extensão VS Code (Recomendado)

- ✅ **SonarQube for IDE** já instalada
- ✅ **Connected Mode** já configurado para SonarCloud
- ✅ Project binding: `mayconaraujosantos_pillmind`

### 2. Como usar

#### Análise em tempo real:

- Abra qualquer arquivo `.ts/.tsx/.js/.jsx`
- Issues aparecem automaticamente no **Problems panel**
- Hover sobre sublinhados vermelhos/amarelos para detalhes

#### Análise manual:

```bash
# Ver relatório completo
npm run sonar:report

# Double-check antes do push (automático via lefthook)
npm run sonar:doublecheck
```

## 📊 Relatórios

### Local (VS Code):

- **Problems Panel**: Ctrl+Shift+M (Cmd+Shift+M no Mac)
- **Output Panel**: Extensão SonarQube for IDE

### Web (SonarCloud):

- **Dashboard**: https://sonarcloud.io/project/overview?id=mayconaraujosantos_pillmind
- **Pull Request**: https://sonarcloud.io/project/pull_requests?id=mayconaraujosantos_pillmind

## 🚀 Workflow

### Pre-push (Automático):

1. `git push` aciona lefthook
2. Double-check via SonarQube Extension
3. Links para relatórios são exibidos

### CI/CD (GitHub Actions):

1. Push/PR aciona workflow
2. Análise completa no SonarCloud
3. Resultados na página do PR

## 🔍 Issues Comuns

### Duplicated Lines:

- ✅ **Resolvido**: Refatoração de estilos compartilhados
- 📊 **Status**: 0% duplicação nos componentes

### Code Smells:

- Verificar no Problems Panel
- Seguir sugestões da extensão SonarQube

### Security Hotspots:

- Review manual necessário
- Detalhes no SonarCloud dashboard

## 💡 Tips

- **Real-time feedback**: Mantenha VS Code aberto para análise contínua
- **Problems Panel**: Principal fonte de feedback local
- **Quality Gate**: CI/CD bloqueia merges se falhar
- **Branch Analysis**: Cada feature branch é analisada separadamente
