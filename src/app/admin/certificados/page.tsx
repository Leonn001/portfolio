import Link from 'next/link';
import { listarCertificadosAdmin } from '@/lib/certificados';
import { contarPendentes } from '@/lib/recomendacoes';
import { exigirAdmin } from '@/lib/sessao';
import { mesAno } from '@/lib/texto';
import { Barra } from '../Barra';

export default async function CertificadosAdminPage() {
  await exigirAdmin();
  const [certificados, pendentes] = await Promise.all([listarCertificadosAdmin(), contarPendentes()]);

  return (
    <>
      <Barra pendentes={pendentes} />
      <main className="wrap" style={{ padding: '40px 20px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <h1 style={{ fontSize: 28, fontWeight: 650, letterSpacing: '-0.02em' }}>Certificados</h1>
          <Link className="botao botao-primario" href="/admin/certificados/novo">Novo certificado</Link>
        </div>
        {certificados.length === 0 ? (
          <div className="cartao" style={{ textAlign: 'center', padding: 40 }}>
            <h3>Nenhum certificado ainda</h3>
            <p>Cadastre o primeiro com a imagem ou o PDF dele.</p>
          </div>
        ) : (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {certificados.map(c => (
              <li key={c.id}>
                <Link href={`/admin/certificados/${c.id}`} className="cartao" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                  <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <strong>{c.titulo}</strong>
                    <span className="mono" style={{ fontSize: 12, color: 'var(--texto-3)' }}>
                      {[c.instituicao, mesAno(c.emitidoEm), c.cargaHoras ? `${c.cargaHoras}h` : ''].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                  <span className={`chip chip-ponto${c.arquivoUrl ? '' : ' chip-ambar'}`}>{c.arquivoUrl ? 'Com arquivo' : 'Sem arquivo'}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
