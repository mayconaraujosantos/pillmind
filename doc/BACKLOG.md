# Backlog do Produto - Remedi (App de Lembretes de Medicamentos)

## Visão do Produto

Criar um aplicativo simples e fácil de usar para que os usuários não esqueçam seus horários de medicação, possam encontrar farmácias e clínicas próximas e sejam auxiliados por entes queridos, se necessário.

---

## Épico 1: Configuração Inicial e Autenticação

**Prioridade:** Alta (Base para todas as outras funcionalidades)

### US-01: Tela de Onboarding

**Como** um novo usuário  
**Quero** ver uma tela de onboarding simples e atrativa  
**Para** entender rapidamente os principais benefícios do app antes de me cadastrar

**Critérios de Aceitação:**

- Exibir 3 a 4 telas de onboarding com ilustrações e textos curtos
- Incluir botão de "Pular" e "Avançar"
- Última tela deve ter um botão claro de "Começar" ou "Cadastrar"

**Prioridade:** Alta

---

### US-02: Cadastro com Google

**Como** usuário  
**Quero** me cadastrar e fazer login utilizando minha conta do Google  
**Para** agilizar o processo sem precisar criar uma nova senha

**Critérios de Aceitação:**

- Adicionar botão "Entrar com Google"
- Após a autenticação, capturar nome e e-mail automaticamente
- Caso o usuário queira, permitir complementar dados (idade, foto) após o primeiro acesso

**Prioridade:** Alta

---

### US-03: Manter Sessão Ativa

**Como** usuário  
**Quero** poder sair do app e ter minha sessão mantida por um período  
**Para** não precisar logar novamente toda vez que abrir o aplicativo

**Critérios de Aceitação:**

- Manter o usuário logado até que ele clique explicitamente em "Sair"
- Incluir opção de "Sair" nas configurações do perfil

**Prioridade:** Média

---

## Épico 2: Gerenciamento de Medicamentos e Lembretes

**Prioridade:** Alta (Funcionalidade central do app)

### US-04: Adicionar Medicamento

**Como** usuário  
**Quero** adicionar um novo medicamento com nome, dosagem, horário e frequência  
**Para** criar um lembrete personalizado

**Critérios de Aceitação:**

- Formulário com campos: nome do remédio, dosagem (ex: 500mg), unidade (comprimido, ml), frequência (diário, dias alternados, horários específicos)
- Permitir escolher horários múltiplos (ex: 08:00, 14:00)
- Salvar e exibir o medicamento na tela inicial

**Prioridade:** Alta

---

### US-05: Receber Notificações

**Como** usuário  
**Quero** receber uma notificação push no horário configurado  
**Para** ser lembrado de tomar meu medicamento

**Critérios de Aceitação:**

- O app deve disparar notificação mesmo quando fechado
- A notificação deve conter o nome e a dosagem do medicamento
- Ao tocar na notificação, abrir o app na tela de detalhes daquele medicamento

**Prioridade:** Alta

---

### US-06: Marcar Como Tomado

**Como** usuário  
**Quero** marcar que tomei um medicamento diretamente na notificação ou na tela inicial  
**Para** registrar o cumprimento da dose

**Critérios de Aceitação:**

- Adicionar botão "Tomado" na notificação
- Na tela inicial, ao lado de cada medicamento pendente, exibir um checkbox ou botão "Tomado"
- Ao marcar, atualizar o status para "Tomado" e registrar o horário da confirmação

**Prioridade:** Alta

---

### US-07: Controle de Estoque

**Como** usuário  
**Quero** visualizar meu estoque de medicamentos e ser avisado quando estiver acabando  
**Para** evitar ficar sem o remédio

**Critérios de Aceitação:**

- Ao cadastrar um medicamento, permitir informar a quantidade inicial (ex: 30 comprimidos)
- Diminuir o estoque automaticamente a cada confirmação de "Tomado"
- Exibir alerta (notificação ou ícone) quando o estoque estiver abaixo de um limite definido (ex: 5 unidades)

**Prioridade:** Média

---

### US-08: Editar ou Excluir Lembrete

**Como** usuário  
**Quero** editar ou excluir um lembrete de medicamento  
**Para** manter meus registros sempre atualizados

**Critérios de Aceitação:**

- Em cada card de medicamento, ter opção de "Editar" e "Excluir"
- Ao editar, permitir alterar todos os campos
- Ao excluir, pedir confirmação antes de remover

**Prioridade:** Média

---

## Épico 3: Funcionalidade de Controle Parental (Diferencial)

**Prioridade:** Alta (Diferencial do app, mencionado para idosos)

### US-09: Adicionar Familiar Dependente

**Como** cuidador (filho(a))  
**Quero** adicionar um familiar dependente ao meu app  
**Para** gerenciar os lembretes dele remotamente

**Critérios de Aceitação:**

- Tela "Família" com opção "Adicionar dependente"
- Gerar um código de convite ou link para que o dependente (ou seu dispositivo) seja vinculado
- Após vinculação, o dependente aparece na lista do cuidador

**Prioridade:** Alta

---

### US-10: Gerenciar Lembretes do Dependente

**Como** cuidador  
**Quero** criar e gerenciar os lembretes de medicamentos do meu familiar dependente  
**Para** garantir que ele tome os remédios corretamente

**Critérios de Aceitação:**

- No perfil do dependente, o cuidador pode ver, adicionar, editar e excluir medicamentos
- O cuidador recebe notificações quando o dependente marca que tomou o remédio (ou se não tomou após um tempo)

**Prioridade:** Alta

---

### US-11: Visualizar Histórico de Adesão

**Como** cuidador  
**Quero** visualizar o histórico de adesão do meu familiar  
**Para** monitorar se ele está seguindo o tratamento corretamente

**Critérios de Aceitação:**

- Tela de relatório simples (ex: calendário com marcações verdes para os dias que tomou todos os remédios)
- Permitir filtrar por semana ou mês

**Prioridade:** Média

---

### US-12: Modo Assistido (Interface Simplificada)

**Como** usuário dependente (idoso)  
**Quero** que o app tenha uma interface simplificada quando ativado o modo "assistido"  
**Para** facilitar o uso sem funcionalidades complexas

**Critérios de Aceitação:**

- Opção de "Modo Assistido" ativável pelo cuidador ou nas configurações
- Nesse modo, exibir apenas botões grandes: "Meus Remédios", "Tomado" e contato rápido do cuidador

**Prioridade:** Média

---

## Épico 4: Lembretes de Consultas e Localização

**Prioridade:** Média (Complementar ao núcleo de medicamentos)

### US-13: Adicionar Lembretes de Consultas

**Como** usuário  
**Quero** adicionar lembretes de consultas médicas com data, hora, endereço e observações  
**Para** não perder meus compromissos

**Critérios de Aceitação:**

- Formulário separado para "Consultas/Compromissos"
- Campos: título (ex: Consulta com Dr. Silva), data, horário, local, notas
- Disparar notificação no horário configurado

**Prioridade:** Média

---

### US-14: Visualizar Locais Próximos

**Como** usuário  
**Quero** visualizar farmácias, clínicas e hospitais próximos à minha localização  
**Para** encontrar rapidamente um local em caso de necessidade

**Critérios de Aceitação:**

- Tela "Próximos" com mapa integrado
- Usar a localização do dispositivo para listar locais em um raio de até 10km
- Exibir nome, endereço, distância e, se possível, avaliação

**Prioridade:** Média

---

### US-15: Pesquisar Locais em Outras Regiões

**Como** usuário  
**Quero** pesquisar por um local específico (farmácia ou clínica) em outra região  
**Para** planejar com antecedência

**Critérios de Aceitação:**

- Na tela de busca, permitir digitar um endereço ou CEP
- Mostrar resultados para a região pesquisada, com opção de ver no mapa

**Prioridade:** Baixa

---

## Épico 5: Perfil, Configurações e Suporte

**Prioridade:** Média/Baixa (Ajustes e refinamentos)

### US-16: Editar Perfil e Configurar Notificações

**Como** usuário  
**Quero** editar meu perfil (nome, foto, data de nascimento) e configurar preferências de notificação  
**Para** personalizar minha experiência

**Critérios de Aceitação:**

- Tela de perfil com opções editáveis
- Configurações de notificação: ativar/desativar sons, vibração, notificações push

**Prioridade:** Média

---

### US-17: Área de Ajuda e Suporte

**Como** usuário  
**Quero** ter acesso a uma área de ajuda/FAQ com perguntas frequentes e um contato de suporte  
**Para** tirar dúvidas sobre o uso do app

**Critérios de Aceitação:**

- Link para FAQ no menu principal
- Perguntas agrupadas por tema (medicamentos, controle parental, etc.)
- Exibir e-mail ou formulário de contato

**Prioridade:** Baixa

---

## Resumo de Prioridades

| Prioridade | Quantidade de Histórias |
| ---------- | ----------------------- |
| Alta       | 7                       |
| Média      | 8                       |
| Baixa      | 2                       |
| **Total**  | **17**                  |

---

## MVP (Produto Mínimo Viável) - Primeira Entrega

Para a primeira versão do app, recomenda-se entregar as histórias com prioridade **Alta**:

1. US-01: Tela de Onboarding
2. US-02: Cadastro com Google
3. US-04: Adicionar Medicamento
4. US-05: Receber Notificações
5. US-06: Marcar Como Tomado
6. US-09: Adicionar Familiar Dependente
7. US-10: Gerenciar Lembretes do Dependente

_Total de 7 histórias para o MVP._

---

## Observações para o Time de Desenvolvimento

- **Diferencial Competitivo:** O Épico 3 (Controle Parental) é o grande diferencial do app em relação aos concorrentes. Deve ser priorizado logo após as funcionalidades centrais.
- **Notificações:** As notificações push são críticas para o sucesso do app; devem ser implementadas com cuidado para garantir confiabilidade.
- **Acessibilidade:** O Modo Assistido (US-12) é essencial para o público idoso, principal alvo do controle parental.
- **Expansões Futuras:** Funcionalidades como integração com farmácias para entrega, relatórios detalhados para profissionais de saúde ou lembretes por voz podem ser adicionadas em versões futuras.
