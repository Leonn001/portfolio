'use server';

import { sql } from '@/lib/db';
import { passouDoLimite } from '@/lib/limite';
import { ipDaRequisicao } from '@/lib/sessao';
import { errosPorCampo, recomendacaoSchema } from '@/lib/validacao';

export type EstadoRecomendacao = {
  ok?: boolean;
  erro?: string;
  campos?: Record<string, string>;
  valores?: Record<string, string>;
};

export async function enviarRecomendacao(_: EstadoRecomendacao, form: FormData): Promise<EstadoRecomendacao> {
  const valores = Object.fromEntries(
    ['nome', 'cargo', 'empresa', 'relacao', 'texto', 'linkedin'].map(k => [k, String(form.get(k) ?? '')]),
  );

  // Campo invisível: gente não preenche, robô sim. Finge que deu certo.
  if (String(form.get('site') ?? '') !== '') return { ok: true };

  const resultado = recomendacaoSchema.safeParse(valores);
  if (!resultado.success) return { campos: errosPorCampo(resultado.error), valores };

  const ip = await ipDaRequisicao();
  if (await passouDoLimite('recomendacao', ip, 3, 60 * 24)) {
    return { erro: 'Recebemos várias recomendações daqui hoje. Tente de novo amanhã.', valores };
  }

  const r = resultado.data;
  await sql`
    insert into recomendacoes (nome, cargo, empresa, relacao, texto, linkedin, ip)
    values (${r.nome}, ${r.cargo}, ${r.empresa}, ${r.relacao}, ${r.texto}, ${r.linkedin}, ${ip})`;
  return { ok: true };
}
