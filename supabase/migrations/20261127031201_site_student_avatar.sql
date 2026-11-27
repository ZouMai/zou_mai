alter table public.tables_accounts
  add column avatar text check (avatar in ('zoum', 'mai'));
