# 🧪 Dados de Teste - PillMind Sign Up & Sign In

## 📋 Resumo

Você tem **11 dados de teste prontos** para usar imediatamente nas telas de Sign Up e Sign In do app!

---

## ✅ Sign Up - 6 Usuários de Teste

| #   | Nome                 | Email                          | Senha           | Status      |
| --- | -------------------- | ------------------------------ | --------------- | ----------- |
| 1   | João Silva           | joao.silva@email.com           | senha123        | ✅ Básico   |
| 2   | Maria Santos         | maria.santos@gmail.com         | password456     | ✅ Comum    |
| 3   | Pedro Oliveira       | pedro.oliveira@hotmail.com     | MySecurePass789 | ✅ Forte    |
| 4   | Ana Pereira de Souza | ana.pereira.souza@yahoo.com.br | P@ssw0rd2024    | ✅ Longo    |
| 5   | Carlos               | carlos@test.com                | 123456789       | ✅ Simples  |
| 6   | Test User            | emulator@test.com              | emutest123      | ✅ Emulator |

---

## 🔐 Sign In - Teste com Qualquer Um Acima

Você pode fazer login com **qualquer email** dos usuários de Sign Up acima + **qualquer senha com 6+ caracteres**.

### Exemplos Rápidos:

```
Email: joao.silva@email.com
Senha: senha123
↓
✅ Success!
```

```
Email: maria.santos@gmail.com
Senha: password456
↓
✅ Success!
```

---

## ⚠️ Testes de Erro - Validar Comportamento

### SIGN UP

| Teste | Nome    | Email              | Senha  | Erro Esperado             |
| ----- | ------- | ------------------ | ------ | ------------------------- |
| 1     | Teste   | emailsemarroba.com | 123456 | `Invalid email format`    |
| 2     | (vazio) | teste@example.com  | 123456 | `All fields are required` |
| 3     | Teste   | teste@example      | 123456 | `Invalid email format`    |

### SIGN IN

| Teste | Email             | Senha  | Erro Esperado                     |
| ----- | ----------------- | ------ | --------------------------------- |
| 1     | teste@example.com | 12345  | `Invalid credentials` (< 6 chars) |
| 2     | emailinvalido     | 123456 | Validação local                   |

---

## 🚀 Guia Rápido de Teste

### Passo 1: Iniciar o App

```bash
npm start
```

### Passo 2: Teste Sign Up

1. Navegue até a tela de onboarding
2. Clique em "Create an account"
3. Copie dados de um dos usuários acima:
   - **Nome**: João Silva
   - **Email**: joao.silva@email.com
   - **Senha**: senha123
4. Clique em "Sign Up"
5. ✅ Veja o alert de sucesso!

### Passo 3: Teste Sign In

1. Volte à tela de onboarding
2. Clique em "Login"
3. Use o mesmo email/senha:
   - **Email**: joao.silva@email.com
   - **Senha**: senha123
4. Clique em "Sign In"
5. ✅ Veja o alert de sucesso!

### Passo 4: Teste Erros

1. Tente Sign Up com email inválido: `emailsemarroba.com`
2. ✅ Veja o error alert
3. Tente Sign In com senha muito curta: `12345`
4. ✅ Veja o error alert

---

## 📊 Cobertura de Testes

| Cenário                  | Dados          | Status   |
| ------------------------ | -------------- | -------- |
| ✅ Sign Up - Válido      | 6 usuários     | Completo |
| ✅ Sign In - Válido      | Infinitos\*    | Completo |
| ✅ Erro - Email inválido | 3 casos        | Completo |
| ✅ Erro - Senha curta    | 1 caso         | Completo |
| ✅ Erro - Campo faltando | 1 caso         | Completo |
| ✅ Loading state         | Automático     | Completo |
| ✅ Alerts                | Todos os casos | Completo |

\*Use qualquer email com qualquer senha 6+

---

## 💾 Arquivos com Dados

### 1. `test-data.json`

Todos os dados em formato JSON estruturado:

```json
{
  "signUp": [...],
  "signIn": [...],
  "errorCases": {...},
  "quickTest": {...}
}
```

### 2. `TEST_DATA.sh`

Script shell com dados formatados. Execute:

```bash
./TEST_DATA.sh
```

---

## 🎯 Checklist de Teste

- [ ] Teste Sign Up com usuário 1 (João Silva)
- [ ] Teste Sign In com o mesmo usuário
- [ ] Teste Sign Up com usuário 2 (Maria Santos)
- [ ] Teste Sign In com usuário 2
- [ ] Teste erro: email inválido no Sign Up
- [ ] Teste erro: senha curta no Sign In
- [ ] Teste erro: campo faltando no Sign Up
- [ ] Verifique loading spinner
- [ ] Verifique alerts de sucesso
- [ ] Verifique alerts de erro

---

## 📱 Configuração por Plataforma

### Web/Dev

```
npm start
Selecione 'w' para web ou 'i' para iOS/Android
```

### Android Emulator

Use dados específicos:

- **Email**: emulator@test.com
- **Senha**: emutest123

### Dispositivo Físico

Use qualquer email válido:

- **Email**: seuemail@example.com
- **Senha**: qualquersenha123

---

## 🔍 Monitorar Requisições

Abra o Node-RED em outro navegador:

```
http://127.0.0.1:1880/
```

Você verá as requisições passando pelos nós em tempo real!

---

## ✨ Resumo

| Item             | Quantidade | Status    |
| ---------------- | ---------- | --------- |
| Usuários Sign Up | 6          | ✅ Pronto |
| Casos Sign In    | 5+         | ✅ Pronto |
| Casos de Erro    | 5          | ✅ Pronto |
| Validações       | Todas      | ✅ Pronto |
| Node-RED         | Rodando    | ✅ Pronto |
| App              | Pronto     | ✅ Pronto |

**🚀 TUDO PRONTO PARA TESTAR!**

---

## 📞 Suporte

Se encontrar problemas:

1. ✅ Verifique se Node-RED está rodando
2. ✅ Verifique o `.env` está correto
3. ✅ Verifique se a API responde: `curl http://localhost:1880/api/auth/signup`
4. ✅ Reinicie o app: `npm start`

---

**Aproveite o teste! 🎉**
