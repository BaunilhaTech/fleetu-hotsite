-- Replace read policy to allow authenticated GitHub users in the admin allowlist.
-- Keep service_role access for backend jobs.
drop policy if exists "Enable read access for service_role only" on leads;
drop policy if exists "Enable read access for allowed github users" on leads;

create policy "Enable read access for allowed github users" on leads
  for select
  using (
    auth.role() = 'service_role'
    or (
      auth.role() = 'authenticated'
      and lower(
        coalesce(
          auth.jwt() -> 'user_metadata' ->> 'user_name',
          auth.jwt() -> 'user_metadata' ->> 'preferred_username',
          auth.jwt() -> 'user_metadata' ->> 'username',
          auth.jwt() -> 'user_metadata' ->> 'login',
          split_part(auth.jwt() ->> 'email', '@', 1),
          ''
        )
      ) in ('alexandremendoncaalvaro', 'cgrahl')
    )
  );
