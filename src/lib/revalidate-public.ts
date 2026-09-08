import { revalidatePath } from 'next/cache';
import { LOCALES } from '@/i18n/config';

/**
 * Les pages publiques utilisent l'ISR (revalidate: 60s côté page), ce qui
 * peut laisser jusqu'à une minute avant qu'une création/modification admin
 * n'apparaisse publiquement. Ces helpers forcent une invalidation immédiate
 * du cache public pour les deux locales, en complément du
 * revalidatePath('/admin/...') déjà appelé dans chaque Server Action.
 */

export function revalidatePublicStartups(...slugs: (string | null | undefined)[]) {
  for (const locale of LOCALES) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/startups`);
    for (const slug of slugs) {
      if (slug) revalidatePath(`/${locale}/startups/${slug}`);
    }
  }
}

export function revalidatePublicArticles(...slugs: (string | null | undefined)[]) {
  for (const locale of LOCALES) {
    revalidatePath(`/${locale}/actualites`);
    for (const slug of slugs) {
      if (slug) revalidatePath(`/${locale}/actualites/${slug}`);
    }
  }
}

export function revalidatePublicEvents() {
  for (const locale of LOCALES) {
    revalidatePath(`/${locale}/evenements`);
  }
}

export function revalidatePublicPartners() {
  for (const locale of LOCALES) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/partenaires`);
  }
}
