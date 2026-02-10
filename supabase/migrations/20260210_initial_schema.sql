-- ╔════════════════════════════════════════════════════════════════╗
-- ║  Fleetu Hotsite — Initial Schema (fresh start)              ║
-- ║  Drops existing data and recreates with proper RLS          ║
-- ╚════════════════════════════════════════════════════════════════╝

-- ── Clean slate ─────────────────────────────────────────────────
drop table if exists leads cascade;

-- ── Create leads table ──────────────────────────────────────────
create table leads (
  id          uuid        default gen_random_uuid() primary key,
  created_at  timestamptz default now() not null,
  email       text        not null,
  role        text        not null,
  fleet_size  text        not null,

  -- Prevent duplicate submissions from the same email
  constraint  leads_email_unique unique (email)
);

-- ── Indexes ─────────────────────────────────────────────────────
create index leads_created_at_idx on leads (created_at desc);

-- ── Row Level Security ──────────────────────────────────────────
alter table leads enable row level security;

-- Anyone can submit a lead (anon visitors and authenticated admin users)
create policy "Allow lead submissions"
  on leads
  for insert
  to anon, authenticated
  with check (true);

-- Service role has full access (used by backend jobs and admin tools)
-- No explicit policy needed — service_role bypasses RLS by default

-- Authenticated GitHub users in the admin allowlist can read leads
create policy "Allow admin read access"
  on leads
  for select
  to authenticated
  using (
    lower(
      coalesce(
        auth.jwt() -> 'user_metadata' ->> 'user_name',
        auth.jwt() -> 'user_metadata' ->> 'preferred_username',
        auth.jwt() -> 'user_metadata' ->> 'username',
        auth.jwt() -> 'user_metadata' ->> 'login',
        split_part(auth.jwt() ->> 'email', '@', 1),
        ''
      )
    ) in ('alexandremendoncaalvaro', 'cgrahl')
  );
