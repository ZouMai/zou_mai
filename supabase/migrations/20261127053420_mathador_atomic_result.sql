alter table public.mathador_challenges add column awarded_score integer;

create function public.save_mathador_result(p_challenge uuid, p_player uuid, p_score integer)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  challenge public.mathador_challenges%rowtype;
  profile public.mathador_scores%rowtype;
begin
  if p_score is null or p_score not between 0 and 18 then return null; end if;
  select * into challenge from public.mathador_challenges
  where id=p_challenge and player_id=p_player for update;
  if not found then return null; end if;

  if challenge.awarded_score is not null then
    select * into strict profile from public.mathador_scores where player_id=p_player;
  else
    if challenge.consumed_at is not null or challenge.expires_at <= now() then return null; end if;
    select * into strict profile from public.mathador_scores where player_id=p_player for update;
    profile.points[challenge.level+1] := coalesce(profile.points[challenge.level+1],0) + p_score;
    update public.mathador_scores
    set points=profile.points, completed=greatest(completed,challenge.level+1), updated_at=now()
    where player_id=p_player returning * into profile;
    update public.mathador_challenges set consumed_at=now(), awarded_score=p_score where id=p_challenge;
  end if;

  return jsonb_build_object('score',coalesce(challenge.awarded_score,p_score),
                           'completed',profile.completed,'points',profile.points);
end;
$$;
revoke all on function public.save_mathador_result(uuid,uuid,integer) from public, anon, authenticated;
grant execute on function public.save_mathador_result(uuid,uuid,integer) to service_role;
