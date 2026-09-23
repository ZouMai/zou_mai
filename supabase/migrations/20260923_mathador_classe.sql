-- Données du jeu : aucun nom de famille ni adresse électronique.
create table public.mathador_scores (
  player_id uuid primary key,
  nickname varchar(18) not null,
  completed smallint not null default 0 check (completed between 0 and 9),
  points integer[] not null default array_fill(0,array[9]),
  updated_at timestamptz not null default now(),
  constraint nine_scores check (array_length(points,1) = 9)
);
create table public.mathador_challenges (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.mathador_scores(player_id) on delete cascade,
  level smallint not null check (level between 0 and 8),
  cards integer[] not null,
  target integer not null,
  witness jsonb not null,
  issued_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '10 minutes'),
  consumed_at timestamptz,
  constraint five_cards check (array_length(cards,1) = 5)
);
create index mathador_challenges_player_issued on public.mathador_challenges(player_id, issued_at desc);
create index mathador_scores_rank on public.mathador_scores(completed desc);
alter table public.mathador_scores enable row level security;
alter table public.mathador_challenges enable row level security;
-- Le service Edge utilise la clé serveur ; aucun accès direct des navigateurs aux tables.
revoke all on public.mathador_scores from anon, authenticated;
revoke all on public.mathador_challenges from anon, authenticated;
