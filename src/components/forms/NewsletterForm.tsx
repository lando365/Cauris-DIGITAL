'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot anti-spam
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Honeypot rempli par un bot -> on fait croire que tout va bien sans rien envoyer
    if (website) {
      setStatus('success');
      setMessage('Merci ! Vérifiez votre email pour confirmer votre inscription.');
      setEmail('');
      setConsent(false);
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent, website }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Erreur');
      setStatus('success');
      setMessage('Merci ! Vérifiez votre email pour confirmer votre inscription.');
      setEmail('');
      setConsent(false);
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-2">
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

      <label htmlFor="newsletter-email" className="sr-only">
        Adresse email
      </label>
      <div className="flex">
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          autoComplete="email"
          disabled={status === 'loading'}
          className="flex-1 min-w-0 px-3 py-2.5 text-sm bg-white/10 border border-white/20 rounded-l-md text-white placeholder:text-white/50 focus:outline-none focus:border-cauris-orange focus:bg-white/15 transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 bg-cauris-orange hover:bg-cauris-orange-dark text-white rounded-r-md transition-colors disabled:opacity-60 flex items-center justify-center"
          aria-label="S'inscrire à la newsletter"
        >
          {status === 'loading' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : status === 'success' ? (
            <Check className="w-4 h-4" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="flex items-start gap-2">
        <input
          id="newsletter-consent"
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          disabled={status === 'loading'}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/30 bg-white/10 text-cauris-orange focus:ring-cauris-orange"
        />
        <label htmlFor="newsletter-consent" className="text-xs leading-relaxed text-white/70">
          J&apos;accepte de recevoir la newsletter, conformément à la{' '}
          <Link href="/politique-de-confidentialite" className="text-cauris-orange hover:underline">
            politique de confidentialité
          </Link>
          .
        </label>
      </div>

      {message && (
        <p
          role="status"
          className={`text-xs ${status === 'error' ? 'text-cauris-error' : 'text-cauris-success'}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
