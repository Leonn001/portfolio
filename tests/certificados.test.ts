import { describe, expect, it } from 'vitest';
import { ehPdf, mesAno } from '@/lib/texto';
import { certificadoSchema, errosPorCampo } from '@/lib/validacao';

const base = { titulo: 'Introdução ao Pentest na Prática', instituicao: 'DESEC', emitidoEm: '', cargaHoras: '', arquivoUrl: '', credencialUrl: '', logoUrl: '' };

describe('certificadoSchema', () => {
  it('campos opcionais vazios viram null', () => {
    const c = certificadoSchema.parse(base);
    expect(c.emitidoEm).toBeNull();
    expect(c.cargaHoras).toBeNull();
    expect(c.arquivoUrl).toBeNull();
  });

  it('aceita mês, horas e links https', () => {
    const c = certificadoSchema.parse({ ...base, emitidoEm: '2026-03', cargaHoras: '40', arquivoUrl: 'https://x.blob.vercel-storage.com/certificados/a.pdf' });
    expect(c.emitidoEm).toBe('2026-03');
    expect(c.cargaHoras).toBe(40);
  });

  it('recusa mês inválido, horas não numéricas e link javascript:', () => {
    const r = certificadoSchema.safeParse({ ...base, emitidoEm: '2026-13', cargaHoras: 'quarenta', credencialUrl: 'javascript:alert(1)' });
    expect(r.success).toBe(false);
    if (!r.success) {
      const e = errosPorCampo(r.error);
      expect(e.emitidoEm).toBeTruthy();
      expect(e.cargaHoras).toBeTruthy();
      expect(e.credencialUrl).toBeTruthy();
    }
  });
});

describe('mesAno e ehPdf', () => {
  it('formata mês e ano', () => {
    expect(mesAno('2026-03')).toBe('mar 2026');
    expect(mesAno(null)).toBe('');
  });
  it('reconhece PDF pela extensão', () => {
    expect(ehPdf('https://x/certificados/a.pdf')).toBe(true);
    expect(ehPdf('https://x/certificados/a.PDF?download=1')).toBe(true);
    expect(ehPdf('https://x/certificados/a.png')).toBe(false);
  });
});
