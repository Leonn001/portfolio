'use client';

import Link from 'next/link';
import { useActionState, useEffect, useRef, useState } from 'react';
import { Markdown } from '@/components/Markdown';
import type { PostAdmin } from '@/lib/posts';
import { minutosDeLeitura, slugify } from '@/lib/texto';
import { excluirPost, salvarPost, type EstadoPost } from '../../actions';

async function enviarImagem(arquivo: File): Promise<string> {
  const dados = new FormData();
  dados.append('arquivo', arquivo);
  dados.append('pasta', 'blog');
  const resp = await fetch('/api/upload', { method: 'POST', body: dados });
  const json = (await resp.json().catch(() => ({}))) as { url?: string; erro?: string };
  if (!resp.ok || !json.url) throw new Error(json.erro ?? 'Não consegui enviar a imagem.');
  return json.url;
}

export function Editor({ post }: { post: PostAdmin | null }) {
  const [estado, salvar, salvando] = useActionState<EstadoPost, FormData>(salvarPost, {});
  const [titulo, setTitulo] = useState(post?.titulo ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugManual, setSlugManual] = useState(!!post);
  const [resumo, setResumo] = useState(post?.resumo ?? '');
  const [capa, setCapa] = useState(post?.capaUrl ?? '');
  const [conteudo, setConteudo] = useState(post?.conteudo ?? '');
  const [modo, setModo] = useState<'escrever' | 'ver'>('escrever');
  // guarda qual "salvoEm" estava valendo quando a pessoa editou; salvar de novo muda o salvoEm e limpa
  const [editadoNoSalvo, setEditadoNoSalvo] = useState<string | null>(null);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [erroImagem, setErroImagem] = useState('');
  const texto = useRef<HTMLTextAreaElement>(null);
  const e = estado.campos ?? {};

  const mudou = editadoNoSalvo !== null && editadoNoSalvo === (estado.salvoEm ?? '');
  const marcarMudou = () => setEditadoNoSalvo(estado.salvoEm ?? '');

  useEffect(() => {
    if (!mudou) return;
    const avisar = (ev: BeforeUnloadEvent) => ev.preventDefault();
    window.addEventListener('beforeunload', avisar);
    return () => window.removeEventListener('beforeunload', avisar);
  }, [mudou]);

  const marcar = <T,>(set: (v: T) => void) => (v: T) => { set(v); marcarMudou(); };

  function envolver(antes: string, depois = antes, exemplo = 'texto') {
    const el = texto.current;
    if (!el) return;
    const { selectionStart: i, selectionEnd: f } = el;
    const selecionado = conteudo.slice(i, f) || exemplo;
    const novo = conteudo.slice(0, i) + antes + selecionado + depois + conteudo.slice(f);
    setConteudo(novo);
    marcarMudou();
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(i + antes.length, i + antes.length + selecionado.length);
    });
  }

  function inserirLinha(prefixo: string) {
    const el = texto.current;
    if (!el) return;
    const i = el.selectionStart;
    const inicioLinha = conteudo.lastIndexOf('\n', i - 1) + 1;
    setConteudo(conteudo.slice(0, inicioLinha) + prefixo + conteudo.slice(inicioLinha));
    marcarMudou();
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(i + prefixo.length, i + prefixo.length); });
  }

  async function subirImagem(arquivo: File | undefined, destino: 'texto' | 'capa') {
    if (!arquivo) return;
    setErroImagem('');
    setEnviandoImagem(true);
    try {
      const url = await enviarImagem(arquivo);
      if (destino === 'capa') { setCapa(url); marcarMudou(); }
      else envolver(`![`, `](${url})`, arquivo.name.replace(/\.[^.]+$/, ''));
    } catch (err) {
      setErroImagem(err instanceof Error ? err.message : 'Não consegui enviar a imagem.');
    } finally {
      setEnviandoImagem(false);
    }
  }

  const publicado = post?.publicado ?? false;
  const salvoAs = estado.salvoEm ? new Date(estado.salvoEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/admin" className="mono" style={{ fontSize: 13, color: 'var(--texto-3)' }}>← posts</Link>
        <span style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className={`chip chip-ponto${publicado ? '' : ' chip-cinza'}`}>{publicado ? 'Publicado' : 'Rascunho'}</span>
          <span className="mono" style={{ fontSize: 12, color: 'var(--texto-3)' }}>
            {mudou ? 'alterações não salvas' : salvoAs ? `salvo às ${salvoAs}` : ''} · {minutosDeLeitura(conteudo)} min de leitura
          </span>
          {publicado && post && <Link className="botao botao-pequeno" href={`/blog/${post.slug}`} target="_blank">Ver no site ↗</Link>}
        </span>
      </div>

      <form action={salvar} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <input type="hidden" name="id" value={post?.id ?? ''} />
        <input type="hidden" name="conteudo" value={conteudo} />
        <input type="hidden" name="capaUrl" value={capa} />

        {estado.erro && <div className="aviso aviso-erro" role="alert">{estado.erro}</div>}

        <div className="campo">
          <label htmlFor="titulo">Título</label>
          <input
            id="titulo" name="titulo" value={titulo} style={{ fontSize: 22, fontWeight: 600 }}
            onChange={ev => { marcar(setTitulo)(ev.target.value); if (!slugManual) setSlug(slugify(ev.target.value)); }}
          />
          {e.titulo && <span className="erro">{e.titulo}</span>}
        </div>

        <div className="grade-2">
          <div className="campo">
            <label htmlFor="slug">Endereço</label>
            <input id="slug" name="slug" value={slug} className="mono" onChange={ev => { setSlugManual(true); marcar(setSlug)(slugify(ev.target.value)); }} />
            {e.slug ? <span className="erro">{e.slug}</span> : <span className="dica mono">/blog/{slug || '...'}</span>}
          </div>
          <div className="campo">
            <label htmlFor="capa">Imagem de capa (opcional)</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input id="capa" value={capa} onChange={ev => marcar(setCapa)(ev.target.value)} placeholder="https://… ou envie uma imagem" />
              <label className="botao botao-pequeno" style={{ height: 'auto', flexShrink: 0 }}>
                Enviar
                <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={ev => subirImagem(ev.target.files?.[0], 'capa')} />
              </label>
            </div>
            {e.capaUrl && <span className="erro">{e.capaUrl}</span>}
          </div>
        </div>

        <div className="campo">
          <label htmlFor="resumo">Resumo (aparece no card e no compartilhamento)</label>
          <textarea id="resumo" name="resumo" rows={2} maxLength={300} value={resumo} onChange={ev => marcar(setResumo)(ev.target.value)} style={{ minHeight: 0 }} />
          {e.resumo && <span className="erro">{e.resumo}</span>}
        </div>

        <div className="campo">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <button type="button" className={`botao botao-pequeno${modo === 'escrever' ? ' botao-primario' : ''}`} onClick={() => setModo('escrever')}>Escrever</button>
              <button type="button" className={`botao botao-pequeno${modo === 'ver' ? ' botao-primario' : ''}`} onClick={() => setModo('ver')}>Pré-visualizar</button>
            </div>
            {modo === 'escrever' && (
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }} aria-label="Formatação">
                <button type="button" className="botao botao-pequeno" title="Subtítulo" onClick={() => inserirLinha('## ')}>T</button>
                <button type="button" className="botao botao-pequeno" title="Negrito" onClick={() => envolver('**')}><b>B</b></button>
                <button type="button" className="botao botao-pequeno" title="Itálico" onClick={() => envolver('_')}><i>I</i></button>
                <button type="button" className="botao botao-pequeno" title="Link" onClick={() => envolver('[', '](https://)', 'texto do link')}>Link</button>
                <button type="button" className="botao botao-pequeno" title="Lista" onClick={() => inserirLinha('- ')}>• Lista</button>
                <button type="button" className="botao botao-pequeno" title="Citação" onClick={() => inserirLinha('> ')}>“ ”</button>
                <button type="button" className="botao botao-pequeno mono" title="Código" onClick={() => envolver('\n```\n', '\n```\n', 'código')}>{'</>'}</button>
                <label className="botao botao-pequeno" title="Imagem">
                  {enviandoImagem ? 'Enviando…' : 'Imagem'}
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={ev => subirImagem(ev.target.files?.[0], 'texto')} />
                </label>
              </div>
            )}
          </div>
          {erroImagem && <span className="erro">{erroImagem}</span>}
          {modo === 'escrever' ? (
            <textarea
              ref={texto}
              aria-label="Texto do post"
              value={conteudo}
              onChange={ev => marcar(setConteudo)(ev.target.value)}
              className="mono"
              style={{ minHeight: 480, fontSize: 14, lineHeight: 1.7 }}
              placeholder={'Escreva em Markdown.\n\n## Um subtítulo\n\nUm parágrafo com **negrito** e um [link](https://...).'}
            />
          ) : (
            <div className="cartao" style={{ minHeight: 480, padding: 28 }}>
              {conteudo.trim() ? <Markdown texto={conteudo} /> : <p>Nada escrito ainda.</p>}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', position: 'sticky', bottom: 0, padding: '14px 0', background: 'linear-gradient(transparent, var(--fundo) 30%)' }}>
          {publicado ? (
            <>
              <button className="botao botao-primario" type="submit" name="acao" value="publicar" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar'}</button>
              <button className="botao" type="submit" name="acao" value="despublicar" disabled={salvando}>Voltar para rascunho</button>
            </>
          ) : (
            <>
              <button className="botao" type="submit" name="acao" value="rascunho" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar rascunho'}</button>
              <button className="botao botao-primario" type="submit" name="acao" value="publicar" disabled={salvando}>Publicar</button>
            </>
          )}
        </div>
      </form>

      {post && (
        <form
          action={excluirPost}
          onSubmit={ev => { if (!confirm('Excluir este post de vez? Não dá para desfazer.')) ev.preventDefault(); }}
          style={{ borderTop: '1px solid var(--borda)', paddingTop: 20 }}
        >
          <input type="hidden" name="id" value={post.id} />
          <button className="botao botao-pequeno botao-perigo" type="submit">Excluir post</button>
        </form>
      )}
    </div>
  );
}
