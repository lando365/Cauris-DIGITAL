import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ArticleForm } from '../../ArticleForm';
import { updateArticle } from '../../actions';

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const article = await prisma.article.findUnique({ where: { id: params.id } });
  if (!article) notFound();

  const action = updateArticle.bind(null, params.id);

  return (
    <div>
      <h1 className="mb-6 font-montserrat text-xl font-bold text-cauris-black">
        Modifier « {article.title} »
      </h1>
      <ArticleForm article={article} action={action} submitLabel="Enregistrer" />
    </div>
  );
}
