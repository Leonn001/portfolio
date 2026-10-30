import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

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
          // eslint-disable-next-line @next/next/no-img-element
          img: ({ src, alt }) => <img src={typeof src === 'string' ? src : ''} alt={alt ?? ''} loading="lazy" />,
        }}
      >
        {texto}
      </ReactMarkdown>
    </div>
  );
}
