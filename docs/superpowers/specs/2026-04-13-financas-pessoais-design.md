# Design Spec: Finanças Pessoais App
**Data:** 2026-04-13  
**Status:** Aprovado

---

## 1. Contexto

Web app de gestão financeira pessoal que permite ao usuário registrar receitas e despesas, categorizá-las e visualizar um dashboard com resumo mensal. Cada usuário acessa apenas seus próprios dados (Row Level Security no Supabase).

---

## 2. Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Linguagem | TypeScript |
| UI | shadcn/ui + Tailwind CSS |
| Gráficos | Recharts |
| Backend/Auth/DB | Supabase (`@supabase/ssr`) |
| Banco de dados | PostgreSQL (via Supabase) |
| Deploy | Vercel |

---

## 3. Arquitetura de Dados

**Padrão:** Server Components + Server Actions  
- Server Components buscam dados via Supabase SSR (cookie-based session)
- Mutações (criar/editar/excluir) via Server Actions + `revalidatePath`
- Sem estado global — cada página é autossuficiente
- Middleware Next.js protege rotas autenticadas

**Schema do banco:**

```sql
CREATE TABLE transactions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description text NOT NULL,
  amount      numeric(12,2) NOT NULL CHECK (amount > 0),
  date        date NOT NULL,
  type        text NOT NULL CHECK (type IN ('income', 'expense')),
  category    text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

-- Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users see own transactions"
  ON transactions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

**Categorias pré-definidas:**  
`Alimentação`, `Transporte`, `Moradia`, `Lazer`, `Saúde`, `Educação`, `Salário`, `Freelance`, `Outros`

---

## 4. Rotas

| Rota | Tipo | Descrição |
|---|---|---|
| `/` | Pública | Landing page |
| `/login` | Pública | Login com e-mail/senha |
| `/cadastro` | Pública | Cadastro de novo usuário |
| `/dashboard` | Autenticada | Cards de resumo + gráfico + últimas transações |
| `/transacoes` | Autenticada | Lista completa com filtros + CRUD |
| `/relatorios` | Autenticada | Gráficos detalhados + exportar CSV |

---

## 5. UI / UX

### Identidade Visual

| Elemento | Valor |
|---|---|
| Navbar | `#0f172a` (slate-900) |
| Receita | `#10b981` (emerald-500) |
| Despesa | `#ef4444` (red-500) |
| Saldo | `#3b82f6` (blue-500) |
| Accent / botões | `#3b82f6` |
| Fundo geral | `#f8fafc` (slate-50) |
| Fonte | Inter (padrão shadcn/ui) |
| Cards | border-radius 12px, sombra leve |

### Layout

Navbar fixa no topo (dark) com logo, links de navegação, sino de notificações e avatar do usuário. Conteúdo principal abaixo, largura total.

### Telas

**Landing page (`/`)**  
- Hero escuro com gradiente, headline + subtítulo + botão "Começar grátis"
- Seção de 3 features: Dashboard visual / Categorias inteligentes / Exportar CSV
- Segundo CTA no final
- Navbar com links "Entrar" e "Cadastrar"

**Login / Cadastro (`/login`, `/cadastro`)**  
- Card centralizado com formulário Supabase Auth (e-mail + senha)
- Redirect para `/dashboard` após autenticação bem-sucedida
- Link cruzado entre login e cadastro

**Dashboard (`/dashboard`)**  
- 3 cards de resumo: Receita Total / Despesa Total / Saldo (mês atual)
- Gráfico de pizza por categoria (Recharts) — baseado nas despesas do mês
- Lista das 5 últimas transações com link "ver todas → /transacoes"

**Transações (`/transacoes`)**  
- Tabela paginada de todas as transações
- Filtros: mês/ano (select), categoria (select), busca por descrição (input)
- Botão "Nova transação" → abre Sheet (gaveta lateral shadcn/ui) com formulário
- Ações por linha: editar (Sheet) e excluir (AlertDialog de confirmação)
- Campos do formulário: descrição, valor, data, tipo (receita/despesa), categoria

**Relatórios (`/relatorios`)**  
- Seletor de período (mês/ano)
- Gráfico de barras: receitas vs despesas nos últimos 6 meses (Recharts)
- Gráfico de pizza: distribuição por categoria no período selecionado
- Tabela resumo: categoria / total gasto / % do total
- Botão "Exportar CSV" → Route Handler `/api/export`

**Notificações**  
- Sino no navbar com badge de contagem de alertas não lidos
- Dropdown com alertas automáticos gerados no servidor:
  - Saldo do mês negativo
  - Despesa individual acima de R$ 1.000
  - Mês encerrado sem nenhuma receita registrada

---

## 6. Fluxo de Dados

### Autenticação
```
Usuário acessa rota autenticada
→ middleware.ts verifica session via @supabase/ssr
→ sem session: redirect /login
→ com session: renderiza página com dados do usuário
```

### Mutação (criar/editar/excluir transação)
```
Usuário preenche form → submit
→ Server Action valida (tipo, valor > 0, data, categoria permitida)
→ insert/update/delete no Supabase (RLS garante isolamento)
→ revalidatePath('/transacoes') e revalidatePath('/dashboard')
→ Sheet fecha + toast de sucesso
```

### Exportar CSV
```
Usuário clica "Exportar CSV"
→ GET /api/export?mes=4&ano=2026&categoria=...
→ Route Handler busca transações filtradas (Supabase SSR, respeita RLS)
→ Response: Content-Type text/csv + Content-Disposition attachment
→ Browser faz download automático
```

### Tratamento de Erros
| Cenário | Comportamento |
|---|---|
| Auth inválida | Redirect `/login?error=session_expired` |
| Validação form | Mensagem inline no campo, sem submit |
| Erro de banco | Toast vermelho: "Algo deu errado, tente novamente" |
| Loading | Skeleton loaders nos cards e tabela |

---

## 7. Milestones

| # | Milestone | Entregáveis |
|---|---|---|
| 1 | Setup & Infraestrutura | Next.js + shadcn/ui + Supabase + Vercel configurados |
| 2 | Auth & Landing | Landing page completa, login/cadastro, proteção de rotas via middleware |
| 3 | Dashboard | Cards de resumo mensal, gráfico de pizza, últimas 5 transações |
| 4 | CRUD de Transações | Tabela paginada, filtros, busca, Sheet de formulário, editar/excluir |
| 5 | Relatórios | Gráfico de barras, pizza, tabela resumo, exportar CSV |
| 6 | Notificações & Polish | Alertas visuais, responsividade mobile, ajustes de UX finais |

---

## 8. Decisões de Design

| Decisão | Escolha | Motivação |
|---|---|---|
| Layout | Top Nav + conteúdo central | Estilo Mobills/Organizze, funciona bem no mobile |
| Paleta | Dark navbar + azul/verde vibrante | Moderno, contraste alto, financeiro |
| Dados | Server Components + Server Actions | Idiomático Next.js 14, sem estado global |
| Calendário | Filtro de data na lista | YAGNI — cobre a necessidade sem complexidade extra |
| Notificações | Visuais no app (sino + dropdown) | Sem dependências externas (e-mail, push) |
| Relatórios | Tela dedicada com múltiplos gráficos | Valor real para o usuário, separado da lista de transações |
| Landing page | Hero + features + CTA | Apresenta o produto antes do cadastro |
