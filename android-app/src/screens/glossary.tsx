import { useMemo, useState } from 'react';

import { useApp } from '@/app/app-state';
import { Badge, EmptyState, PageHeading } from '@/components/ui';
import { certifications, glossary, pick, type ContentTerm } from '@/lib/content';
import { addGlossaryToReview } from '@/lib/review';

/**
 * Begrippenlijst.
 *
 * Tweetalig naast elkaar, en niet als twee losse lijsten. Bij ITIL leer je de
 * Engelse term omdat het examen die gebruikt, maar je moet hem in het
 * Nederlands kunnen uitleggen aan iemand die het framework niet kent — en dat
 * is precies waar het bij een foundationexamen om draait.
 *
 * Zoeken doorzoekt beide talen en de definities. Wie 'wijziging' intikt vindt
 * ook 'change enablement', en dat is vaker wat je bedoelt dan een exacte
 * treffer op de term zelf.
 */

function matches(term: ContentTerm, needle: string): boolean {
  if (needle === '') return true;
  const haystack = [
    term.termNl,
    term.termEn,
    term.definitionNl,
    term.definitionEn,
    term.noteNl ?? '',
    term.noteEn ?? '',
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(needle);
}

export function GlossaryScreen() {
  const { t, locale, refreshDue } = useApp();

  const [query, setQuery] = useState('');
  const [certFilter, setCertFilter] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const needle = query.trim().toLowerCase();

  const results = useMemo(
    () =>
      glossary
        .filter((term) => (certFilter === null || term.certificationId === certFilter))
        .filter((term) => matches(term, needle))
        .sort((a, b) => {
          if (a.certificationId !== b.certificationId) {
            return a.certificationId.localeCompare(b.certificationId);
          }
          return a.sortOrder - b.sortOrder;
        }),
    [needle, certFilter],
  );

  const addToReview = async () => {
    setBusy(true);
    const targets = certFilter ? [certFilter] : certifications.map((row) => row.id);

    let added = 0;
    for (const id of targets) {
      const result = await addGlossaryToReview(id);
      added += result.added;
    }

    setBusy(false);
    setMessage(added > 0 ? `${added} ${t('review.added')}` : t('review.allAdded'));
    if (added > 0) await refreshDue();
  };

  return (
    <div className="pt-5">
      <PageHeading
        title={t('glossary.title')}
        subtitle={`${results.length} ${t('glossary.terms')}`}
      />

      <input
        type="search"
        className="p115-input"
        placeholder={t('glossary.search')}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label={t('glossary.search')}
      />

      <div className="mt-3 flex flex-wrap gap-2">
        <FilterChip
          label={t('common.all')}
          active={certFilter === null}
          onClick={() => setCertFilter(null)}
          title={t('glossary.terms')}
        />
        {certifications.map((certification) => (
          <FilterChip
            key={certification.id}
            label={certification.provider}
            title={pick(locale, certification.titleNl, certification.titleEn)}
            active={certFilter === certification.id}
            onClick={() => setCertFilter(certification.id)}
          />
        ))}
      </div>

      <button
        type="button"
        className="p115-btn p115-btn-secondary mt-3 w-full text-sm"
        onClick={() => void addToReview()}
        disabled={busy}
      >
        {t('review.addGlossary')}
      </button>

      {message ? (
        <p className="mt-2 px-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          {message}
        </p>
      ) : null}

      <div className="mt-5">
        {results.length === 0 ? (
          <EmptyState title={t('glossary.noResults')} />
        ) : (
          <div className="p115-card overflow-hidden">
            {results.map((term) => {
              const open = openId === term.id;
              return (
                <div key={term.id} className="border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                    onClick={() => setOpenId(open ? null : term.id)}
                    aria-expanded={open}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.9375rem] font-medium leading-snug">
                        {locale === 'nl' ? term.termNl : term.termEn}
                      </span>
                      <span className="block text-xs" style={{ color: 'var(--text-subtle)' }}>
                        {locale === 'nl' ? term.termEn : term.termNl}
                      </span>
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className="flex-shrink-0 transition-transform"
                      style={{
                        color: 'var(--text-subtle)',
                        transform: open ? 'rotate(90deg)' : undefined,
                      }}
                    >
                      <path
                        d="M9 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {open ? (
                    <div className="px-4 pb-4 text-sm leading-relaxed">
                      <p>{pick(locale, term.definitionNl, term.definitionEn)}</p>
                      <p className="mt-2" style={{ color: 'var(--text-subtle)' }}>
                        {pick(locale === 'nl' ? 'en' : 'nl', term.definitionNl, term.definitionEn)}
                      </p>
                      {(locale === 'nl' ? term.noteNl : term.noteEn) ? (
                        <p
                          className="mt-3 rounded-lg px-3 py-2 text-[0.8125rem]"
                          style={{ background: 'var(--surface-hover)', color: 'var(--text-muted)' }}
                        >
                          {locale === 'nl' ? term.noteNl : term.noteEn}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  title,
  active,
  onClick,
}: {
  label: string;
  title: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} title={title} aria-pressed={active}>
      <Badge tone={active ? 'accent' : 'neutral'}>{label}</Badge>
    </button>
  );
}
