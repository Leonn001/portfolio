'use client';

import { useActionState } from 'react';
import { entrar } from '../actions';

export function FormLogin() {
  const [estado, enviar, enviando] = useActionState(entrar, {});
  return (
    <form action={enviar} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="campo">
        <label htmlFor="senha">Senha</label>
        <input id="senha" name="senha" type="password" autoComplete="current-password" autoFocus required />
      </div>
      {estado.erro && <div className="aviso aviso-erro" role="alert">{estado.erro}</div>}
      <button className="botao botao-primario" type="submit" disabled={enviando}>{enviando ? 'Entrando…' : 'Entrar'}</button>
    </form>
  );
}
