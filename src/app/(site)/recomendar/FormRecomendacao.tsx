'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { RELACOES } from '@/lib/validacao';
import { enviarRecomendacao, type EstadoRecomendacao } from './actions';

const MAX = 1200;

export function FormRecomendacao() {
  const [estado, enviar, enviando] = useActionState<EstadoRecomendacao, FormData>(enviarRecomendacao, {});
  const [tamanho, setTamanho] = useState(estado.valores?.texto?.length ?? 0);
  const v = estado.valores ?? {};
  const e = estado.campos ?? {};

  if (estado.ok) {
    return (
      <div className="aviso aviso-ok" role="status" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 28 }}>
        <strong style={{ fontSize: 18 }}>Valeu demais!</strong>
        <p style={{ color: 'var(--texto-2)' }}>Sua recomendação chegou. Ela aparece no mural assim que eu der uma olhada.</p>
        <Link href="/" className="link-seta" style={{ alignSelf: 'flex-start' }}>Voltar ao portfólio</Link>
      </div>
    );
  }

  return (
    <form action={enviar} style={{ display: 'flex', flexDirection: 'column', gap: 18 }} noValidate>
      {estado.erro && <div className="aviso aviso-erro" role="alert">{estado.erro}</div>}

      <div className="grade-2">
        <Campo nome="nome" rotulo="Seu nome" valor={v.nome} erro={e.nome} autoComplete="name" />
        <Campo nome="cargo" rotulo="Seu cargo" valor={v.cargo} erro={e.cargo} autoComplete="organization-title" />
      </div>
      <div className="grade-2">
        <Campo nome="empresa" rotulo="Empresa (opcional)" valor={v.empresa} erro={e.empresa} autoComplete="organization" />
        <div className="campo">
          <label htmlFor="relacao">Como vocês se conhecem</label>
          <select id="relacao" name="relacao" defaultValue={v.relacao ?? ''} aria-invalid={!!e.relacao}>
            <option value="" disabled>Escolha…</option>
            {RELACOES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {e.relacao && <span className="erro">{e.relacao}</span>}
        </div>
      </div>

      <div className="campo">
        <label htmlFor="texto">Sua recomendação</label>
        <textarea
          id="texto"
          name="texto"
          rows={7}
          maxLength={MAX}
          defaultValue={v.texto}
          aria-invalid={!!e.texto}
          onChange={ev => setTamanho(ev.target.value.length)}
          placeholder="Como foi trabalhar ou estudar comigo, algo que fiz que fez diferença…"
        />
        <span className="dica" style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <span>{e.texto ? <span className="erro">{e.texto}</span> : 'Pode ser curtinha. O que vale é ser sincera.'}</span>
          <span className="mono">{tamanho}/{MAX}</span>
        </span>
      </div>

      <Campo nome="linkedin" rotulo="Seu LinkedIn (opcional)" valor={v.linkedin} erro={e.linkedin} placeholder="https://www.linkedin.com/in/seu-nome" dica="Seu nome no mural vira link para o seu perfil." />

      {/* armadilha para robôs: escondida de pessoas e de leitores de tela */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor="site">Site</label>
        <input id="site" name="site" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button className="botao botao-primario" type="submit" disabled={enviando} style={{ alignSelf: 'flex-start' }}>
        {enviando ? 'Enviando…' : 'Enviar recomendação'}
      </button>
    </form>
  );
}

function Campo(props: { nome: string; rotulo: string; valor?: string; erro?: string; placeholder?: string; dica?: string; autoComplete?: string }) {
  return (
    <div className="campo">
      <label htmlFor={props.nome}>{props.rotulo}</label>
      <input
        id={props.nome}
        name={props.nome}
        defaultValue={props.valor}
        placeholder={props.placeholder}
        autoComplete={props.autoComplete}
        aria-invalid={!!props.erro}
      />
      {props.erro ? <span className="erro">{props.erro}</span> : props.dica && <span className="dica">{props.dica}</span>}
    </div>
  );
}
