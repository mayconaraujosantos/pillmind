# 🛠️ Scripts de Utilidade do PillMind

Este diretório contém scripts úteis para desenvolvimento, testes e manutenção do projeto.

## 📋 Scripts Disponíveis

### 🔐 check-google-oauth.sh
Verifica a configuração do Google OAuth e fornece instruções para corrigir o erro Code 10.

**Uso:**
```bash
./scripts/check-google-oauth.sh
```

**O que verifica:**
- ✅ Package name do Android
- ✅ Bundle ID do iOS
- ✅ SHA-1 certificates (app e sistema)
- ✅ Variáveis de ambiente (.env)
- ✅ Formato do Web Client ID

**Quando usar:**
- Ao receber erro "Error Code 10 (DEVELOPER_ERROR)" no Google Sign-In
- Ao configurar OAuth pela primeira vez
- Após mudar certificados ou package names
- Para validar a configuração do Google Cloud Console

---

### 🧪 analyze-tests.sh
Analisa a cobertura de testes do projeto.

**Uso:**
```bash
./scripts/analyze-tests.sh
```

---

### 🧹 clean-all.sh
Limpa todos os caches e dependências do projeto.

**Uso:**
```bash
./scripts/clean-all.sh
```

**O que limpa:**
- node_modules
- Cache do Metro
- Cache do Gradle
- Cache do Expo
- Arquivos temporários

---

### 🏥 health-check.sh
Verifica a saúde geral do projeto e suas dependências.

**Uso:**
```bash
./scripts/health-check.sh
```

---

### 📊 sonar-summary.js
Gera um resumo das análises do SonarQube.

**Uso:**
```bash
node scripts/sonar-summary.js
```

---

### 🔧 fix-lefthook-hooks.js
Corrige problemas com hooks do Lefthook.

**Uso:**
```bash
node scripts/fix-lefthook-hooks.js
```

---

### 🧪 test-api.sh
Testa a API do backend.

**Uso:**
```bash
./scripts/test-api.sh
```

---

### 🔴 test-nodered.sh
Testa a integração com Node-RED.

**Uso:**
```bash
./scripts/test-nodered.sh
```

---

### 📝 TEST_DATA.sh
Gera dados de teste para desenvolvimento.

**Uso:**
```bash
./scripts/TEST_DATA.sh
```

---

## 🚀 Exemplos Comuns

### Corrigir erro de Google Sign-In
```bash
# 1. Verificar configuração atual
./scripts/check-google-oauth.sh

# 2. Seguir as instruções exibidas para configurar o Google Cloud Console

# 3. Limpar e reconstruir
./scripts/clean-all.sh
npx expo run:android
```

### Verificar saúde do projeto
```bash
./scripts/health-check.sh
```

### Limpar tudo e recomeçar
```bash
./scripts/clean-all.sh
npm install
npx expo run:android
```

---

## 📚 Documentação Relacionada

- [Google OAuth Setup](../doc/GOOGLE_OAUTH_SETUP.md)
- [Google OAuth Fix](../doc/GOOGLE_OAUTH_FIX.md)
- [Node-RED Setup](../doc/NODERED_SETUP.md)
- [Test Data Guide](../doc/TEST_DATA_GUIDE.md)

---

## 💡 Dicas

### Tornar scripts executáveis
Se um script não executar, você pode precisar dar permissão de execução:

```bash
chmod +x scripts/nome-do-script.sh
```

### Executar de qualquer lugar
Se quiser executar scripts de qualquer diretório dentro do projeto, use o caminho relativo:

```bash
# De dentro de src/
../scripts/check-google-oauth.sh

# De dentro de android/
../scripts/clean-all.sh
```

### Ver conteúdo de um script
```bash
cat scripts/nome-do-script.sh
```

---

## ⚠️ Notas Importantes

- **Sempre execute scripts da raiz do projeto** quando possível
- **Verifique os logs** após executar scripts de limpeza
- **Faça backup** antes de executar scripts que modificam arquivos
- **Leia o conteúdo** de um script antes de executá-lo pela primeira vez

---

## 🤝 Contribuindo

Ao adicionar novos scripts:

1. ✅ Adicione comentários explicativos no código
2. ✅ Documente o script neste README
3. ✅ Torne o script executável (`chmod +x`)
4. ✅ Teste em diferentes ambientes
5. ✅ Adicione tratamento de erros adequado

---

## 📞 Suporte

Se um script não funcionar como esperado:

1. Verifique se está na raiz do projeto
2. Verifique se tem permissão de execução
3. Leia os logs de erro com atenção
4. Consulte a documentação relacionada
5. Peça ajuda no canal de desenvolvimento

---

**Última atualização:** 2026-02-18

