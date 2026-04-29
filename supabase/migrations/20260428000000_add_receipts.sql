-- =============================================================
-- Migration: 20260428000000_add_receipts
-- Purpose:   Add receipt/NF-e support to Fluxo360 Finance
--            - Adds `source` column to public.transactions
--            - Creates public.transaction_receipts table
--            - Enables RLS with per-user policies
--            - Creates performance indexes
--
-- Safety:    Does NOT drop or recreate public.transactions.
--            Does NOT remove existing columns or data.
--            Uses IF NOT EXISTS and DO $$ blocks throughout.
-- =============================================================

-- -------------------------------------------------------
-- 1. Add `source` column to public.transactions
-- -------------------------------------------------------
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'manual';

-- CHECK constraint via DO block — safe to re-run if already present
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname    = 'transactions_source_check'
      AND conrelid   = 'public.transactions'::regclass
  ) THEN
    ALTER TABLE public.transactions
      ADD CONSTRAINT transactions_source_check
      CHECK (source IN ('manual', 'qr_code', 'receipt_photo', 'imported'));
  END IF;
END $$;

-- -------------------------------------------------------
-- 2. Create public.transaction_receipts
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transaction_receipts (
  id                uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id    uuid          REFERENCES public.transactions(id) ON DELETE SET NULL,
  user_id           uuid          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_type       text          NOT NULL,
  status            text          NOT NULL DEFAULT 'pending',
  qr_code_url       text,
  nfce_access_key   text,
  merchant_name     text,
  merchant_cnpj     text,
  receipt_date      timestamptz,
  total_amount      numeric(12, 2) CHECK (total_amount IS NULL OR total_amount >= 0),
  image_path        text,
  raw_text          text,
  raw_data          jsonb,
  error_message     text,
  created_at        timestamptz   NOT NULL DEFAULT now(),
  updated_at        timestamptz   NOT NULL DEFAULT now()
);

-- CHECK constraints via DO block — safe to re-run
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname  = 'transaction_receipts_source_type_check'
      AND conrelid = 'public.transaction_receipts'::regclass
  ) THEN
    ALTER TABLE public.transaction_receipts
      ADD CONSTRAINT transaction_receipts_source_type_check
      CHECK (source_type IN ('manual', 'qr_code', 'receipt_photo', 'imported'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname  = 'transaction_receipts_status_check'
      AND conrelid = 'public.transaction_receipts'::regclass
  ) THEN
    ALTER TABLE public.transaction_receipts
      ADD CONSTRAINT transaction_receipts_status_check
      CHECK (status IN ('pending', 'processing', 'completed', 'failed'));
  END IF;
END $$;

-- -------------------------------------------------------
-- 3. Trigger: keep updated_at current on every UPDATE
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname   = 'trg_receipts_updated_at'
      AND tgrelid  = 'public.transaction_receipts'::regclass
  ) THEN
    CREATE TRIGGER trg_receipts_updated_at
      BEFORE UPDATE ON public.transaction_receipts
      FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- -------------------------------------------------------
-- 4. Row Level Security
-- -------------------------------------------------------
ALTER TABLE public.transaction_receipts ENABLE ROW LEVEL SECURITY;

-- SELECT — users see only their own receipts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON c.oid = p.polrelid
    WHERE c.relname  = 'transaction_receipts'
      AND c.relnamespace = 'public'::regnamespace
      AND p.polname  = 'Users can view own receipts'
  ) THEN
    CREATE POLICY "Users can view own receipts"
      ON public.transaction_receipts FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- INSERT — user_id must match the authenticated user
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON c.oid = p.polrelid
    WHERE c.relname  = 'transaction_receipts'
      AND c.relnamespace = 'public'::regnamespace
      AND p.polname  = 'Users can insert own receipts'
  ) THEN
    CREATE POLICY "Users can insert own receipts"
      ON public.transaction_receipts FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- UPDATE — both USING (which rows) and WITH CHECK (post-update value)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON c.oid = p.polrelid
    WHERE c.relname  = 'transaction_receipts'
      AND c.relnamespace = 'public'::regnamespace
      AND p.polname  = 'Users can update own receipts'
  ) THEN
    CREATE POLICY "Users can update own receipts"
      ON public.transaction_receipts FOR UPDATE
      USING     (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- DELETE
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON c.oid = p.polrelid
    WHERE c.relname  = 'transaction_receipts'
      AND c.relnamespace = 'public'::regnamespace
      AND p.polname  = 'Users can delete own receipts'
  ) THEN
    CREATE POLICY "Users can delete own receipts"
      ON public.transaction_receipts FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- -------------------------------------------------------
-- 5. Indexes
-- -------------------------------------------------------

-- FK lookup: receipts → transactions
CREATE INDEX IF NOT EXISTS receipts_transaction_id_idx
  ON public.transaction_receipts (transaction_id);

-- User isolation (supports RLS scans and listing)
CREATE INDEX IF NOT EXISTS receipts_user_id_idx
  ON public.transaction_receipts (user_id);

-- NF-e chave de acesso lookup (partial: only when present)
CREATE INDEX IF NOT EXISTS receipts_nfce_access_key_idx
  ON public.transaction_receipts (nfce_access_key)
  WHERE nfce_access_key IS NOT NULL;

-- Status filtering (partial: only active statuses need fast lookup)
CREATE INDEX IF NOT EXISTS receipts_status_active_idx
  ON public.transaction_receipts (status, created_at DESC)
  WHERE status IN ('pending', 'processing');

-- General listing by user ordered by newest first
CREATE INDEX IF NOT EXISTS receipts_user_created_idx
  ON public.transaction_receipts (user_id, created_at DESC);
