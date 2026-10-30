import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { sql } from './db';

export type Recomendacao = {
  id: string;
  nome: string;
  cargo: string;
  empresa: string;
  relacao: string;
  texto: string;
  linkedin: string | null;
  status: 'pendente' | 'aprovada' | 'oculta';
  criadaEm: string;
};

type Linha = {
  id: string; nome: string; cargo: string; empresa: string; relacao: string; texto: string;
  linkedin: string | null; status: Recomendacao['status']; criado_em: Date;
};

const mapear = (l: Linha): Recomendacao => ({
  id: l.id, nome: l.nome, cargo: l.cargo, empresa: l.empresa, relacao: l.relacao, texto: l.texto,
  linkedin: l.linkedin, status: l.status, criadaEm: l.criado_em.toISOString(),
});

export const TAG_RECOMENDACOES = 'recomendacoes';

export async function listarAprovadas(): Promise<Recomendacao[]> {
  'use cache';
  cacheTag(TAG_RECOMENDACOES);
  cacheLife('days');
  const linhas = await sql<Linha[]>`
    select id, nome, cargo, empresa, relacao, texto, linkedin, status, criado_em
    from recomendacoes where status = 'aprovada' order by aprovada_em desc nulls last, criado_em desc`;
  return linhas.map(mapear);
}

export async function listarParaAdmin(): Promise<Recomendacao[]> {
  const linhas = await sql<Linha[]>`
    select id, nome, cargo, empresa, relacao, texto, linkedin, status, criado_em
    from recomendacoes order by (status = 'pendente') desc, criado_em desc`;
  return linhas.map(mapear);
}

export async function contarPendentes(): Promise<number> {
  const [{ total }] = await sql<{ total: number }[]>`select count(*)::int as total from recomendacoes where status = 'pendente'`;
  return total;
}
