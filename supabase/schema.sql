-- ============================================================
-- Minha Garagem — estrutura do banco de dados (Supabase)
--
-- COMO USAR (uma vez só):
-- 1. Abra o painel do seu projeto no Supabase.
-- 2. Menu lateral > SQL Editor > New query.
-- 3. Cole TODO o conteúdo deste arquivo e clique em "Run".
-- Pode rodar de novo quando quiser, sem problema (é seguro repetir).
-- ============================================================

-- Tabela de veículos
create table if not exists public.veiculos (
  id uuid primary key default gen_random_uuid(),
  marca text,
  modelo text,
  ano integer,
  "anoModelo" integer,
  cor text,
  placa text,
  quilometragem numeric,
  "precoCompra" numeric,
  "precoVenda" numeric,
  "mostrarPrecoNoSite" boolean default true,
  status text default 'em_preparacao',
  fotos jsonb default '[]'::jsonb,
  pendencias jsonb default '[]'::jsonb,
  "criadoEm" timestamptz default now(),
  "atualizadoEm" timestamptz default now()
);

-- Tabela de configurações (uma linha só, id = 1)
create table if not exists public.config (
  id integer primary key default 1,
  whatsapp text default '',
  constraint config_uma_linha check (id = 1)
);
insert into public.config (id, whatsapp)
  values (1, '')
  on conflict (id) do nothing;

-- Liga a proteção por linha (RLS)
alter table public.veiculos enable row level security;
alter table public.config enable row level security;

-- LEITURA: qualquer pessoa pode ver (a vitrine é pública)
drop policy if exists "leitura publica veiculos" on public.veiculos;
create policy "leitura publica veiculos" on public.veiculos
  for select using (true);

drop policy if exists "leitura publica config" on public.config;
create policy "leitura publica config" on public.config
  for select using (true);

-- ESCRITA (criar / editar / excluir): só quem está logado (administrador)
drop policy if exists "escrita admin veiculos" on public.veiculos;
create policy "escrita admin veiculos" on public.veiculos
  for all to authenticated using (true) with check (true);

drop policy if exists "escrita admin config" on public.config;
create policy "escrita admin config" on public.config
  for all to authenticated using (true) with check (true);
