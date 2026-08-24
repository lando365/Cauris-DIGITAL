'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import type { Article } from '@prisma/client';
import type { ArticleFormState } from './actions';
import { FileUploadField } from '@/components/admin/FileUploadField';
import { MarkdownPreview } from '@/components/admin/MarkdownPreview';

const CATEGORIES = ['ANNONCES', 'PORTRAITS', 'RESSOURCES', 'EVENEMENTS', 'OPINIONS'] as const;
const STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-cauris-orange px-5 py-2 text-sm font-semibold text-white hover:bg-cauris-orange-dark disabled:opacity-60"
    >
      {pending ? 'Enregistrement…' : label}
    </button>
  );
}

function toDatetimeLocal(date: Date | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function ArticleForm({
  article,
  action,
  submitLabel,
}: {
  article?: Article;
  action: (state: ArticleFormState, formData: FormData) => Promise<ArticleFormState>;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, undefined);
  const [content, setContent] = useState(article?.content ?? '');

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div>
        <label htmlFor="slug" className="mb-1 block text-sm font-medium text-cauris-gray-text">
          Slug (URL)
        </label>
        <input
          id="slug"
          name="slug"
          required
          defaultValue={article?.slug}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium text-cauris-gray-text">
          Titre
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={article?.title}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="mb-1 block text-sm font-medium text-cauris-gray-text">
          Extrait (160 caractères)
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          required
          rows={2}
          maxLength={160}
          defaultValue={article?.excerpt}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="content" className="mb-1 block text-sm font-medium text-cauris-gray-text">
          Contenu (Markdown)
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          <textarea
            id="content"
            name="content"
            required
            rows={16}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm"
          />
          <MarkdownPreview content={content} />
        </div>
        <p className="mt-1 text-xs text-cauris-gray-secondary">
          Le temps de lecture est calculé automatiquement (250 mots/min).
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="category"
            className="mb-1 block text-sm font-medium text-cauris-gray-text"
          >
            Catégorie
          </label>
          <select
            id="category"
            name="category"
            defaultValue={article?.category ?? CATEGORIES[0]}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium text-cauris-gray-text">
            Statut
          </label>
          <select
            id="status"
            name="status"
            defaultValue={article?.status ?? 'DRAFT'}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="publishedAt"
          className="mb-1 block text-sm font-medium text-cauris-gray-text"
        >
          Date de publication (si « PUBLISHED ») — laisser vide pour publier immédiatement
        </label>
        <input
          id="publishedAt"
          name="publishedAt"
          type="datetime-local"
          defaultValue={toDatetimeLocal(article?.publishedAt)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-cauris-gray-secondary">
          Une date future programme la publication (l'article n'apparaît publiquement qu'à partir de
          cette date).
        </p>
      </div>

      <FileUploadField
        label="Image de couverture"
        name="coverImageUrl"
        entityType="article"
        defaultValue={article?.coverImageUrl}
      />

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <SubmitButton label={submitLabel} />
    </form>
  );
}
