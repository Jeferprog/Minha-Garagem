-- ============================================================
-- Minha Garagem — estrutura do banco de dados (Supabase)
--
-- COMO USAR (pode rodar de novo quando quiser, é seguro repetir):
-- 1. Painel do Supabase > SQL Editor > New query.
-- 2. Cole TODO o conteúdo deste arquivo e clique em "Run".
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
  "estoqueDesde" date,
  "precoCompra" numeric,
  "precoVenda" numeric,
  "mostrarPrecoNoSite" boolean default true,
  status text default 'em_preparacao',
  fotos jsonb default '[]'::jsonb,
  pendencias jsonb default '[]'::jsonb,
  "criadoEm" timestamptz default now(),
  "atualizadoEm" timestamptz default now()
);
alter table public.veiculos add column if not exists "estoqueDesde" date;

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

-- VEÍCULOS: leitura e escrita SOMENTE do administrador logado.
-- (Dados internos, como preço de compra, NÃO ficam públicos. A vitrine
--  pública usa a VIEW "vitrine", definida mais abaixo.)
drop policy if exists "leitura publica veiculos" on public.veiculos;
drop policy if exists "escrita admin veiculos" on public.veiculos;
create policy "admin veiculos" on public.veiculos
  for all to authenticated using (true) with check (true);

-- CONFIG: leitura pública (só o número de WhatsApp), escrita do admin
drop policy if exists "leitura publica config" on public.config;
create policy "leitura publica config" on public.config
  for select using (true);
drop policy if exists "escrita admin config" on public.config;
create policy "escrita admin config" on public.config
  for all to authenticated using (true) with check (true);

-- VIEW pública da vitrine: entrega só os campos seguros e só os veículos
-- "à venda" ou "reservados". O preço só aparece quando "mostrar no site"
-- está ligado; e só as pendências marcadas para mostrar no site.
drop view if exists public.vitrine;
create view public.vitrine as
select
  id,
  marca,
  modelo,
  ano,
  "anoModelo",
  cor,
  quilometragem,
  status,
  fotos,
  "mostrarPrecoNoSite",
  case when "mostrarPrecoNoSite" then "precoVenda" else null end as "precoVenda",
  (
    select coalesce(jsonb_agg(p), '[]'::jsonb)
    from jsonb_array_elements(coalesce(pendencias, '[]'::jsonb)) as p
    where (p ->> 'mostrarNoSite')::boolean is true
  ) as pendencias
from public.veiculos
where status in ('a_venda', 'reservado');

grant select on public.vitrine to anon, authenticated;

-- STORAGE: balde (bucket) público para as fotos dos veículos
insert into storage.buckets (id, name, public)
  values ('fotos-veiculos', 'fotos-veiculos', true)
  on conflict (id) do nothing;

-- Qualquer pessoa vê as fotos; só o admin logado envia/altera/exclui.
drop policy if exists "fotos envio admin" on storage.objects;
create policy "fotos envio admin" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'fotos-veiculos');

drop policy if exists "fotos alteracao admin" on storage.objects;
create policy "fotos alteracao admin" on storage.objects
  for update to authenticated
  using (bucket_id = 'fotos-veiculos');

drop policy if exists "fotos exclusao admin" on storage.objects;
create policy "fotos exclusao admin" on storage.objects
  for delete to authenticated
  using (bucket_id = 'fotos-veiculos');
