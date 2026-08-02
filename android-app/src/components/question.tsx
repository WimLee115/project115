import type { ReactNode } from 'react';

/**
 * De vraag zelf: stam, eventuele genummerde lijst, en de antwoordopties.
 *
 * Gedeeld door examen, oefening, herhaling en het examenrapport. Dat is geen
 * zuinigheid maar noodzaak: als een vraag er tijdens het oefenen anders uitziet
 * dan tijdens het proefexamen, oefen je op de verkeerde vorm.
 */

/**
 * De tweede taal onder de eerste.
 *
 * Alleen buiten de examenmodus. Op je examendag staat er één taal op het
 * scherm, en oefenen met een vangnet dat er dan niet is, went verkeerd.
 */
function AltText({ children }: { children: ReactNode }) {
  return (
    <span
      className="mt-1.5 block text-[0.8125rem] leading-relaxed"
      style={{ color: 'var(--text-subtle)' }}
      lang="auto"
    >
      {children}
    </span>
  );
}

export function QuestionStem({
  stem,
  stemAlt,
  listItems,
  showAlt = false,
}: {
  stem: string;
  stemAlt?: string;
  listItems?: Array<{ text: string; textAlt: string }> | null;
  showAlt?: boolean;
}) {
  return (
    <div>
      <p className="text-[1.0625rem] font-medium leading-relaxed">{stem}</p>
      {showAlt && stemAlt && stemAlt !== stem ? <AltText>{stemAlt}</AltText> : null}

      {listItems && listItems.length > 0 ? (
        <ol
          className="mt-3 space-y-1.5 rounded-xl px-4 py-3 text-sm leading-relaxed"
          style={{ background: 'var(--surface-hover)' }}
        >
          {listItems.map((item, index) => (
            <li key={index} className="flex gap-2.5">
              <span className="flex-shrink-0 tabular-nums" style={{ color: 'var(--text-muted)' }}>
                {index + 1}.
              </span>
              <span>
                {item.text}
                {showAlt && item.textAlt && item.textAlt !== item.text ? (
                  <AltText>{item.textAlt}</AltText>
                ) : null}
              </span>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

export function OptionButton({
  label,
  text,
  textAlt,
  selected = false,
  state = null,
  disabled = false,
  showAlt = false,
  onClick,
  footnote,
}: {
  label: string;
  text: string;
  textAlt?: string;
  selected?: boolean;
  /** Gezet zodra het juiste antwoord bekend mag zijn. */
  state?: 'correct' | 'incorrect' | null;
  disabled?: boolean;
  showAlt?: boolean;
  onClick?: () => void;
  /** Toelichting waarom deze optie wel of niet klopt. */
  footnote?: string | null;
}) {
  return (
    <button
      type="button"
      className="p115-option"
      data-selected={selected}
      {...(state ? { 'data-state': state } : {})}
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="p115-option-label" aria-hidden="true">
        {label}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.9375rem] leading-relaxed">{text}</span>
        {showAlt && textAlt && textAlt !== text ? <AltText>{textAlt}</AltText> : null}
        {footnote ? (
          <span
            className="mt-2 block text-[0.8125rem] leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            {footnote}
          </span>
        ) : null}
      </span>
    </button>
  );
}

/** Toelichting bij het juiste antwoord, na het nakijken. */
export function Explanation({
  title,
  children,
  sourceRef,
  sourceLabel,
}: {
  title: string;
  children: ReactNode;
  sourceRef?: string | null;
  sourceLabel?: string;
}) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--surface-hover)' }}>
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-subtle)' }}>
        {title}
      </p>
      <div className="mt-1.5 text-sm leading-relaxed">{children}</div>
      {sourceRef ? (
        <p className="mt-2.5 text-xs" style={{ color: 'var(--text-subtle)' }}>
          {sourceLabel}: {sourceRef}
        </p>
      ) : null}
    </div>
  );
}
