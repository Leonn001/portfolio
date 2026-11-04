/** Funções puras de texto, usadas no servidor e no navegador. */

export function slugify(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Minutos de leitura, a ~200 palavras por minuto. Nunca menos de 1. */
export function minutosDeLeitura(markdown: string): number {
  const palavras = markdown.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palavras / 200));
}

const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** "30 out 2026", no fuso de São Paulo. */
export function dataCurta(data: Date | string): string {
  const d = new Date(data);
  const partes = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', day: 'numeric', month: 'numeric', year: 'numeric' })
    .formatToParts(d);
  const v = (t: string) => Number(partes.find(p => p.type === t)?.value);
  return `${v('day')} ${meses[v('month') - 1]} ${v('year')}`;
}

export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '?';
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

/** "2026-03" -> "mar 2026" */
export function mesAno(valor: string | null): string {
  const m = valor?.match(/^(\d{4})-(\d{2})$/);
  return m ? `${meses[Number(m[2]) - 1]} ${m[1]}` : '';
}

export function ehPdf(url: string | null): boolean {
  return !!url && /\.pdf($|\?)/i.test(url);
}

/** Identifica vídeo pela extensão, ignorando parâmetros da URL. */
export const ehVideo = (url: string) => /\.(mp4|webm)(\?.*)?$/i.test(url);
