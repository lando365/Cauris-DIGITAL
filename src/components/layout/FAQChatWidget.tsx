'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHasMounted } from '@/lib/hooks/useHasMounted';
import { detectSmallTalk, findBestFaqMatch } from '@/lib/faq-chat-matcher';

interface ChatMessage {
  id: number;
  role: 'user' | 'bot';
  text: string;
  matchedQuestion?: string;
  showFallbackLinks?: boolean;
}

/**
 * Cauris Chat : widget flottant qui répond aux questions simples par
 * recherche de mots-clés dans FAQ_ITEMS (src/lib/constants.ts), sans appel
 * réseau ni LLM.
 */
export default function FAQChatWidget() {
  const t = useTranslations('FAQChat');
  const mounted = useHasMounted();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const nextId = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  if (!mounted) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const question = input.trim();
    if (!question) return;

    const match = findBestFaqMatch(question);
    let botMessage: ChatMessage;
    if (match) {
      botMessage = {
        id: nextId.current + 1,
        role: 'bot',
        text: match.answer,
        matchedQuestion: match.question,
      };
    } else {
      const smallTalk = detectSmallTalk(question);
      if (smallTalk === 'thanks') {
        botMessage = { id: nextId.current + 1, role: 'bot', text: t('thanksReply') };
      } else if (smallTalk === 'greeting') {
        botMessage = { id: nextId.current + 1, role: 'bot', text: t('greetingReply') };
      } else {
        botMessage = {
          id: nextId.current + 1,
          role: 'bot',
          text: t('fallbackMessage'),
          showFallbackLinks: true,
        };
      }
    }

    setMessages((prev) => [
      ...prev,
      { id: nextId.current, role: 'user', text: question },
      botMessage,
    ]);
    nextId.current += 2;
    setInput('');
  };

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-labelledby="faq-chat-title"
          className={cn(
            'fixed bottom-24 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] max-w-sm',
            'bg-white rounded-card shadow-card-hover border border-gray-200 overflow-hidden flex flex-col',
            'animate-fade-in-up'
          )}
          style={{ maxHeight: 'min(28rem, calc(100vh - 8rem))' }}
        >
          <div className="flex items-center justify-between gap-2 px-4 py-3 bg-cauris-orange text-white shrink-0">
            <div>
              <h2 id="faq-chat-title" className="font-heading font-bold text-sm">
                {t('title')}
              </h2>
              <p className="text-xs text-white/85">{t('subtitle')}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('closeButton')}
              className="p-1 hover:bg-white/15 rounded-btn transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-[8rem]">
            <div className="text-sm text-cauris-gray-text bg-gray-50 rounded-lg px-3 py-2 max-w-[85%]">
              {t('greeting')}
            </div>
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'text-sm rounded-lg px-3 py-2 max-w-[85%] leading-relaxed',
                  message.role === 'user'
                    ? 'bg-cauris-orange text-white ml-auto'
                    : 'bg-gray-50 text-cauris-gray-text'
                )}
              >
                {message.role === 'bot' && message.matchedQuestion && (
                  <p className="text-xs font-semibold text-cauris-orange mb-1">
                    {t('sourceLabel')} {message.matchedQuestion}
                  </p>
                )}
                <p>{message.text}</p>
                {message.role === 'bot' && message.showFallbackLinks && (
                  <p className="mt-1">
                    <Link href="/faq" className="text-cauris-orange hover:underline font-medium">
                      {t('fallbackFaqLink')}
                    </Link>{' '}
                    {t('fallbackOr')}{' '}
                    <Link
                      href="/contact"
                      className="text-cauris-orange hover:underline font-medium"
                    >
                      {t('fallbackContactLink')}
                    </Link>
                  </p>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t border-gray-200 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('inputPlaceholder')}
              className="flex-1 min-w-0 text-sm px-3 py-2 rounded-btn border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cauris-orange/40"
            />
            <button
              type="submit"
              aria-label={t('sendButton')}
              disabled={!input.trim()}
              className="shrink-0 p-2 rounded-btn bg-cauris-orange hover:bg-cauris-orange-dark disabled:opacity-40 disabled:hover:bg-cauris-orange text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t('closeButton') : t('openButton')}
        aria-expanded={open}
        className={cn(
          'fixed bottom-6 right-4 sm:right-6 z-40 w-14 h-14 rounded-full',
          'bg-cauris-orange hover:bg-cauris-orange-dark text-white shadow-cta',
          'flex items-center justify-center transition-colors'
        )}
      >
        {open ? (
          <X className="w-6 h-6" />
        ) : (
          <span className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/70">
            <Image
              src="/brand/cauris-logo.jpg"
              alt=""
              fill
              sizes="36px"
              className="object-cover object-top"
            />
          </span>
        )}
      </button>
    </>
  );
}
