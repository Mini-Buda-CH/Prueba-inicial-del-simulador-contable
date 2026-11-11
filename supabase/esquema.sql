-- De 0 a CFO · esquema mínimo de Supabase. Ejecutar una vez en SQL Editor.
-- Cada usuario solo ve y modifica sus propias filas (Row Level Security).
create table if not exists public.progreso (
  user_id uuid not null references auth.users (id) on delete cascade,
  clave text not null check (clave like 'simcont.%'),
  datos jsonb not null,
  actualizado timestamptz not null default now(),
  primary key (user_id, clave)
);

alter table public.progreso enable row level security;

create policy "leer lo propio" on public.progreso for select using (auth.uid() = user_id);
create policy "crear lo propio" on public.progreso for insert with check (auth.uid() = user_id);
create policy "actualizar lo propio" on public.progreso for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
