-- Bug fix: after INSERT ... RETURNING on households, PostgREST applies SELECT RLS to the
-- returned row. At that point the creator is not yet a member (membership inserted next),
-- so current_household_id() returns null and the row is invisible. Allow creator to read
-- their own households as well.

drop policy "households read" on households;

create policy "households read" on households for select
  using (id = current_household_id() or created_by = auth.uid());
