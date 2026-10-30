import type { Metadata } from 'next';
import { CartaoPost } from '@/components/Cartoes';
import { listarPublicados } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'O que ando aprendendo construindo sistemas em produção: IA aplicada, deploy, testes e operação.',
};

export default async function BlogPage() {
  const posts = await listarPublicados();
  return (
    <section className="secao" style={{ paddingTop: 72 }}>
      <div className="wrap">
        <header className="secao-cabeca">
          <span className="rotulo">blog</span>
          <h1 className="titulo-secao" style={{ fontSize: 'clamp(34px, 5vw, 52px)' }}>O que ando escrevendo</h1>
          <p className="subtitulo">Bastidores de sistemas em produção: IA aplicada, deploy, testes, banco de dados e o dia a dia com a operação.</p>
        </header>
        {posts.length > 0 ? (
          <div className="grade-3">
            {posts.map((p, i) => <CartaoPost key={p.id} post={p} i={i} />)}
          </div>
        ) : (
          <div className="cartao" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <h3>Os primeiros textos estão chegando</h3>
            <p>Enquanto isso, dá uma olhada na LineAI na página inicial.</p>
          </div>
        )}
      </div>
    </section>
  );
}
