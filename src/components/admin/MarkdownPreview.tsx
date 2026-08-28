'use client';

import ReactMarkdown from 'react-markdown';

// CDC V2 §8.2.3 : "Éditeur Markdown avec aperçu en temps réel."
// react-markdown ne rend jamais de HTML brut par défaut (pas de
// dangerouslySetInnerHTML) — sûr pour du contenu saisi par un éditeur.
export function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="prose prose-sm max-w-none rounded-md border border-gray-200 bg-white px-4 py-3">
      {content.trim() ? (
        <ReactMarkdown>{content}</ReactMarkdown>
      ) : (
        <p className="text-cauris-gray-secondary">
          L&apos;aperçu apparaît ici au fur et à mesure de la saisie.
        </p>
      )}
    </div>
  );
}
