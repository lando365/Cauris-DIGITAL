import { ArticleForm } from '../ArticleForm';
import { createArticle } from '../actions';

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="mb-6 font-montserrat text-xl font-bold text-cauris-black">Nouvel article</h1>
      <ArticleForm action={createArticle} submitLabel="Créer l'article" />
    </div>
  );
}
