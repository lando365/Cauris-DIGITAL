'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, CheckCircle2 } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function EventRegistrationForm({ slug }: { slug: string }) {
  const t = useTranslations('EventRegistrationPage');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [website, setWebsite] = useState(''); // honeypot anti-spam

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    const formData = new FormData(e.currentTarget);
    const body = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      guestsCount: formData.get('guestsCount'),
      message: formData.get('message'),
      website,
    };

    try {
      const res = await fetch(`/api/events/${slug}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t('genericError'));
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : t('genericError'));
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-card border border-cauris-success/30 bg-cauris-success/10 p-6 text-center">
        <CheckCircle2
          className="w-8 h-8 text-cauris-success-text mx-auto mb-3"
          aria-hidden="true"
        />
        <p className="font-semibold text-cauris-black mb-1">{t('successTitle')}</p>
        <p className="text-sm text-cauris-gray-text">{t('successText')}</p>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-cauris-orange focus:outline-none focus:ring-1 focus:ring-cauris-orange disabled:opacity-60';

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Honeypot caché anti-spam */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px]"
        aria-hidden="true"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-cauris-black mb-1">
            {t('firstNameLabel')} <span className="text-cauris-error">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            disabled={status === 'loading'}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-cauris-black mb-1">
            {t('lastNameLabel')} <span className="text-cauris-error">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            required
            disabled={status === 'loading'}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-cauris-black mb-1">
          {t('emailLabel')} <span className="text-cauris-error">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          disabled={status === 'loading'}
          className={inputClass}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-cauris-black mb-1">
            {t('phoneLabel')}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            disabled={status === 'loading'}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="guestsCount" className="block text-sm font-medium text-cauris-black mb-1">
            {t('guestsLabel')}
          </label>
          <input
            id="guestsCount"
            name="guestsCount"
            type="number"
            min={1}
            max={10}
            defaultValue={1}
            disabled={status === 'loading'}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-cauris-black mb-1">
          {t('messageLabel')}
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          disabled={status === 'loading'}
          className={inputClass}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-cauris-error">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary disabled:opacity-60 inline-flex items-center gap-2"
      >
        {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
        {t('submitButton')}
      </button>
    </form>
  );
}
