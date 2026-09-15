'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';

type Status = 'idle' | 'loading' | 'error';

const MESSAGE_MAX_LENGTH = 500;

export function UnsubscribeReasonForm({ token }: { token: string }) {
  const t = useTranslations('NewsletterUnsubscribePage');
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t('genericError'));
      router.push('/newsletter/desinscrit');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : t('genericError'));
    }
  };

  return (
    <form onSubmit={onSubmit} className="text-left space-y-3">
      <label htmlFor="unsubscribe-reason" className="block text-sm font-medium text-cauris-black">
        {t('reasonLabel')}
      </label>
      <textarea
        id="unsubscribe-reason"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={MESSAGE_MAX_LENGTH}
        rows={4}
        disabled={status === 'loading'}
        placeholder={t('reasonPlaceholder')}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-cauris-black focus:outline-none focus:ring-2 focus:ring-cauris-orange focus:border-transparent"
      />

      {error && (
        <p role="alert" className="text-xs text-cauris-error">
          {error}
        </p>
      )}

      <div className="flex justify-center pt-2">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary disabled:opacity-60 inline-flex items-center gap-2"
        >
          {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
          {t('confirmButton')}
        </button>
      </div>
    </form>
  );
}
