import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * API de navigation consciente des locales (Link, useRouter, usePathname…).
 * À utiliser à la place des équivalents `next/link` / `next/navigation`
 * partout où l'URL doit être préfixée par la langue courante.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
