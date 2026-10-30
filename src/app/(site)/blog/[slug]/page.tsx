import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Markdown } from '@/components/Markdown';
import { perfil } from '@/conteudo/perfil';
import { buscarPublicado } from '@/lib/posts';
import { dataCurta } from '@/lib/texto';

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const post = await buscarPublicado((await params).slug);
  if (!post) return { title: 'Post não encontrado' };
  return {
    title: post.titulo,
    description: post.resumo || undefined,
    openGraph: { type: 'article', title: post.titulo, description: post.resumo || undefined, images: post.capaUrl ? [post.capaUrl] : undefined },
  };
}

export default function PostPage({ params }: PageProps<'/blog/[slug]'>) {
  return (
    <article className="secao" style={{ paddingTop: 64 }}>
      <div className="wrap" style={{ maxWidth: 760 }}>
        <Link href="/blog" className="mono" style={{ fontSize: 13, color: 'var(--texto-3)' }}>← todos os posts</Link>
        <Suspense fallback={<p style={{ marginTop: 32, color: 'var(--texto-3)' }}>Carregando…</p>}>
          <Conteudo params={params} />
        </Suspense>
      </div>
    </article>
  );
}

async function Conteudo({ params }: { params: PageProps<'/blog/[slug]'>['params'] }) {
  const post = await buscarPublicado((await params).slug);
  if (!post) notFound();
  return (
    <>
      <header style={{ margin: '28px 0 36px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <span className="mono" style={{ fontSize: 13, color: 'var(--texto-3)' }}>
          {dataCurta(post.publicadoEm)} · {post.minutos} min de leitura
        </span>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: 1.1, letterSpacing: '-0.035em', fontWeight: 700 }}>{post.titulo}</h1>
        {post.resumo && <p className="subtitulo" style={{ fontSize: 19 }}>{post.resumo}</p>}
      </header>
      {post.capaUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.capaUrl} alt="" style={{ width: '100%', borderRadius: 16, border: '1px solid var(--borda)', marginBottom: 36 }} />
      )}
      <Markdown texto={post.conteudo} />
      <footer className="cartao" style={{ marginTop: 56, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ margin: 0 }}>Escrito por <strong style={{ color: 'var(--texto)' }}>{perfil.nome}</strong>. Gostou? Vamos conversar.</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a className="botao botao-pequeno" href={perfil.linkedin} target="_blank" rel="noopener">LinkedIn</a>
          <a className="botao botao-pequeno" href={perfil.whatsapp} target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </footer>
    </>
  );
}
