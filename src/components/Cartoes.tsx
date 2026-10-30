import Link from 'next/link';
import type { Certificado } from '@/lib/certificados';
import type { PostResumo } from '@/lib/posts';
import type { Recomendacao } from '@/lib/recomendacoes';
import { dataCurta, ehPdf, iniciais, mesAno } from '@/lib/texto';

export function CartaoPost({ post, i = 0 }: { post: PostResumo; i?: number }) {
  return (
    <Link href={`/blog/${post.slug}`} className="cartao surge" style={{ display: 'flex', flexDirection: 'column', gap: 12, ['--i' as string]: i }}>
      {post.capaUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.capaUrl}
          alt=""
          loading="lazy"
          style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: 10, border: '1px solid var(--borda)' }}
        />
      )}
      <span className="mono" style={{ fontSize: 12, color: 'var(--texto-3)' }}>
        {dataCurta(post.publicadoEm)} · {post.minutos} min de leitura
      </span>
      <h3 style={{ fontSize: 19, lineHeight: 1.3, margin: 0 }}>{post.titulo}</h3>
      {post.resumo && <p>{post.resumo}</p>}
      <span className="link-seta" style={{ marginTop: 'auto', alignSelf: 'flex-start', fontSize: 14 }}>
        Ler post →
      </span>
    </Link>
  );
}

export function CartaoRecomendacao({ r, i = 0 }: { r: Recomendacao; i?: number }) {
  const quem = [r.cargo, r.empresa].filter(Boolean).join(' · ');
  return (
    <figure className="cartao surge" style={{ display: 'flex', flexDirection: 'column', gap: 18, breakInside: 'avoid', marginBottom: 16, ['--i' as string]: i }}>
      <svg width="28" height="22" viewBox="0 0 28 22" aria-hidden="true" style={{ opacity: 0.6 }}>
        <defs>
          <linearGradient id={`aspas-${r.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#4f6bff" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#aspas-${r.id})`}
          d="M0 22V13.2C0 5.9 4 1.5 11 0l1.3 2.9C8.6 4.1 6.6 6.6 6.3 10H11v12H0Zm16 0V13.2C16 5.9 20 1.5 27 0l1 2.9c-3.7 1.2-5.7 3.7-6 7.1H27v12H16Z"
        />
      </svg>
      <blockquote style={{ fontSize: 16, lineHeight: 1.7, color: '#d6d6e2', whiteSpace: 'pre-line' }}>{r.texto}</blockquote>
      <figcaption style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          aria-hidden="true"
          style={{
            width: 40, height: 40, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0,
            background: 'var(--gradiente)', fontWeight: 600, fontSize: 14, color: '#fff',
          }}
        >
          {iniciais(r.nome)}
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {r.linkedin ? (
            <a href={r.linkedin} target="_blank" rel="noopener" style={{ fontWeight: 600 }}>
              {r.nome} <span style={{ color: 'var(--texto-3)', fontWeight: 400 }}>↗</span>
            </a>
          ) : (
            <span style={{ fontWeight: 600 }}>{r.nome}</span>
          )}
          <span style={{ fontSize: 13, color: 'var(--texto-2)' }}>{quem}</span>
          <span className="mono" style={{ fontSize: 12, color: 'var(--texto-3)' }}>{r.relacao}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function CartaoCertificado({ c, i = 0 }: { c: Certificado; i?: number }) {
  const detalhes = [c.instituicao, mesAno(c.emitidoEm), c.cargaHoras ? `${c.cargaHoras}h` : ''].filter(Boolean).join(' · ');
  const imagem = c.arquivoUrl && !ehPdf(c.arquivoUrl) ? c.arquivoUrl : null;
  const conteudo = (
    <>
      <div className="certificado-capa">
        {imagem ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imagem} alt={`Certificado: ${c.titulo}`} loading="lazy" />
        ) : c.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.logoUrl} alt={c.instituicao} loading="lazy" className="certificado-logo" />
        ) : (
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="9" r="5" />
            <path d="M9 13.5 7.5 21l4.5-2.5 4.5 2.5-1.5-7.5" />
          </svg>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '16px 18px 18px' }}>
        <h3 style={{ margin: 0, fontSize: 16, lineHeight: 1.35 }}>{c.titulo}</h3>
        <span className="mono" style={{ fontSize: 12, color: 'var(--texto-3)' }}>{detalhes}</span>
        {c.arquivoUrl && <span className="link-seta" style={{ alignSelf: 'flex-start', marginTop: 8, fontSize: 13 }}>Ver certificado</span>}
      </div>
    </>
  );
  return (
    <article className="cartao certificado surge" style={{ ['--i' as string]: i }}>
      {c.arquivoUrl ? (
        <a href={c.arquivoUrl} target="_blank" rel="noopener" style={{ display: 'block' }}>{conteudo}</a>
      ) : (
        conteudo
      )}
      {c.credencialUrl && (
        <a href={c.credencialUrl} target="_blank" rel="noopener" className="mono" style={{ display: 'block', padding: '0 18px 16px', fontSize: 12, color: 'var(--texto-2)' }}>
          Ver na instituição ↗
        </a>
      )}
    </article>
  );
}
