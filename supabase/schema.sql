-- Finanças Pessoais — Schema SQL
-- Execute este script no Supabase SQL Editor

-- Tabela de transações
CREATE TABLE IF NOT EXISTS public.transactions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description text NOT NULL,
  amount      numeric(12, 2) NOT NULL CHECK (amount > 0),
  date        date NOT NULL,
  type        text NOT NULL CHECK (type IN ('income', 'expense')),
  category    text NOT NULL CHECK (category IN (
    'Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Saúde',
    'Educação', 'Salário', 'Freelance', 'Outros'
  )),
  created_at  timestamptz NOT NULL DEFAULT now(),
  settled     boolean NOT NULL DEFAULT false
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON public.transactions (user_id);
CREATE INDEX IF NOT EXISTS transactions_date_idx ON public.transactions (date DESC);
CREATE INDEX IF NOT EXISTS transactions_user_date_idx ON public.transactions (user_id, date DESC);

-- Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Política: cada usuário só vê e gerencia suas próprias transações
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON public.transactions FOR DELETE
  USING (auth.uid() = user_id);
