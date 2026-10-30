import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { sql } from './db';

export type Certificado = {
  id: string;
  titulo: string;
  instituicao: string;
  /** "2026-03" (mês de emissão) ou null */
  emitidoEm: string | null;
  cargaHoras: number | null;
  arquivoUrl: string | null;
  credencialUrl: string | null;
  /** Logo da instituição, mostrada quando não há imagem do certificado */
  logoUrl: string | null;
};

type Linha = {
  id: string; titulo: string; instituicao: string; emitido_em: Date | null; carga_horas: number | null;
  arquivo_url: string | null; credencial_url: string | null; logo_url: string | null;
};

const mapear = (l: Linha): Certificado => ({
  id: l.id, titulo: l.titulo, instituicao: l.instituicao,
  emitidoEm: l.emitido_em ? l.emitido_em.toISOString().slice(0, 7) : null,
  cargaHoras: l.carga_horas, arquivoUrl: l.arquivo_url, credencialUrl: l.credencial_url, logoUrl: l.logo_url,
});

export const TAG_CERTIFICADOS = 'certificados';

export async function listarCertificados(): Promise<Certificado[]> {
  'use cache';
  cacheTag(TAG_CERTIFICADOS);
  cacheLife('days');
  return (await sql<Linha[]>`select * from certificados order by emitido_em desc nulls last, criado_em desc`).map(mapear);
}

// --- admin (sem cache) ---

export async function listarCertificadosAdmin(): Promise<Certificado[]> {
  return (await sql<Linha[]>`select * from certificados order by emitido_em desc nulls last, criado_em desc`).map(mapear);
}

export async function buscarCertificado(id: string): Promise<Certificado | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [l] = await sql<Linha[]>`select * from certificados where id = ${id}`;
  return l ? mapear(l) : null;
}
