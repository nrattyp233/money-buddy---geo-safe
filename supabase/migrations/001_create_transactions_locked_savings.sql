-- Migration: create transactions, locked_savings, and user_restrictions

-- Enable pgcrypto for gen_random_uuid() if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Transactions table: records pending/completed payments between users
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_from uuid NOT NULL,
  user_to uuid NOT NULL,
  amount_cents bigint NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  stripe_payment_intent_id text,
  stripe_charge_id text,
  status text NOT NULL DEFAULT 'PENDING', -- PENDING, SUCCEEDED, FAILED, CANCELED
  service_fee_cents bigint DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_from ON public.transactions (user_from);
CREATE INDEX IF NOT EXISTS idx_transactions_user_to ON public.transactions (user_to);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions (status);

-- Locked savings: funds locked for a period with optional early withdrawal penalty
CREATE TABLE IF NOT EXISTS public.locked_savings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount_cents bigint NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  lock_start timestamptz NOT NULL DEFAULT now(),
  lock_end timestamptz NOT NULL,
  penalty_percent numeric(5,2) DEFAULT 5.00, -- percent charged on early withdrawal
  interest_rate numeric(5,2) DEFAULT 0.00, -- optional annual interest
  is_withdrawn boolean NOT NULL DEFAULT false,
  stripe_charge_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_locked_savings_user ON public.locked_savings (user_id);
CREATE INDEX IF NOT EXISTS idx_locked_savings_lock_end ON public.locked_savings (lock_end);

-- User restrictions: store geofence and time restrictions per user
CREATE TABLE IF NOT EXISTS public.user_restrictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  -- geofence center (latitude/longitude) and radius in meters
  geo_lat double precision,
  geo_lng double precision,
  geo_radius_meters integer DEFAULT 1000,
  -- allowed hours in 24h format (0-23)
  allowed_start_hour smallint DEFAULT 0,
  allowed_end_hour smallint DEFAULT 23,
  -- optional allowed days (1=Mon .. 7=Sun) stored as integer array
  allowed_days smallint[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_restrictions_user ON public.user_restrictions (user_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_updated_at();

CREATE TRIGGER trg_locked_savings_updated_at
BEFORE UPDATE ON public.locked_savings
FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_updated_at();

CREATE TRIGGER trg_user_restrictions_updated_at
BEFORE UPDATE ON public.user_restrictions
FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_updated_at();
