-- Comptes pseudonymes. Les codes sont stockés uniquement sous forme d'empreinte SHA-256.
create table public.tables_accounts (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique check (code_hash ~ '^[0-9a-f]{64}$'),
  role text not null check (role in ('teacher','student')),
  nickname varchar(24) not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.tables_attempts (
  id bigint generated always as identity primary key,
  account_id uuid not null references public.tables_accounts(id) on delete cascade,
  a smallint not null check (a between 2 and 11),
  b smallint not null check (b between 1 and 10),
  response smallint check (response between 0 and 110),
  correct boolean not null,
  mode text not null check (mode in ('learn','train','perfect','champion')),
  elapsed_ms integer not null check (elapsed_ms between 0 and 120000),
  played_at timestamptz not null default now()
);
create index tables_attempts_account_date on public.tables_attempts(account_id, played_at desc);
alter table public.tables_accounts enable row level security;
alter table public.tables_attempts enable row level security;
revoke all on public.tables_accounts from anon, authenticated;
revoke all on public.tables_attempts from anon, authenticated;
grant select, insert, update, delete on public.tables_accounts to service_role;
grant select, insert, update, delete on public.tables_attempts to service_role;
grant usage, select on sequence public.tables_attempts_id_seq to service_role;
