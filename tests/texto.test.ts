import { describe, expect, it } from 'vitest';
import { dataCurta, iniciais, minutosDeLeitura, slugify } from '@/lib/texto';

describe('slugify', () => {
  it('tira acento, maiúscula e símbolo', () => {
    expect(slugify('Como construí a LineAI: IA dentro do Line Gestão!')).toBe('como-construi-a-lineai-ia-dentro-do-line-gestao');
  });
  it('não deixa hífen sobrando nas pontas', () => {
    expect(slugify('  --Olá--  ')).toBe('ola');
  });
});

describe('minutosDeLeitura', () => {
  it('nunca é menos de 1', () => {
    expect(minutosDeLeitura('')).toBe(1);
  });
  it('conta ~200 palavras por minuto e ignora bloco de código', () => {
    const texto = 'palavra '.repeat(600) + '\n```\n' + 'codigo '.repeat(1000) + '\n```';
    expect(minutosDeLeitura(texto)).toBe(3);
  });
});

describe('dataCurta', () => {
  it('usa o fuso de São Paulo', () => {
    // 02:00 UTC do dia 31 ainda é dia 30 em São Paulo
    expect(dataCurta('2026-10-31T02:00:00Z')).toBe('30 out 2026');
  });
});

describe('iniciais', () => {
  it('primeira e última palavra', () => {
    expect(iniciais('Eduardo Lopes da Silva')).toBe('ES');
    expect(iniciais('lucas')).toBe('L');
  });
});
