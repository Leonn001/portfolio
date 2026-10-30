import { notFound } from 'next/navigation';
import { buscarCertificado } from '@/lib/certificados';
import { contarPendentes } from '@/lib/recomendacoes';
import { exigirAdmin } from '@/lib/sessao';
import { Barra } from '../../Barra';
import { FormCertificado } from './FormCertificado';

export default async function EditarCertificadoPage({ params }: PageProps<'/admin/certificados/[id]'>) {
  await exigirAdmin();
  const { id } = await params;
  const certificado = id === 'novo' ? null : await buscarCertificado(id);
  if (id !== 'novo' && !certificado) notFound();

  return (
    <>
      <Barra pendentes={await contarPendentes()} />
      <main className="wrap" style={{ padding: '32px 20px 80px', maxWidth: 760 }}>
        <FormCertificado key={certificado?.id ?? 'novo'} certificado={certificado} />
      </main>
    </>
  );
}
