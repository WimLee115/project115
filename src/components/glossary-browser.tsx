'use client';

import { useMemo, useState, useTransition } from 'react';

/**
 * Doorzoekbaar tweetalig glossarium.
 *
 * Zoeken gebeurt in de browser: 120 begrippen passen ruim in het geheugen en
 * een serverronde per toetsaanslag zou alleen maar trager voelen. De zoekterm
 * matcht op beide talen én op de definitie, zodat je ook kunt zoeken op iets
 * wat je je half herinnert.
 */

export interface GlossaryEntry {
  id: string;
  certificationId: string;
  termEn: string;
  termNl: string;
  definition: string;
  definitionAlt: string;
  note: string | null;
}

export interface GlossaryGroup {
  id: string;
  title: string;
  accentColor: string;
  count: number;
}

export function GlossaryBrowser({
  entries,
  groups,
  addToReview,
  labels,
}: {
  entries: GlossaryEntry[];
  groups: GlossaryGroup[];
  addToReview: (certificationId: string) => Promise<{ ok: boolean; added: number }>;
  labels: { search: string; noResults: string; flashcards: string; terms: string };
}) {
  const [query, setQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (activeGroup && entry.certificationId !== activeGroup) return false;
      if (!needle) return true;
      return (
        entry.termEn.toLowerCase().includes(needle) ||
        entry.termNl.toLowerCase().includes(needle) ||
        entry.definition.toLowerCase().includes(needle) ||
        entry.definitionAlt.toLowerCase().includes(needle)
      );
    });
  }, [entries, query, activeGroup]);

  const handleAdd = (certificationId: string) => {
    startTransition(async () => {
      const result = await addToReview(certificationId);
      setMessage(
        result.added > 0
          ? `${result.added} ${labels.terms} toegevoegd aan je herhaalwachtrij.`
          : 'Alle begrippen staan al in je herhaalwachtrij.',
      );
    });
  };

  return (
    <>
      <div className="mb-5 space-y-3">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={labels.search}
          className="p115-input"
          aria-label={labels.search}
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="p115-btn p115-btn-secondary px-3 py-1.5 text-sm"
            onClick={() => setActiveGroup(null)}
            style={
              activeGroup === null
                ? { background: 'var(--accent-soft)', color: 'var(--accent)', borderColor: 'var(--accent)' }
                : undefined
            }
          >
            Alle ({entries.length})
          </button>
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              className="p115-btn p115-btn-secondary px-3 py-1.5 text-sm"
              onClick={() => setActiveGroup(group.id)}
              style={
                activeGroup === group.id
                  ? { background: 'var(--accent-soft)', color: 'var(--accent)', borderColor: 'var(--accent)' }
                  : undefined
              }
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: group.accentColor }}
                aria-hidden="true"
              />
              {group.title.length > 34 ? `${group.title.slice(0, 32)}…` : group.title} ({group.count})
            </button>
          ))}
        </div>

        {activeGroup ? (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="p115-btn p115-btn-primary px-3 py-1.5 text-sm"
              onClick={() => handleAdd(activeGroup)}
              disabled={pending}
            >
              {labels.flashcards} toevoegen aan herhaling
            </button>
            {message ? (
              <span className="text-sm" style={{ color: 'var(--success)' }} role="status">
                {message}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          {labels.noResults}
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((entry) => {
            const open = expanded === entry.id;
            return (
              <li key={entry.id} className="p115-card overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-4 p-4 text-left"
                  onClick={() => setExpanded(open ? null : entry.id)}
                  aria-expanded={open}
                >
                  <span>
                    <span className="font-semibold">{entry.termNl}</span>
                    {entry.termNl.toLowerCase() !== entry.termEn.toLowerCase() ? (
                      <span className="ml-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                        {entry.termEn}
                      </span>
                    ) : null}
                    {!open ? (
                      <span
                        className="mt-1 block truncate text-sm"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {entry.definition}
                      </span>
                    ) : null}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="mt-1 flex-shrink-0 transition-transform"
                    style={{
                      transform: open ? 'rotate(180deg)' : undefined,
                      color: 'var(--text-subtle)',
                    }}
                  >
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {open ? (
                  <div className="border-t px-4 pb-4 pt-3.5">
                    <p className="text-[0.9375rem] leading-relaxed">{entry.definition}</p>
                    <p
                      className="mt-2.5 border-l-2 pl-3 text-sm leading-relaxed"
                      style={{ color: 'var(--text-muted)', borderColor: 'var(--border-strong)' }}
                    >
                      {entry.definitionAlt}
                    </p>
                    {entry.note ? (
                      <p
                        className="mt-3 rounded-lg p-3 text-sm leading-relaxed"
                        style={{ background: 'var(--warning-soft)' }}
                      >
                        {entry.note}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
