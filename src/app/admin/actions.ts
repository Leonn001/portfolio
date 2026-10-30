'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { sql } from '@/lib/db';
import { passouDoLimite } from '@/lib/limite';
import { TAG_POSTS } from '@/lib/posts';
import { TAG_RECOMENDACOES } from '@/lib/recomendacoes';
import { senhaConfere } from '@/lib/senha';
import { abrirSessao, exigirAdmin, fecharSessao, ipDaRequisicao } from '@/lib/sessao';
import { errosPorCampo, postSchema } from '@/lib/validacao';

// ---------- login ----------

export async function entrar(_: { erro?: string }, form: FormData): Promise<{ erro?: string }> {
  const ip = await ipDaRequisicao();
  if (await passouDoLimite('login', ip, 5, 15)) return { erro: 'Muitas tentativas. Espere 15 minutos.' };
  if (!senhaConfere(String(form.get('senha') ?? ''), process.env.ADMIN_PASSWORD_HASH)) return { erro: 'Senha incorreta.' };
  await abrirSessao();
  redirect('/admin');
}

export async function sair(): Promise<void> {
  await fecharSessao();
  redirect('/admin/login');
}

// ---------- posts ----------

export type EstadoPost = { erro?: string; campos?: Record<string, string>; salvoEm?: string };

export async function salvarPost(_: EstadoPost, form: FormData): Promise<EstadoPost> {
  await exigirAdmin();
  const id = String(form.get('id') ?? '');
  const acao = String(form.get('acao') ?? 'rascunho'); // rascunho | publicar | despublicar
  const resultado = postSchema.safeParse({
    titulo: form.get('titulo') ?? '',
    slug: form.get('slug') ?? '',
    resumo: form.get('resumo') ?? '',
    conteudo: form.get('conteudo') ?? '',
    capaUrl: form.get('capaUrl') ?? '',
  });
  if (!resultado.success) return { campos: errosPorCampo(resultado.error) };
  const p = resultado.data;

  if (acao === 'publicar' && p.conteudo.trim().length < 50) return { erro: 'Escreva o texto antes de publicar.' };

  const [repetido] = await sql`select 1 from posts where slug = ${p.slug} and id::text <> ${id || '-'}`;
  if (repetido) return { campos: { slug: 'Já existe um post com esse endereço.' } };

  let postId = id;
  if (!postId) {
    const [novo] = await sql<{ id: string }[]>`
      insert into posts (slug, titulo, resumo, conteudo, capa_url)
      values (${p.slug}, ${p.titulo}, ${p.resumo}, ${p.conteudo}, ${p.capaUrl}) returning id`;
    postId = novo.id;
  } else {
    await sql`
      update posts set slug = ${p.slug}, titulo = ${p.titulo}, resumo = ${p.resumo}, conteudo = ${p.conteudo},
        capa_url = ${p.capaUrl}, atualizado_em = now()
      where id = ${postId}`;
  }

  if (acao === 'publicar') {
    await sql`update posts set publicado = true, publicado_em = coalesce(publicado_em, now()) where id = ${postId}`;
  } else if (acao === 'despublicar') {
    await sql`update posts set publicado = false where id = ${postId}`;
  }

  updateTag(TAG_POSTS);
  if (!id) redirect(`/admin/posts/${postId}`);
  return { salvoEm: new Date().toISOString() };
}

export async function excluirPost(form: FormData): Promise<void> {
  await exigirAdmin();
  const id = String(form.get('id') ?? '');
  await sql`delete from posts where id::text = ${id}`;
  updateTag(TAG_POSTS);
  redirect('/admin');
}

// ---------- recomendações ----------

export async function moderarRecomendacao(form: FormData): Promise<void> {
  await exigirAdmin();
  const id = String(form.get('id') ?? '');
  const acao = String(form.get('acao') ?? '');
  if (acao === 'aprovar') {
    await sql`update recomendacoes set status = 'aprovada', aprovada_em = coalesce(aprovada_em, now()) where id::text = ${id}`;
  } else if (acao === 'ocultar') {
    await sql`update recomendacoes set status = 'oculta' where id::text = ${id}`;
  } else if (acao === 'excluir') {
    await sql`delete from recomendacoes where id::text = ${id}`;
  }
  updateTag(TAG_RECOMENDACOES);
  redirect('/admin/recomendacoes');
}
