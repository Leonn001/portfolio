import { describe, expect, it } from 'vitest';
import { errosPorCampo, postSchema, recomendacaoSchema } from '@/lib/validacao';

const valida = {
  nome: 'Lucas Anjos',
  cargo: 'Desenvolvedor',
  empresa: 'Grupo Line',
  relacao: 'Trabalhamos juntos',
  texto: 'O Leon pega um processo bagunçado e devolve um sistema que a equipe usa de verdade.',
  linkedin: '',
};

describe('recomendacaoSchema', () => {
  it('aceita uma recomendação completa e transforma LinkedIn vazio em null', () => {
    const r = recomendacaoSchema.parse(valida);
    expect(r.linkedin).toBeNull();
  });

  it('aceita LinkedIn de perfil', () => {
    expect(recomendacaoSchema.parse({ ...valida, linkedin: 'https://www.linkedin.com/in/lucas-anjos-5a8a35143/' }).linkedin).toContain('linkedin.com/in/');
  });

  it('recusa link que não é perfil do LinkedIn', () => {
    const r = recomendacaoSchema.safeParse({ ...valida, linkedin: 'https://site-estranho.com/in/x' });
    expect(r.success).toBe(false);
    if (!r.success) expect(errosPorCampo(r.error).linkedin).toMatch(/link do perfil/);
  });

  it('recusa texto curto demais e relação fora da lista', () => {
    const r = recomendacaoSchema.safeParse({ ...valida, texto: 'top', relacao: 'Primo' });
    expect(r.success).toBe(false);
    if (!r.success) {
      const erros = errosPorCampo(r.error);
      expect(erros.texto).toBeTruthy();
      expect(erros.relacao).toBeTruthy();
    }
  });

  it('recusa texto acima de 1.200 caracteres', () => {
    expect(recomendacaoSchema.safeParse({ ...valida, texto: 'a'.repeat(1201) }).success).toBe(false);
  });
});

describe('postSchema', () => {
  const post = { titulo: 'Como fiz a LineAI', slug: 'como-fiz-a-lineai', resumo: '', conteudo: 'texto', capaUrl: '' };

  it('aceita post e capa vazia vira null', () => {
    expect(postSchema.parse(post).capaUrl).toBeNull();
  });

  it('recusa endereço com espaço ou maiúscula', () => {
    expect(postSchema.safeParse({ ...post, slug: 'Como Fiz' }).success).toBe(false);
  });

  it('recusa capa com javascript:', () => {
    expect(postSchema.safeParse({ ...post, capaUrl: 'javascript:alert(1)' }).success).toBe(false);
  });
});
