-- Shared mesas: a table of friends that anyone holding its link can read and edit.
--
-- The publishable (anon) key ships inside the app, so it must never reach the tables directly:
-- a plain SELECT policy would let anyone list every mesa. Every read and write goes through a
-- function that needs the mesa id (an unguessable uuid), which is what the link carries.

create table public.mesas (
  id uuid primary key default gen_random_uuid(),
  name text not null default '' check (char_length(name) <= 80),
  created_at timestamptz not null default now()
);

create table public.participants (
  id uuid primary key default gen_random_uuid(),
  mesa_id uuid not null references public.mesas (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 40),
  expense numeric(14, 2) not null check (expense >= 0 and expense <= 999999999999),
  concept text not null default '' check (char_length(concept) <= 60),
  color integer not null check (color >= 0),
  created_at timestamptz not null default clock_timestamp()
);

create index participants_mesa_id_created_at_idx on public.participants (mesa_id, created_at);

alter table public.mesas enable row level security;
alter table public.participants enable row level security;

-- No policies on purpose: with RLS on and no grants, the anon and authenticated roles see nothing.
revoke all on public.mesas, public.participants from anon, authenticated;

-- One mesa, with its participants in the order they sat down. Null when the id does not exist.
create function public.get_mesa(p_mesa uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'id', m.id,
    'name', m.name,
    'participants', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', p.id,
            'name', p.name,
            'expense', p.expense,
            'concept', p.concept,
            'color', p.color
          )
          order by p.created_at, p.id
        )
        from public.participants p
        where p.mesa_id = m.id
      ),
      '[]'::jsonb
    )
  )
  from public.mesas m
  where m.id = p_mesa;
$$;

-- Creates a mesa, optionally seeded with the people already sitting at a local one.
-- p_participants is a JSON array of { name, expense, concept }.
create function public.create_mesa(p_name text, p_participants jsonb default '[]'::jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_mesa uuid;
begin
  if jsonb_typeof(p_participants) <> 'array' or jsonb_array_length(p_participants) > 50 then
    raise exception 'invalid participants' using errcode = '22023';
  end if;

  insert into public.mesas (name) values (btrim(coalesce(p_name, ''))) returning id into v_mesa;

  insert into public.participants (mesa_id, name, expense, concept, color, created_at)
  select
    v_mesa,
    btrim(x.name),
    x.expense,
    btrim(coalesce(x.concept, '')),
    (x.ord - 1)::integer,
    clock_timestamp() + x.ord * interval '1 microsecond'
  from rows from (jsonb_to_recordset(p_participants) as (name text, expense numeric, concept text))
    with ordinality as x(name, expense, concept, ord);

  return v_mesa;
end;
$$;

create function public.rename_mesa(p_mesa uuid, p_name text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.mesas set name = btrim(coalesce(p_name, '')) where id = p_mesa;

  if not found then
    raise exception 'mesa not found' using errcode = 'P0002';
  end if;
end;
$$;

-- Adds one person. The mesa row is locked so two people joining at once never get the same
-- colour, and a mesa never grows past 50 people.
create function public.add_participant(p_mesa uuid, p_name text, p_expense numeric, p_concept text default '')
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_participant uuid;
  v_count integer;
  v_color integer;
begin
  perform 1 from public.mesas where id = p_mesa for update;

  if not found then
    raise exception 'mesa not found' using errcode = 'P0002';
  end if;

  select count(*), coalesce(max(color) + 1, 0) into v_count, v_color
  from public.participants
  where mesa_id = p_mesa;

  if v_count >= 50 then
    raise exception 'mesa is full' using errcode = '54000';
  end if;

  insert into public.participants (mesa_id, name, expense, concept, color)
  values (p_mesa, btrim(p_name), p_expense, btrim(coalesce(p_concept, '')), v_color)
  returning id into v_participant;

  return v_participant;
end;
$$;

-- Anyone with the link can edit anyone: both ids are required so a participant id alone,
-- copied out of context, is not enough.
create function public.update_participant(
  p_mesa uuid,
  p_participant uuid,
  p_name text,
  p_expense numeric,
  p_concept text default ''
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.participants
  set name = btrim(p_name), expense = p_expense, concept = btrim(coalesce(p_concept, ''))
  where id = p_participant and mesa_id = p_mesa;

  if not found then
    raise exception 'participant not found' using errcode = 'P0002';
  end if;
end;
$$;

create function public.delete_participant(p_mesa uuid, p_participant uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.participants where id = p_participant and mesa_id = p_mesa;
end;
$$;

revoke execute on function
  public.get_mesa(uuid),
  public.create_mesa(text, jsonb),
  public.rename_mesa(uuid, text),
  public.add_participant(uuid, text, numeric, text),
  public.update_participant(uuid, uuid, text, numeric, text),
  public.delete_participant(uuid, uuid)
from public;

grant execute on function
  public.get_mesa(uuid),
  public.create_mesa(text, jsonb),
  public.rename_mesa(uuid, text),
  public.add_participant(uuid, text, numeric, text),
  public.update_participant(uuid, uuid, text, numeric, text),
  public.delete_participant(uuid, uuid)
to anon, authenticated;
