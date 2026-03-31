

## Situação Atual do Painel Admin

O painel admin atual gerencia apenas:
- **Conteúdos** (CRUD completo) - legislação, notícias, artigos
- **Prazos/Obrigações** (CRUD completo)
- **Usuários** (somente leitura - sem editar, habilitar/desabilitar, mudar plano)
- **Configurações** (apenas botão de atualização automática)

**Faltam** gestão de: planos de assinatura, solicitações de orçamento, matrículas, planilhas mensais, e ações sobre usuários (habilitar/desabilitar, alterar plano/status).

## Plano de Implementação

### 1. Expandir Gestão de Usuários
- Adicionar botões para **habilitar/desabilitar** usuários (update `profiles.habilitado`)
- Adicionar **alteração de plano** (gratuito/basico/premium/corporativo) e **status** (ativo/pendente/bloqueado)
- Adicionar busca/filtro na lista de usuários
- Criar migration para permitir admins atualizarem profiles (`UPDATE` policy usando `has_role`)

### 2. Nova aba: Planos de Assinatura
- CRUD completo na tabela `planos_assinatura` (nome, descrição, preço, tipo, ativo, recursos)
- Migration para permitir admins INSERT/UPDATE/DELETE em `planos_assinatura`

### 3. Nova aba: Solicitações de Orçamento
- Listar todas as solicitações da tabela `solicitacoes_orcamento`
- Alterar status (pendente → analisando → respondido → fechado)
- Migration para permitir admins UPDATE em `solicitacoes_orcamento`

### 4. Nova aba: Matrículas
- Listar todas as matrículas da tabela `matriculas`
- Alterar status (pendente → aprovada → cancelada)
- Migration para admin SELECT/UPDATE em `matriculas`

### 5. Nova aba: Planilhas Mensais
- CRUD para upload de referência de planilhas mensais
- Migration para admin INSERT/UPDATE/DELETE em `planilhas_mensais`

### Detalhes Técnicos

**Migrations necessárias:**
- RLS policies para admins em `profiles` (UPDATE), `planos_assinatura` (ALL), `solicitacoes_orcamento` (UPDATE), `matriculas` (SELECT ALL + UPDATE), `planilhas_mensais` (ALL)

**Arquivo principal modificado:**
- `src/components/admin/AdminDashboard.tsx` - expandir de 4 para 8 abas com CRUD completo

**TabsList atualizada:**
Conteúdos | Prazos | Usuários | Planos | Solicitações | Matrículas | Planilhas | Config

