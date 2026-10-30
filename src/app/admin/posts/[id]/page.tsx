import { notFound } from 'next/navigation';
import { buscarPorId } from '@/lib/posts';
import { contarPendentes } from '@/lib/recomendacoes';
import { exigirAdmin } from '@/lib/sessao';
import { Barra } from '../../Barra';
import { Editor } from './Editor';

export default async function EditarPostPage({ params }: PageProps<'/admin/posts/[id]'>) {
  await exigirAdmin();
  const { id } = await params;
  const post = id === 'novo' ? null : await buscarPorId(id);
  if (id !== 'novo' && !post) notFound();

  return (
    <>
      <Barra pendentes={await contarPendentes()} />
      <main className="wrap" style={{ padding: '32px 20px 80px' }}>
        <Editor key={post?.id ?? 'novo'} post={post} />
      </main>
    </>
  );
}
