'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Send, Check, AlertCircle, Loader2, ShieldCheck, Paperclip, X } from 'lucide-react';
import { useRecaptcha } from '@/lib/hooks/useRecaptcha';

type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Objets du formulaire (Textes_Site_v1)
 * Note : 'candidature' (depuis le bouton Hero) mappe sur 'Candidature à un programme'.
 */
const SUBJECT_IDS = [
  'candidature',
  'candidature-incubation',
  'candidature-acceleration',
  'partenariat-corporate',
  'mentorat',
  'presse',
  'evenement',
  'autre',
] as const;

// Sujets qui déclenchent les champs additionnels "Candidature startup" (CDC §6.1)
const STARTUP_APPLICATION_SUBJECTS = new Set([
  'candidature',
  'candidature-incubation',
  'candidature-acceleration',
]);
const CORPORATE_SUBJECT = 'partenariat-corporate';

const MAX_PITCH_DECK_MB = 5;

export default function ContactForm({ defaultSubject = '' }: { defaultSubject?: string }) {
  const t = useTranslations('ContactForm');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [subject, setSubject] = useState(defaultSubject);
  const [pitchDeckError, setPitchDeckError] = useState('');
  const [pitchDeckName, setPitchDeckName] = useState('');
  const { getToken: getRecaptchaToken, isEnabled: recaptchaEnabled } = useRecaptcha();

  const startupSectors = t.raw('startupSectors') as string[];
  const startupStages = t.raw('startupStages') as string[];
  const countries = t.raw('countries') as string[];

  const isStartupApplication = STARTUP_APPLICATION_SUBJECTS.has(subject);
  const isCorporate = subject === CORPORATE_SUBJECT;

  const messageLabel = useMemo(() => {
    if (isStartupApplication) return t('pitchLabel');
    return t('messageLabel');
  }, [isStartupApplication, t]);

  const validatePitchDeck = (file: File | undefined): string => {
    if (!file || file.size === 0) return '';
    if (file.type !== 'application/pdf') return t('pitchDeckMustBePdf');
    if (file.size > MAX_PITCH_DECK_MB * 1024 * 1024) {
      return t('pitchDeckTooLarge', { max: MAX_PITCH_DECK_MB });
    }
    return '';
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);

    // Honeypot anti-spam (CDC §6.1)
    if (formData.get('website')) {
      setStatus('success'); // Faux succès pour ne pas alerter le bot
      return;
    }

    const pitchDeck = formData.get('pitchDeck');
    const pitchDeckFile = pitchDeck instanceof File ? pitchDeck : undefined;
    const fileError = validatePitchDeck(pitchDeckFile);
    if (fileError) {
      setPitchDeckError(fileError);
      setStatus('error');
      setErrorMessage(fileError);
      return;
    }
    // Ne pas envoyer un champ file vide (certains navigateurs l'incluent quand même)
    if (!pitchDeckFile || pitchDeckFile.size === 0) {
      formData.delete('pitchDeck');
    }

    // Génère un token reCAPTCHA v3 si configuré (sinon absent = mode dev)
    if (recaptchaEnabled) {
      const recaptchaToken = await getRecaptchaToken('contact_form');
      if (recaptchaToken) {
        formData.set('recaptchaToken', recaptchaToken);
      }
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t('sendError'));
      setStatus('success');
      formEl.reset();
      setSubject(defaultSubject);
      setPitchDeckName('');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : t('genericError'));
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-cauris-success/10 border border-cauris-success/30 rounded-card p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-cauris-success/20 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-cauris-success" />
        </div>
        <h3 className="font-heading font-bold text-xl text-cauris-black mb-2">
          {t('successTitle')}
        </h3>
        <p className="text-cauris-gray-text mb-2">{t('successText')}</p>
        <p className="text-sm text-cauris-gray-secondary">
          {t('successMeanwhileStart')}{' '}
          <Link href="/programme-incubation" className="text-cauris-orange hover:underline">
            {t('successProgramsLink')}
          </Link>{' '}
          {t('successMeanwhileEnd')}
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 text-cauris-orange font-semibold hover:underline"
        >
          {t('sendAnother')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {/* Honeypot caché */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute left-[-9999px]"
        aria-hidden="true"
      />

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-cauris-black mb-2">
            {t('firstName')} <span className="text-cauris-error">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            className="w-full px-4 py-3 border border-gray-200 rounded-btn focus:outline-none focus:border-cauris-orange focus:ring-1 focus:ring-cauris-orange transition-colors"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-cauris-black mb-2">
            {t('lastName')} <span className="text-cauris-error">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            className="w-full px-4 py-3 border border-gray-200 rounded-btn focus:outline-none focus:border-cauris-orange focus:ring-1 focus:ring-cauris-orange transition-colors"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-cauris-black mb-2">
            {t('email')} <span className="text-cauris-error">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full px-4 py-3 border border-gray-200 rounded-btn focus:outline-none focus:border-cauris-orange focus:ring-1 focus:ring-cauris-orange transition-colors"
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-cauris-black mb-2">
            {t('country')} <span className="text-cauris-error">*</span>
          </label>
          <select
            id="country"
            name="country"
            required
            autoComplete="country-name"
            defaultValue=""
            className="w-full px-4 py-3 border border-gray-200 rounded-btn focus:outline-none focus:border-cauris-orange focus:ring-1 focus:ring-cauris-orange transition-colors bg-white"
          >
            <option value="" disabled>
              {t('countryPlaceholder')}
            </option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-cauris-black mb-2">
          {t('subject')} <span className="text-cauris-error">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-btn focus:outline-none focus:border-cauris-orange focus:ring-1 focus:ring-cauris-orange transition-colors bg-white"
        >
          <option value="">{t('subjectPlaceholder')}</option>
          {SUBJECT_IDS.map((id) => (
            <option key={id} value={id}>
              {t(`subjects.${id}`)}
            </option>
          ))}
        </select>
      </div>

      {/* Champs additionnels — Candidature startup (CDC §6.1) */}
      {isStartupApplication && (
        <div className="space-y-5 p-5 rounded-card bg-cauris-cream/40 border border-cauris-orange/20">
          <p className="text-xs font-semibold uppercase tracking-wider text-cauris-orange">
            {t('yourProject')}
          </p>
          <div>
            <label
              htmlFor="startupName"
              className="block text-sm font-medium text-cauris-black mb-2"
            >
              {t('startupName')} <span className="text-cauris-error">*</span>
            </label>
            <input
              id="startupName"
              name="startupName"
              type="text"
              required={isStartupApplication}
              className="w-full px-4 py-3 border border-gray-200 rounded-btn focus:outline-none focus:border-cauris-orange focus:ring-1 focus:ring-cauris-orange transition-colors bg-white"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="sector" className="block text-sm font-medium text-cauris-black mb-2">
                {t('sector')} <span className="text-cauris-error">*</span>
              </label>
              <select
                id="sector"
                name="sector"
                required={isStartupApplication}
                defaultValue=""
                className="w-full px-4 py-3 border border-gray-200 rounded-btn focus:outline-none focus:border-cauris-orange focus:ring-1 focus:ring-cauris-orange transition-colors bg-white"
              >
                <option value="" disabled>
                  {t('selectPlaceholder')}
                </option>
                {startupSectors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="stage" className="block text-sm font-medium text-cauris-black mb-2">
                {t('projectStage')} <span className="text-cauris-error">*</span>
              </label>
              <select
                id="stage"
                name="stage"
                required={isStartupApplication}
                defaultValue=""
                className="w-full px-4 py-3 border border-gray-200 rounded-btn focus:outline-none focus:border-cauris-orange focus:ring-1 focus:ring-cauris-orange transition-colors bg-white"
              >
                <option value="" disabled>
                  {t('selectPlaceholder')}
                </option>
                {startupStages.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="pitchDeck" className="block text-sm font-medium text-cauris-black mb-2">
              {t('pitchDeckLabel')}
            </label>
            <label
              htmlFor="pitchDeck"
              className="flex items-center gap-2 w-full px-4 py-3 border border-dashed border-gray-300 rounded-btn bg-white text-sm text-cauris-gray-secondary hover:border-cauris-orange cursor-pointer transition-colors"
            >
              <Paperclip className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{pitchDeckName || t('pitchDeckPlaceholder')}</span>
              {pitchDeckName && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    const input = document.getElementById('pitchDeck') as HTMLInputElement | null;
                    if (input) input.value = '';
                    setPitchDeckName('');
                    setPitchDeckError('');
                  }}
                  className="ml-auto text-cauris-gray-secondary hover:text-cauris-error"
                  aria-label={t('removeFile')}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </label>
            <input
              id="pitchDeck"
              name="pitchDeck"
              type="file"
              accept="application/pdf"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setPitchDeckError(validatePitchDeck(file));
                setPitchDeckName(file?.name ?? '');
              }}
            />
            {pitchDeckError && <p className="mt-1 text-xs text-cauris-error">{pitchDeckError}</p>}
          </div>
        </div>
      )}

      {/* Champs additionnels — Partenariat corporate (CDC §6.1) */}
      {isCorporate && (
        <div className="space-y-5 p-5 rounded-card bg-cauris-cream/40 border border-cauris-orange/20">
          <p className="text-xs font-semibold uppercase tracking-wider text-cauris-orange">
            {t('yourCompany')}
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-cauris-black mb-2">
                {t('company')} <span className="text-cauris-error">*</span>
              </label>
              <input
                id="company"
                name="company"
                type="text"
                required={isCorporate}
                className="w-full px-4 py-3 border border-gray-200 rounded-btn focus:outline-none focus:border-cauris-orange focus:ring-1 focus:ring-cauris-orange transition-colors bg-white"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-cauris-black mb-2">
                {t('phone')} <span className="text-cauris-error">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required={isCorporate}
                autoComplete="tel"
                className="w-full px-4 py-3 border border-gray-200 rounded-btn focus:outline-none focus:border-cauris-orange focus:ring-1 focus:ring-cauris-orange transition-colors bg-white"
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-cauris-black mb-2">
          {messageLabel} <span className="text-cauris-error">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          minLength={20}
          className="w-full px-4 py-3 border border-gray-200 rounded-btn focus:outline-none focus:border-cauris-orange focus:ring-1 focus:ring-cauris-orange transition-colors resize-y"
          placeholder={
            isStartupApplication ? t('pitchPlaceholder') : t('messagePlaceholder')
          }
        />
        <p className="mt-1 text-xs text-cauris-gray-secondary">{t('minCharacters')}</p>
      </div>

      <div className="flex items-start gap-2">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          className="mt-1 w-4 h-4 rounded border-gray-300 text-cauris-orange focus:ring-cauris-orange"
        />
        <label htmlFor="consent" className="text-sm text-cauris-gray-secondary leading-relaxed">
          {t('consentStart')}{' '}
          <Link href="/politique-de-confidentialite" className="text-cauris-orange hover:underline">
            {t('consentLink')}
          </Link>
          .
        </label>
      </div>

      {status === 'error' && (
        <div
          role="alert"
          className="flex items-start gap-2 p-4 rounded-btn bg-cauris-error/10 border border-cauris-error/30 text-cauris-error text-sm"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary w-full sm:w-auto disabled:opacity-60"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('sending')}
            </>
          ) : (
            <>
              {t('sendMessage')}
              <Send className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Mention reCAPTCHA exigée par Google quand le badge est masqué */}
        {recaptchaEnabled && (
          <p className="text-[11px] text-cauris-gray-secondary leading-relaxed inline-flex items-start gap-1.5">
            <ShieldCheck
              className="w-3 h-3 mt-0.5 shrink-0 text-cauris-gray-secondary"
              aria-hidden="true"
            />
            <span>
              {t('recaptchaStart')}{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-cauris-orange"
              >
                {t('recaptchaPrivacy')}
              </a>{' '}
              {t('recaptchaAnd')}{' '}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-cauris-orange"
              >
                {t('recaptchaTerms')}
              </a>{' '}
              {t('recaptchaGoogle')}
            </span>
          </p>
        )}
      </div>
    </form>
  );
}
