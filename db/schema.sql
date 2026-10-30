-- Esquema do portfólio. Idempotente: rodar de novo não apaga nada (npm run db:setup).

create table if not exists posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  titulo      text not null,
  resumo      text not null default '',
  conteudo    text not null default '',
  capa_url    text,
  publicado   boolean not null default false,
  publicado_em timestamptz,
  criado_em   timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index if not exists posts_publicados on posts (publicado_em desc) where publicado;

create table if not exists recomendacoes (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  cargo       text not null,
  empresa     text not null default '',
  relacao     text not null,
  texto       text not null,
  linkedin    text,
  status      text not null default 'pendente' check (status in ('pendente', 'aprovada', 'oculta')),
  ip          text,
  criado_em   timestamptz not null default now(),
  aprovada_em timestamptz
);
create index if not exists recomendacoes_status on recomendacoes (status, criado_em desc);

-- Tentativas de login e de envio, para limitar abuso por IP.
create table if not exists tentativas (
  id        bigserial primary key,
  tipo      text not null,
  ip        text not null,
  criado_em timestamptz not null default now()
);
create index if not exists tentativas_ip on tentativas (tipo, ip, criado_em desc);

create table if not exists certificados (
  id            uuid primary key default gen_random_uuid(),
  titulo        text not null,
  instituicao   text not null,
  emitido_em    date,
  carga_horas   int,
  arquivo_url   text,
  credencial_url text,
  criado_em     timestamptz not null default now()
);
create index if not exists certificados_data on certificados (emitido_em desc nulls last);
