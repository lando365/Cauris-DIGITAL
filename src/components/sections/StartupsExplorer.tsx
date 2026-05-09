'use client';

import { useMemo, useState } from 'react';
import { Search, X, ExternalLink, Linkedin } from 'lucide-react';
import { FEATURED_STARTUPS } from '@/lib/constants';

type Status = 'all' | 'En incubation' | 'Diplômée' | 'Alumni';

const STATUS_OPTIONS: Array<{ value: Status; label: string }> = [
  { value: 'all', label: 'Toutes' },
  { value: 'En incubation', label: 'En incubation' },
  { value: 'Diplômée', label: 'Diplômées' },
  { value: 'Alumni', label: 'Alumni' },
];

/**
 * Explorateur de startups avec filtres dynamiques côté client (CDC §6.2).
 * Pas de rechargement de page — réactivité immédiate.
 */
export default function StartupsExplorer() {
  const [query, setQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<Status>('all');

  // Listes uniques de secteurs et pays
  const sectors = useMemo(() => {
    const set = new Set(FEATURED_STARTUPS.map((s) => s.sector));
    return Array.from(set).sort();
  }, []);

  const countries = useMemo(() => {
    const set = new Set(FEATURED_STARTUPS.map((s) => s.countryName));
    return Array.from(set).sort();
  }, []);

  // Filtrage
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FEATURED_STARTUPS.filter((s) => {
      if (sectorFilter !== 'all' && s.sector !== sectorFilter) return false;
      if (countryFilter !== 'all' && s.countryName !== countryFilter) return false;
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (q) {
        const haystack = `${s.name} ${s.tagline} ${s.description} ${s.sector}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [query, sectorFilter, countryFilter, statusFilter]);

  const hasActiveFilters =
    query.trim() !== '' || sectorFilter !== 'all' || countryFilter !== 'all' || statusFilter !== 'all';

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
              <label htmlFor="startup-search" className="block text-xs font-semibold uppercase tracking-wider text-cauris-gray-secondary mb-2">
                Rechercher
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cauris-gray-secondary" aria-hidden="true" />
                <input
                  id="startup-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Nom, secteur, mot-clé…"
                  className="w-full pl-10 pr-9 py-2.5 border border-gray-200 rounded-btn focus:outline-none focus:border-cauris-orange focus:ring-1 focus:ring-cauris-orange transition-colors text-sm"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cauris-gray-secondary hover:text-cauris-orange"
                    aria-label="Effacer la recherche"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Secteur */}
            <div className="lg:col-span-3">
              <label htmlFor="filter-sector" className="block text-xs font-semibold uppercase tracking-wider text-cauris-gray-secondary mb-2">
                Secteur
              </label>
              <select
                id="filter-sector"
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-btn focus:outline-none focus:border-cauris-orange focus:ring-1 focus:ring-cauris-orange transition-colors text-sm bg-white"
              >
                <option value="all">Tous les secteurs</option>
                {sectors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Pays */}
            <div className="lg:col-span-2">
              <label htmlFor="filter-country" className="block text-xs font-semibold uppercase tracking-wider text-cauris-gray-secondary mb-2">
                Pays
              </label>
              <select
                id="filter-country"
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-btn focus:outline-none focus:border-cauris-orange focus:ring-1 focus:ring-cauris-orange transition-colors text-sm bg-white"
              >
                <option value="all">Tous</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Statut */}
            <div className="lg:col-span-2">
              <label htmlFor="filter-status" className="block text-xs font-semibold uppercase tracking-wider text-cauris-gray-secondary mb-2">
                Statut
              </label>
              <select
                id="filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Status)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-btn focus:outline-none focus:border-cauris-orange focus:ring-1 focus:ring-cauris-orange transition-colors text-sm bg-white"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Résumé + reset */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-cauris-gray-secondary">
              <strong className="text-cauris-black">{filtered.length}</strong>{' '}
              {filtered.length > 1 ? 'startups' : 'startup'}
              {hasActiveFilters && ' correspondante(s)'}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-medium text-cauris-orange hover:underline"
              >
                Réinitialiser les filtres
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
              Aucune startup ne correspond à votre recherche
            </h3>
            <p className="text-cauris-gray-text mb-6">
              Essayez avec d&apos;autres critères ou réinitialisez les filtres.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="text-cauris-orange font-semibold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {filtered.map((s) => {
              const statusColor =
                s.status === 'Diplômée'
                  ? 'bg-cauris-success/10 text-cauris-success'
                  : s.status === 'Alumni'
                    ? 'bg-cauris-black/5 text-cauris-black'
                    : 'bg-cauris-orange/10 text-cauris-orange';
              return (
                <article
                  key={s.name}
                  className="card group p-6 lg:p-7 border border-gray-100 h-full flex flex-col bg-white"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-cauris-orange to-cauris-orange-light flex items-center justify-center text-white font-heading font-bold text-xl">
                      {s.name.charAt(0)}
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${statusColor}`}
                    >
                      {s.status}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-xl text-cauris-black mb-1">
                    {s.name} <span className="text-base">{s.country}</span>
                  </h3>
                  <p className="text-xs text-cauris-gray-secondary uppercase tracking-wider mb-3">
                    {s.sector} · {s.countryName} · Promo {s.year}
                  </p>
                  <p className="text-cauris-orange font-medium text-sm mb-3">{s.tagline}</p>
                  <p className="text-sm text-cauris-gray-text leading-relaxed flex-1 mb-5">
                    {s.description}
                  </p>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      className="text-cauris-gray-secondary hover:text-cauris-orange transition-colors"
                      aria-label={`Visiter le site de ${s.name}`}
                      title="Site web (à venir)"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="text-cauris-gray-secondary hover:text-cauris-orange transition-colors"
                      aria-label={`LinkedIn de ${s.name}`}
                      title="LinkedIn (à venir)"
                    >
                      <Linkedin className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
