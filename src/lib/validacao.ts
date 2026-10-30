import { z } from 'zod';

export const RELACOES = [
  'Trabalhamos juntos',
  'Fui gestor(a) do Leon',
  'Fui cliente do Leon',
  'Estudamos juntos',
  'Fui professor(a) do Leon',
  'Outra',
] as const;

const linkedinOpcional = z
  .string()
  .trim()
  .max(300)
  .transform(v => (v === '' ? null : v))
  .refine(v => v === null || /^https:\/\/([a-z]{2,3}\.)?linkedin\.com\/in\/[^\s/]+\/?$/i.test(v), {
    message: 'Use o link do perfil, ex.: https://www.linkedin.com/in/seu-nome',
  });

export const recomendacaoSchema = z.object({
  nome: z.string().trim().min(3, 'Escreva seu nome.').max(80),
  cargo: z.string().trim().min(2, 'Escreva seu cargo.').max(80),
  empresa: z.string().trim().max(80).default(''),
  relacao: z.enum(RELACOES, { message: 'Escolha como vocês se conhecem.' }),
  texto: z.string().trim().min(40, 'Escreva pelo menos umas duas frases.').max(1200, 'Use no máximo 1.200 caracteres.'),
  linkedin: linkedinOpcional,
});

export type RecomendacaoEntrada = z.infer<typeof recomendacaoSchema>;

export const postSchema = z.object({
  titulo: z.string().trim().min(3, 'Escreva um título.').max(140),
  slug: z
    .string()
    .trim()
    .max(80)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use só letras minúsculas, números e hífen.'),
  resumo: z.string().trim().max(300).default(''),
  conteudo: z.string().max(100_000).default(''),
  capaUrl: z
    .string()
    .trim()
    .max(500)
    .transform(v => (v === '' ? null : v))
    .refine(v => v === null || /^(https:\/\/|\/)/.test(v), { message: 'Use um link https ou um caminho do site.' }),
});

export type PostEntrada = z.infer<typeof postSchema>;

const linkOpcional = z
  .string()
  .trim()
  .max(500)
  .transform(v => (v === '' ? null : v))
  .refine(v => v === null || /^(https:\/\/|\/)/.test(v), { message: 'Use um link https.' });

export const certificadoSchema = z.object({
  titulo: z.string().trim().min(3, 'Escreva o nome do certificado.').max(140),
  instituicao: z.string().trim().min(2, 'Escreva a instituição.').max(80),
  emitidoEm: z
    .string()
    .trim()
    .transform(v => (v === '' ? null : v))
    .refine(v => v === null || /^\d{4}-(0[1-9]|1[0-2])$/.test(v), { message: 'Use mês e ano.' }),
  cargaHoras: z
    .string()
    .trim()
    .transform(v => (v === '' ? null : Number(v)))
    .refine(v => v === null || (Number.isInteger(v) && v > 0 && v <= 2000), { message: 'Use um número de horas.' }),
  arquivoUrl: linkOpcional,
  credencialUrl: linkOpcional,
  logoUrl: linkOpcional,
});

export type CertificadoEntrada = z.infer<typeof certificadoSchema>;

/** Primeira mensagem de erro de cada campo, para mostrar no formulário. */
export function errosPorCampo(erro: z.ZodError): Record<string, string> {
  const saida: Record<string, string> = {};
  for (const i of erro.issues) {
    const campo = String(i.path[0] ?? '');
    if (!saida[campo]) saida[campo] = i.message;
  }
  return saida;
}
