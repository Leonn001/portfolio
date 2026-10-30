import Image from 'next/image';
import Link from 'next/link';
import { CartaoCertificado, CartaoPost, CartaoRecomendacao } from '@/components/Cartoes';
import {
  caseLineGestao, lineAi, metodo, origem, perfil, projetos, stack, trajetoria,
} from '@/conteudo/perfil';
import { listarCertificados } from '@/lib/certificados';
import { listarPublicados } from '@/lib/posts';
import { listarAprovadas } from '@/lib/recomendacoes';

export default function Inicio() {
  return (
    <>
      <Hero />
      <Sobre />
      <CaseLineGestao />
      <LineAi />
      <Projetos />
      <Recomendacoes />
      <Blog />
      <Metodo />
      <StackETrajetoria />
      <Certificados />
      <Contato />
    </>
  );
}

function Hero() {
  return (
    <section className="secao" style={{ paddingTop: 72 }}>
      <div className="wrap">
        <div className="hero">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <h1 className="surge" style={{ ['--i' as string]: 1, fontSize: 'clamp(40px, 7vw, 72px)', lineHeight: 1.02, letterSpacing: '-0.045em', fontWeight: 700 }}>
              Leon Nascimento <span className="gradiente-texto">Moreira</span>
            </h1>
            <p className="mono surge" style={{ ['--i' as string]: 2, color: 'var(--texto-2)', fontSize: 15 }}>
              {perfil.cargo} · {perfil.local}
            </p>
            <p className="surge" style={{ ['--i' as string]: 3, fontSize: 20, lineHeight: 1.5, maxWidth: 560 }}>{perfil.frase}</p>
            <div className="surge" style={{ ['--i' as string]: 4, display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 6 }}>
              <a className="botao botao-primario" href={perfil.cv} download>Baixar CV</a>
              <a className="botao" href={perfil.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a>
            </div>
          </div>

          <div className="hero-lado surge" style={{ ['--i' as string]: 3 }}>
            <div className="hero-foto">
              <Image src="/assets/foto.webp" alt={`Foto de ${perfil.nome}`} width={400} height={400} priority />
            </div>
            <div className="terminal" aria-hidden="true">
              <div className="terminal-barra"><i /><i /><i /><span className="mono">deploy.sh</span></div>
              <pre className="mono">
                <span className="t-cinza">$</span> ./deploy.sh dfff833{'\n'}
                <span className="t-cinza">›</span> backup do banco <span className="t-verde">ok</span>{'\n'}
                <span className="t-cinza">›</span> 1.551 testes <span className="t-verde">passaram</span>{'\n'}
                <span className="t-cinza">›</span> smoke test <span className="t-verde">ok</span>{'\n'}
                <span className="t-violeta">DEPLOY OK</span> no ar
              </pre>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function Sobre() {
  return (
    <section className="secao" id="sobre" style={{ paddingTop: 24 }}>
      <div className="wrap duas-colunas" style={{ alignItems: 'start' }}>
        <CabecaSecao rotulo="sobre mim" titulo="Desenvolvedor de ponta a ponta" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 17, color: 'var(--texto-2)' }}>
          <p>{perfil.apresentacao}</p>
          <p>{origem}</p>
        </div>
      </div>
    </section>
  );
}

function CabecaSecao({ rotulo, titulo, subtitulo }: { rotulo: string; titulo: React.ReactNode; subtitulo?: string }) {
  return (
    <header className="secao-cabeca">
      <span className="rotulo">{rotulo}</span>
      <h2 className="titulo-secao">{titulo}</h2>
      {subtitulo && <p className="subtitulo">{subtitulo}</p>}
    </header>
  );
}

function LineAi() {
  return (
    <section className="secao" id="lineai">
      <div className="wrap">
        <CabecaSecao rotulo="projeto · IA aplicada" titulo={lineAi.titulo} subtitulo={lineAi.chamada} />

        <div className="lineai-grade">
          <div className="lineai-imagem">
            <Image src={lineAi.imagem} alt="Chat da LineAI aberto sobre a tela do Line Gestão, respondendo consumo e franquia de uma linha" width={1672} height={941} sizes="(max-width: 960px) 100vw, 640px" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="mono" style={{ fontSize: 13, color: 'var(--texto-3)' }}>a equipe pergunta assim:</span>
            {lineAi.exemplos.map((e, i) => (
              <div key={e} className="balao surge" style={{ ['--i' as string]: i }}>{e}</div>
            ))}
            <div className="tags" style={{ marginTop: 12 }}>
              {lineAi.stack.map(s => <span key={s} className="tag">{s}</span>)}
            </div>
          </div>
        </div>

        <div className="grade-3" style={{ marginTop: 32 }}>
          {lineAi.decisoes.slice(0, 3).map((d, i) => (
            <article key={d.titulo} className="cartao surge" style={{ ['--i' as string]: i }}>
              <span className="mono" style={{ fontSize: 12, color: 'var(--violeta)' }}>0{i + 1}</span>
              <h3 style={{ marginTop: 8 }}>{d.titulo}</h3>
              <p>{d.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseLineGestao() {
  const c = caseLineGestao;
  return (
    <section className="secao" id="case">
      <div className="wrap">
        <CabecaSecao rotulo="case · Grupo Line" titulo={c.titulo} />
        <div className="grade-3">
          <article className="cartao">
            <span className="rotulo" style={{ fontSize: 12 }}>problema</span>
            <p style={{ marginTop: 10 }}>{c.problema}</p>
          </article>
          <article className="cartao">
            <span className="rotulo" style={{ fontSize: 12 }}>solução</span>
            <p style={{ marginTop: 10 }}>{c.solucao}</p>
          </article>
          <article className="cartao">
            <span className="rotulo" style={{ fontSize: 12 }}>meu papel</span>
            <p style={{ marginTop: 10 }}>
              O sistema foi iniciado por <a className="link-seta" href={c.creditoLink} target="_blank" rel="noopener">Eduardo Lopes</a>.{' '}
              {c.papel}
            </p>
          </article>
        </div>
        <div className="grade-4" style={{ marginTop: 16 }}>
          {c.decisoes.map(d => (
            <article key={d.titulo} className="cartao">
              <h3>{d.titulo}</h3>
              <p>{d.texto}</p>
            </article>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: 24 }}>
          <div className="tags">{c.stack.map(s => <span key={s} className="tag">{s}</span>)}</div>
          <a className="link-seta" href={c.link} target="_blank" rel="noopener">Abrir o Line Gestão ↗</a>
        </div>
      </div>
    </section>
  );
}

function Projetos() {
  return (
    <section className="secao" id="projetos">
      <div className="wrap">
        <CabecaSecao rotulo="projetos" titulo="Outros sistemas e ferramentas" />
        <div className="grade-2">
          {projetos.map((p, i) => (
            <article key={p.nome} className="cartao surge" style={{ ['--i' as string]: i, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <h3 style={{ margin: 0, fontSize: 19 }}>{p.nome}</h3>
                <span className={`chip chip-ponto ${p.status === 'Descontinuado' ? 'chip-cinza' : p.status === 'Mídia' ? 'chip-ambar' : ''}`}>{p.status}</span>
              </div>
              <p>
                {p.credito
                  ? p.texto.split(p.credito.nome).map((parte, j, arr) => (
                      <span key={j}>
                        {parte}
                        {j < arr.length - 1 && <a className="link-seta" href={p.credito!.link} target="_blank" rel="noopener">{p.credito!.nome}</a>}
                      </span>
                    ))
                  : p.texto}
              </p>
              <div className="tags" style={{ marginTop: 'auto' }}>{p.stack.map(s => <span key={s} className="tag">{s}</span>)}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

async function Recomendacoes() {
  const todas = await listarAprovadas();
  const ultimas = todas.slice(0, 6);
  return (
    <section className="secao" id="recomendacoes">
      <div className="wrap">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 40 }}>
          <header className="secao-cabeca" style={{ marginBottom: 0 }}>
            <span className="rotulo">mural</span>
            <h2 className="titulo-secao">O que dizem de trabalhar comigo</h2>
          </header>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {todas.length > ultimas.length && <Link className="botao" href="/recomendacoes">Ver todas ({todas.length})</Link>}
            <Link className="botao" href="/recomendar">Deixar uma recomendação</Link>
          </div>
        </div>
        {ultimas.length > 0 ? (
          <div className="mural">
            {ultimas.map((r, i) => <CartaoRecomendacao key={r.id} r={r} i={i} />)}
          </div>
        ) : (
          <div className="cartao" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <h3>O mural está começando</h3>
            <p style={{ maxWidth: 460, margin: '0 auto 18px' }}>Trabalhou ou estudou comigo? Sua recomendação vai ser a primeira daqui.</p>
            <Link className="botao botao-primario" href="/recomendar">Escrever recomendação</Link>
          </div>
        )}
      </div>
    </section>
  );
}

async function Blog() {
  const posts = await listarPublicados(3);
  if (posts.length === 0) return null;
  return (
    <section className="secao" id="blog">
      <div className="wrap">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 40 }}>
          <header className="secao-cabeca" style={{ marginBottom: 0 }}>
            <span className="rotulo">blog</span>
            <h2 className="titulo-secao">O que ando escrevendo</h2>
          </header>
          <Link className="botao" href="/blog">Todos os posts</Link>
        </div>
        <div className="grade-3">
          {posts.map((p, i) => <CartaoPost key={p.id} post={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}

function Metodo() {
  return (
    <section className="secao" id="metodo">
      <div className="wrap">
        <CabecaSecao rotulo="método" titulo="Como eu trabalho" />
        <div className="grade-4">
          {metodo.map(m => (
            <article key={m.titulo} className="cartao">
              <h3>{m.titulo}</h3>
              <p>{m.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StackETrajetoria() {
  return (
    <section className="secao" id="trajetoria">
      <div className="wrap duas-colunas">
        <div>
          <CabecaSecao rotulo="trajetória" titulo="Minha trajetória" />
          <ol className="linha-tempo">
            {trajetoria.map(t => (
              <li key={t.titulo}>
                <span className="mono" style={{ fontSize: 12, color: 'var(--texto-3)' }}>{t.periodo}</span>
                <h3 style={{ fontSize: 17, fontWeight: 600, margin: '4px 0' }}>{t.titulo}</h3>
                <p style={{ color: 'var(--texto-2)', fontSize: 15 }}>{t.texto}</p>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <CabecaSecao rotulo="stack" titulo="O que uso no dia a dia" />
          <dl style={{ display: 'flex', flexDirection: 'column' }}>
            {stack.map(s => (
              <div key={s.area} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--borda)' }}>
                <dt className="mono" style={{ fontSize: 13, color: 'var(--violeta)' }}>{s.area}</dt>
                <dd style={{ color: 'var(--texto-2)', fontSize: 15 }}>{s.itens}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

async function Certificados() {
  const certificados = await listarCertificados();
  if (certificados.length === 0) return null;
  return (
    <section className="secao" id="certificados">
      <div className="wrap">
        <CabecaSecao rotulo="certificados" titulo="Cursos e certificações" />
        <div className="grade-3">
          {certificados.map((c, i) => <CartaoCertificado key={c.id} c={c} i={Math.min(i, 6)} />)}
        </div>
      </div>
    </section>
  );
}

function Contato() {
  return (
    <section className="secao" id="contato" style={{ paddingBottom: 120 }}>
      <div className="wrap">
        <div className="contato">
          <span className="rotulo">contato</span>
          <h2 className="titulo-secao" style={{ maxWidth: 640 }}>Tem um processo em planilha que precisa virar sistema? Ou uma vaga para alguém que cuida de produção?</h2>
          <p className="subtitulo" style={{ maxWidth: 560 }}>Respondo em até um dia útil.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
            <a className="botao botao-primario" href={perfil.whatsapp} target="_blank" rel="noopener">Chamar no WhatsApp</a>
            <a className="botao" href={`mailto:${perfil.email}?subject=Contato%20pelo%20portf%C3%B3lio`}>Enviar e-mail</a>
            <a className="botao" href={perfil.cv} download>Baixar CV (PDF)</a>
          </div>
        </div>
      </div>
    </section>
  );
}
