'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Search, X, ArrowRight } from 'lucide-react';
import type { Startup } from '@/lib/constants';
import type { StartupStatus } from '@prisma/client';

type Status = 'all' | StartupStatus;

const STATUS_VALUES: StartupStatus[] = ['EN_INCUBATION', 'DIPLOMEE', 'ALUMNI'];

/**
 * Explorateur de startups avec filtres dynamiques côté client (CDC §6.2).
 * Les données viennent de la base (via le Server Component parent) — pas de
 * rechargement de page pour le filtrage, qui reste réactif côté client.
 */
export default function StartupsExplorer({ startups }: { startups: Startup[] }) {
  const t = useTranslations('StartupsExplorer');
  const tEnum = useTranslations('Enums');
  const [query, setQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<Status>('all');

  // Listes uniques de secteurs et pays
  const sectors = useMemo(() => {
    const set = new Set(startups.map((s) => s.sector));
    return Array.from(set).sort();
  }, [startups]);

  const countries = useMemo(() => {
    const set = new Set(startups.map((s) => s.countryName));
    return Array.from(set).sort();
  }, [startups]);

  // Filtrage
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return startups.filter((s) => {
      if (sectorFilter !== 'all' && s.sector !== sectorFilter) return false;
      if (countryFilter !== 'all' && s.countryName !== countryFilter) return false;
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (q) {
        const haystack =
          `${s.name} ${s.tagline} ${s.description} ${tEnum(`sector.${s.sector}`)}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [startups, query, sectorFilter, countryFilter, statusFilter, tEnum]);

  const hasActiveFilters =
    query.trim() !== '' ||
    sectorFilter !== 'all' ||
    countryFilter !== 'all' ||
    statusFilter !== 'all';

  const resetFilters = () => {
    setQuery('');
    setSectorFilter('all');
    setCountryFilter('all');
    setStatusFilter('all');
  };

  return (
    <section className="section">
      <div className="container-cauris">
        {/* Filtres */}
        <div className="bg-white border border-gray-100 rounded-card p-5 lg:p-6 shadow-card mb-10">
          <div className="grid lg:grid-cols-12 gap-4">
            {/* Recherche */}
            <div className="lg:col-span-5">
              <label
                htmlFor="startup-search"
                className="block text-xs font-semibold uppercase tracking-wider text-cauris-gray-secondary mb-2"
              >
                {t('search')}
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cauris-gray-secondary"
                  aria-hidden="true"
                />
                <input
                  id="startup-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-10 pr-9 py-2.5 border border-gray-200 rounded-btn focus:outline-none focus:border-cauris-orange focus:ring-1 focus:ring-cauris-orange transition-colors text-sm"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cauris-gray-secondary hover:text-cauris-orange"
                    aria-label={t('clearSearch')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Secteur */}
            <div className="lg:col-span-3">
              <label
                htmlFor="filter-sector"
                className="block text-xs font-semibold uppercase tracking-wider text-cauris-gray-secondary mb-2"
              >
                {t('sector')}
              </label>
              <select
                id="filter-sector"
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-btn focus:outline-none focus:border-cauris-orange focus:ring-1 focus:ring-cauris-orange transition-colors text-sm bg-white"
              >
                <option value="all">{t('allSectors')}</option>
                {sectors.map((s) => (
                  <option key={s} value={s}>
                    {tEnum(`sector.${s}`)}
                  </option>
                ))}
              </select>
            </div>

            {/* Pays */}
            <div className="lg:col-span-2">
              <label
                htmlFor="filter-country"
                className="block text-xs font-semibold uppercase tracking-wider text-cauris-gray-secondary mb-2"
              >
                {t('country')}
              </label>
              <select
                id="filter-country"
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-btn focus:outline-none focus:border-cauris-orange focus:ring-1 focus:ring-cauris-orange transition-colors text-sm bg-white"
              >
                <option value="all">{t('allCountries')}</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Statut */}
            <div className="lg:col-span-2">
              <label
                htmlFor="filter-status"
                className="block text-xs font-semibold uppercase tracking-wider text-cauris-gray-secondary mb-2"
              >
                {t('status')}
              </label>
              <select
                id="filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Status)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-btn focus:outline-none focus:border-cauris-orange focus:ring-1 focus:ring-cauris-orange transition-colors text-sm bg-white"
              >
                <option value="all">{t('allStatuses')}</option>
                {STATUS_VALUES.map((s) => (
                  <option key={s} value={s}>
                    {tEnum(`status.${s}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Résumé + reset */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-cauris-gray-secondary">
              <strong className="text-cauris-black">{filtered.length}</strong>{' '}
              {filtered.length > 1 ? t('startupsPlural') : t('startupSingular')}
              {hasActiveFilters && ` ${t('matching')}`}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-medium text-cauris-orange hover:underline"
              >
                {t('resetFilters')}
              </button>
            )}
          </div>
        </div>

        {/* Grille startups */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="inline-flex w-14 h-14 rounded-full bg-cauris-orange/10 text-cauris-orange items-center justify-center mb-4">
              <Search className="w-7 h-7" aria-hidden="true" />
            </div>
            <h3 className="font-heading font-bold text-xl text-cauris-black mb-2">
              {t('emptyTitle')}
            </h3>
            <p className="text-cauris-gray-text mb-6">{t('emptyText')}</p>
            <button
              type="button"
              onClick={resetFilters}
              className="text-cauris-orange font-semibold hover:underline"
            >
              {t('resetFilters')}
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {filtered.map((s) => {
              const statusColor =
                s.status === 'DIPLOMEE'
                  ? 'bg-cauris-success/10 text-cauris-success-text'
                  : s.status === 'ALUMNI'
                    ? 'bg-cauris-black/5 text-cauris-black'
                    : 'bg-cauris-orange/10 text-cauris-orange';
              // Pas de aria-label : le nom accessible se compose déjà à
              // partir de tout le texte visible de la carte (WCAG 2.5.3)
              return (
                <Link
                  key={s.slug}
                  href={`/startups/${s.slug}`}
                  className="card group p-6 lg:p-7 border border-gray-100 h-full flex flex-col bg-white hover:border-cauris-orange/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-cauris-orange to-cauris-orange-light flex items-center justify-center text-white font-heading font-bold text-xl">
                      {s.name.charAt(0)}
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${statusColor}`}
                    >
                      {tEnum(`status.${s.status}`)}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-cauris-black mb-1 group-hover:text-cauris-orange transition-colors">
                    {s.name} <span className="text-base">{s.country}</span>
                  </h3>
                  <p className="text-xs text-cauris-gray-secondary uppercase tracking-wider mb-3">
                    {tEnum(`sector.${s.sector}`)} · {s.countryName} · {t('cohort', { year: s.year })}
                  </p>
                  <p className="text-cauris-orange font-medium text-sm mb-3">{s.tagline}</p>
                  <p className="text-sm text-cauris-gray-text leading-relaxed flex-1 mb-5 line-clamp-3">
                    {s.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-cauris-orange">
                      {t('discover')}
                      <ArrowRight
                        className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
