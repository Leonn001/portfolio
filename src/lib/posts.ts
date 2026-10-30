import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { sql } from './db';

export type PostResumo = {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  capaUrl: string | null;
  publicadoEm: string;
  minutos: number;
};

export type Post = PostResumo & { conteudo: string };

export type PostAdmin = {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  capaUrl: string | null;
  publicado: boolean;
  publicadoEm: string | null;
  atualizadoEm: string;
};

type Linha = {
  id: string; slug: string; titulo: string; resumo: string; conteudo: string;
  capa_url: string | null; publicado: boolean; publicado_em: Date | null; atualizado_em: Date;
};

const paraAdmin = (l: Linha): PostAdmin => ({
  id: l.id, slug: l.slug, titulo: l.titulo, resumo: l.resumo, conteudo: l.conteudo,
  capaUrl: l.capa_url, publicado: l.publicado,
  publicadoEm: l.publicado_em?.toISOString() ?? null, atualizadoEm: l.atualizado_em.toISOString(),
});

export const TAG_POSTS = 'posts';

/** Posts publicados, do mais novo para o mais antigo. */
export async function listarPublicados(limite = 50): Promise<PostResumo[]> {
  'use cache';
  cacheTag(TAG_POSTS);
  cacheLife('days');
  const linhas = await sql<(Linha & { palavras: number })[]>`
    select id, slug, titulo, resumo, capa_url, publicado_em,
           array_length(regexp_split_to_array(trim(conteudo), '\s+'), 1) as palavras
    from posts where publicado order by publicado_em desc limit ${limite}`;
  return linhas.map(l => ({
    id: l.id, slug: l.slug, titulo: l.titulo, resumo: l.resumo, capaUrl: l.capa_url,
    publicadoEm: l.publicado_em!.toISOString(),
    minutos: Math.max(1, Math.round((l.palavras ?? 0) / 200)),
  }));
}

export async function buscarPublicado(slug: string): Promise<Post | null> {
  'use cache';
  cacheTag(TAG_POSTS);
  cacheLife('days');
  const [l] = await sql<Linha[]>`select * from posts where slug = ${slug} and publicado`;
  if (!l) return null;
  const palavras = l.conteudo.trim().split(/\s+/).filter(Boolean).length;
  return {
    id: l.id, slug: l.slug, titulo: l.titulo, resumo: l.resumo, capaUrl: l.capa_url, conteudo: l.conteudo,
    publicadoEm: l.publicado_em!.toISOString(), minutos: Math.max(1, Math.round(palavras / 200)),
  };
}

// --- admin (sem cache: sempre o estado atual) ---

export async function listarTodos(): Promise<PostAdmin[]> {
  const linhas = await sql<Linha[]>`select * from posts order by coalesce(publicado_em, criado_em) desc`;
  return linhas.map(paraAdmin);
}

export async function buscarPorId(id: string): Promise<PostAdmin | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [l] = await sql<Linha[]>`select * from posts where id = ${id}`;
  return l ? paraAdmin(l) : null;
}
