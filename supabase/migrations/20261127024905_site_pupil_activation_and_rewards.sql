alter table public.site_class_access add column if not exists custom_code_hash text;
alter table public.tables_accounts add column if not exists activation_hash text;
create table if not exists public.site_rewards (
  account_id uuid not null references public.tables_accounts(id) on delete cascade,
  activity text not null,
  primary key (account_id, activity)
);
alter table public.site_rewards enable row level security;
revoke all on public.site_rewards from anon, authenticated;
grant select, insert, delete on public.site_rewards to service_role;
