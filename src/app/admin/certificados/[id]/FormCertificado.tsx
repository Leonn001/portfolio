'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import type { Certificado } from '@/lib/certificados';
import { ehPdf } from '@/lib/texto';
import { excluirCertificado, salvarCertificado, type EstadoCertificado } from '../../actions';

export function FormCertificado({ certificado }: { certificado: Certificado | null }) {
  const [estado, salvar, salvando] = useActionState<EstadoCertificado, FormData>(salvarCertificado, {});
  const [arquivo, setArquivo] = useState(certificado?.arquivoUrl ?? '');
  const [enviando, setEnviando] = useState(false);
  const [erroArquivo, setErroArquivo] = useState('');
  const e = estado.campos ?? {};

  async function enviar(f: File | undefined) {
    if (!f) return;
    setErroArquivo('');
    setEnviando(true);
    try {
      const dados = new FormData();
      dados.append('arquivo', f);
      dados.append('pasta', 'certificados');
      const resp = await fetch('/api/upload', { method: 'POST', body: dados });
      const json = (await resp.json().catch(() => ({}))) as { url?: string; erro?: string };
      if (!resp.ok || !json.url) throw new Error(json.erro ?? 'Não consegui enviar o arquivo.');
      setArquivo(json.url);
    } catch (err) {
      setErroArquivo(err instanceof Error ? err.message : 'Não consegui enviar o arquivo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Link href="/admin/certificados" className="mono" style={{ fontSize: 13, color: 'var(--texto-3)' }}>← certificados</Link>
      <h1 style={{ fontSize: 26, fontWeight: 650, letterSpacing: '-0.02em' }}>{certificado ? 'Editar certificado' : 'Novo certificado'}</h1>

      <form action={salvar} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <input type="hidden" name="id" value={certificado?.id ?? ''} />
        <input type="hidden" name="arquivoUrl" value={arquivo} />

        <div className="campo">
          <label htmlFor="titulo">Nome do certificado</label>
          <input id="titulo" name="titulo" defaultValue={certificado?.titulo} placeholder="Ex.: Introdução ao Pentest na Prática" />
          {e.titulo && <span className="erro">{e.titulo}</span>}
        </div>
        <div className="grade-2">
          <div className="campo">
            <label htmlFor="instituicao">Instituição</label>
            <input id="instituicao" name="instituicao" defaultValue={certificado?.instituicao} placeholder="Ex.: DESEC" />
            {e.instituicao && <span className="erro">{e.instituicao}</span>}
          </div>
          <div className="grade-2" style={{ gap: 12 }}>
            <div className="campo">
              <label htmlFor="emitidoEm">Emitido em</label>
              <input id="emitidoEm" name="emitidoEm" type="month" defaultValue={certificado?.emitidoEm ?? ''} />
              {e.emitidoEm && <span className="erro">{e.emitidoEm}</span>}
            </div>
            <div className="campo">
              <label htmlFor="cargaHoras">Horas</label>
              <input id="cargaHoras" name="cargaHoras" inputMode="numeric" defaultValue={certificado?.cargaHoras ?? ''} />
              {e.cargaHoras && <span className="erro">{e.cargaHoras}</span>}
            </div>
          </div>
        </div>

        <div className="campo">
          <label>Arquivo do certificado (imagem ou PDF)</label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <label className="botao botao-pequeno">
              {enviando ? 'Enviando…' : arquivo ? 'Trocar arquivo' : 'Enviar arquivo'}
              <input type="file" accept="application/pdf,image/png,image/jpeg,image/webp" hidden onChange={ev => enviar(ev.target.files?.[0])} />
            </label>
            {arquivo && (
              <a href={arquivo} target="_blank" rel="noopener" className="link-seta" style={{ fontSize: 14 }}>
                Ver {ehPdf(arquivo) ? 'PDF' : 'imagem'} ↗
              </a>
            )}
            {arquivo && <button type="button" className="botao botao-pequeno" onClick={() => setArquivo('')}>Remover</button>}
          </div>
          {arquivo && !ehPdf(arquivo) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={arquivo} alt="" style={{ maxWidth: 320, borderRadius: 10, border: '1px solid var(--borda)', marginTop: 8 }} />
          )}
          {(erroArquivo || e.arquivoUrl) && <span className="erro">{erroArquivo || e.arquivoUrl}</span>}
          <span className="dica">Até 5 MB. Imagem aparece como miniatura no mural; PDF abre ao clicar.</span>
        </div>

        <div className="campo">
          <label htmlFor="credencialUrl">Link de validação (opcional)</label>
          <input id="credencialUrl" name="credencialUrl" defaultValue={certificado?.credencialUrl ?? ''} placeholder="https://… página da instituição que confirma o certificado" />
          {e.credencialUrl && <span className="erro">{e.credencialUrl}</span>}
        </div>

        <button className="botao botao-primario" type="submit" disabled={salvando || enviando} style={{ alignSelf: 'flex-start' }}>
          {salvando ? 'Salvando…' : 'Salvar certificado'}
        </button>
      </form>

      {certificado && (
        <form
          action={excluirCertificado}
          onSubmit={ev => { if (!confirm('Excluir este certificado?')) ev.preventDefault(); }}
          style={{ borderTop: '1px solid var(--borda)', paddingTop: 20 }}
        >
          <input type="hidden" name="id" value={certificado.id} />
          <button className="botao botao-pequeno botao-perigo" type="submit">Excluir certificado</button>
        </form>
      )}
    </div>
  );
}
