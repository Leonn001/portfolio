import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { ehVideo } from '@/lib/texto';

/** Renderiza o markdown dos posts. HTML cru no texto é ignorado (react-markdown não o interpreta). */
export function Markdown({ texto }: { texto: string }) {
  return (
    <div className="prosa">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={{
          a: ({ href, children }) => {
            const externo = href?.startsWith('http');
            return (
              <a href={href} {...(externo ? { target: '_blank', rel: 'noopener' } : {})}>
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => {
            const url = typeof src === 'string' ? src : '';
            // Vídeo entra no post com a mesma sintaxe de imagem: ![descrição](arquivo.mp4)
            if (ehVideo(url)) return <video src={url} controls playsInline preload="metadata" aria-label={alt ?? ''} style={{ width: '100%', borderRadius: 8 }} />;
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={url} alt={alt ?? ''} loading="lazy" />;
          },
        }}
      >
        {texto}
      </ReactMarkdown>
    </div>
  );
}
