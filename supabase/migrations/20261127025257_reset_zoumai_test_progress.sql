create or replace function public.reset_zoumai_test_progress(pupil_id uuid)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.tables_accounts
    where id = pupil_id and role = 'student' and nickname = 'Élève test'
  ) then
    return false;
  end if;
  delete from public.site_rewards where account_id = pupil_id;
  delete from public.site_events where account_id = pupil_id;
  delete from public.tables_attempts where account_id = pupil_id;
  return true;
end;
$$;
revoke all on function public.reset_zoumai_test_progress(uuid) from public, anon, authenticated;
grant execute on function public.reset_zoumai_test_progress(uuid) to service_role;
