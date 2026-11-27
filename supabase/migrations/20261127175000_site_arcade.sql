create table public.site_arcade_sessions (
  token_hash text primary key,
  account_id uuid not null references public.tables_accounts(id) on delete cascade,
  expires_at timestamptz not null
);
alter table public.site_arcade_sessions enable row level security;
revoke all on public.site_arcade_sessions from public, anon, authenticated;
grant select, insert, delete on public.site_arcade_sessions to service_role;
create index site_arcade_sessions_account on public.site_arcade_sessions (account_id, expires_at);

create table public.site_arcade_rounds (
  account_id uuid not null references public.tables_accounts(id) on delete cascade,
  match_id uuid not null,
  game text not null,
  challenge text not null,
  result jsonb not null,
  performance integer not null check (performance between 0 and 10),
  points integer not null check (points between 0 and 15),
  played_at timestamptz not null default clock_timestamp(),
  primary key (account_id, match_id)
);
alter table public.site_arcade_rounds enable row level security;
revoke all on public.site_arcade_rounds from public, anon, authenticated;
grant select, insert on public.site_arcade_rounds to service_role;

create index site_arcade_rounds_latest on public.site_arcade_rounds (account_id, played_at desc);
create index site_arcade_rounds_challenge on public.site_arcade_rounds (account_id, game, challenge, performance desc);

create function public.site_arcade_record(
  pupil uuid, match uuid, game_name text, rules text, details jsonb, rating integer
) returns integer
language plpgsql set search_path = public
as $$
declare
  awarded integer;
  best integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(pupil::text, 0));
  select points into awarded from site_arcade_rounds
    where account_id = pupil and match_id = match;
  if found then return awarded; end if;

  select max(performance) into best from site_arcade_rounds
    where account_id = pupil and game = game_name and challenge = rules;
  if not exists (select 1 from site_arcade_rounds where account_id = pupil and game = game_name) then
    awarded := 5 + rating;
  elsif best is not null then
    awarded := greatest(0, rating - best);
  else
    awarded := 0;
  end if;

  insert into site_arcade_rounds(account_id, match_id, game, challenge, result, performance, points)
    values (pupil, match, game_name, rules, details, rating, awarded);
  return awarded;
end;
$$;

create function public.site_arcade_summary(pupil uuid) returns jsonb
language sql stable set search_path = public
as $$
  with rounds as (
    select * from site_arcade_rounds where account_id = pupil
  ), best as (
    select distinct on (game, challenge) *
    from rounds
    order by game, challenge, performance desc, (result->>'correct')::integer desc, played_at desc
  )
  select jsonb_build_object(
    'points', coalesce((select sum(points) from rounds), 0),
    'played', (select count(*) from rounds),
    'records', coalesce((select jsonb_agg(to_jsonb(entry) order by entry.played_at desc) from (
      select game, result, performance, played_at from best order by played_at desc limit 12
    ) entry), '[]'::jsonb),
    'recent', coalesce((select jsonb_agg(to_jsonb(entry) order by entry.played_at desc) from (
      select game, result, points, played_at from rounds order by played_at desc limit 5
    ) entry), '[]'::jsonb)
  );
$$;

revoke all on function public.site_arcade_record(uuid, uuid, text, text, jsonb, integer) from public, anon, authenticated;
revoke all on function public.site_arcade_summary(uuid) from public, anon, authenticated;
grant execute on function public.site_arcade_record(uuid, uuid, text, text, jsonb, integer) to service_role;
grant execute on function public.site_arcade_summary(uuid) to service_role;
