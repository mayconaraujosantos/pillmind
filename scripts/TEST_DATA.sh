#!/bin/bash

# 🧪 Dados de Teste para Sign Up e Sign In
# Copie e cole estes dados nas telas do app

echo "=========================================="
echo "🧪 DADOS DE TESTE - PillMind App"
echo "=========================================="
echo ""

echo "📝 SIGN UP - Dados de Teste"
echo "=========================================="
echo ""

cat << 'EOF'
✅ TESTE 1: Usuário Válido
  Nome:     João Silva
  Email:    joao.silva@email.com
  Senha:    senha123

✅ TESTE 2: Outro Usuário
  Nome:     Maria Santos
  Email:    maria.santos@gmail.com
  Senha:    password456

✅ TESTE 3: Usuário Completo
  Nome:     Pedro Oliveira
  Email:    pedro.oliveira@hotmail.com
  Senha:    MySecurePass789

✅ TESTE 4: Com Caracteres Especiais
  Nome:     Ana Pereira de Souza
  Email:    ana.pereira.souza@yahoo.com.br
  Senha:    P@ssw0rd2024

✅ TESTE 5: Simples
  Nome:     Carlos
  Email:    carlos@test.com
  Senha:    123456789

EOF

echo ""
echo "🔐 SIGN IN - Dados de Teste"
echo "=========================================="
echo ""

cat << 'EOF'
Use qualquer um dos emails acima com qualquer senha com 6+ caracteres!

✅ TESTE 1: Com email de Sign Up anterior
  Email:    joao.silva@email.com
  Senha:    senha123

✅ TESTE 2: Outro email
  Email:    maria.santos@gmail.com
  Senha:    password456

✅ TESTE 3: Teste com senha longa
  Email:    pedro.oliveira@hotmail.com
  Senha:    MySecurePass789

✅ TESTE 4: Senha numérica (mínimo 6)
  Email:    teste@example.com
  Senha:    111111

✅ TESTE 5: Senha com espaços
  Email:    user@test.com
  Senha:    pass 123

EOF

echo ""
echo "⚠️  CASOS DE ERRO - Para Testar Validações"
echo "=========================================="
echo ""

cat << 'EOF'
SIGN UP - Erros Esperados:

❌ TESTE 1: Email Inválido
  Nome:     Teste
  Email:    emailsemarroba.com  (sem @)
  Senha:    123456
  Erro esperado: Invalid email format

❌ TESTE 2: Senha Muito Curta (Sign In)
  Email:    teste@example.com
  Senha:    12345  (menos de 6 caracteres)
  Erro esperado: Invalid credentials

❌ TESTE 3: Campo Faltando
  Nome:     (deixar em branco)
  Email:    teste@example.com
  Senha:    123456
  Erro esperado: All fields are required

EOF

echo ""
echo "💡 DICAS DE TESTE"
echo "=========================================="
echo ""

cat << 'EOF'
1. Teste o Sign Up primeiro com dados válidos
2. Depois teste o Sign In com o mesmo email/senha
3. Teste as validações com dados inválidos
4. Observe o loading spinner quando clicar no botão
5. Verifique os alerts de sucesso/erro
6. No Node-RED (http://127.0.0.1:1880/), você pode ver as requisições em tempo real

7. Para Android Emulator, use:
   Email: emulator@test.com
   Senha: emutest123

8. Para dispositivo físico, use qualquer email@domain.com e senha com 6+

EOF

echo ""
echo "📊 RESUMO DOS DADOS"
echo "=========================================="

cat << 'EOF'

SIGN UP requer:
  • Nome (qualquer texto)
  • Email (formato válido: xxx@xxx.xxx)
  • Senha (qualquer tamanho)

SIGN IN requer:
  • Email (formato válido: xxx@xxx.xxx)
  • Senha (mínimo 6 caracteres)

Todos os dados são enviados para o Node-RED!

EOF

echo ""
echo "🚀 Começar a testar agora!"
echo ""
