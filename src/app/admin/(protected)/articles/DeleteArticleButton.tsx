'use client';

import { useTransition } from 'react';
import { deleteArticle } from './actions';

export function DeleteArticleButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm(`Supprimer définitivement l'article « ${title} » ?`)) {
          startTransition(() => deleteArticle(id));
        }
      }}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
    >
      {isPending ? '…' : 'Supprimer'}
    </button>
  );
}
