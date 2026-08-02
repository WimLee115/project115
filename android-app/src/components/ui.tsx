import type { ReactNode } from 'react';

/**
 * Kleine, gedeelde presentatiecomponenten.
 *
 * Overgenomen uit de webversie en waar nodig aangepast aan een telefoon. De
 * eerste helft van dit bestand is identiek gehouden, zodat een wijziging aan
 * het uiterlijk aan beide kanten hetzelfde uitpakt; de tweede helft bevat de
 * componenten die alleen hier bestaan, zoals de onderbalk en het bodempaneel.
 */

export function Card({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article';
}) {
  return <Tag className={`p115-card p-5 ${className}`}>{children}</Tag>;
}

export function PageHeading({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}

type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

const toneStyles: Record<Tone, { background: string; color: string }> = {
  neutral: { background: 'var(--surface-hover)', color: 'var(--text-muted)' },
  accent: { background: 'var(--accent-soft)', color: 'var(--accent)' },
  success: { background: 'var(--success-soft)', color: 'var(--success)' },
  warning: { background: 'var(--warning-soft)', color: 'var(--warning)' },
  danger: { background: 'var(--danger-soft)', color: 'var(--danger)' },
  info: { background: 'var(--info-soft)', color: 'var(--info)' },
};

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  return (
    <span className="p115-badge" style={toneStyles[tone]}>
      {children}
    </span>
  );
}

/**
 * Voortgangsbalk met optionele cesuurmarkering.
 *
 * De markering is het verschil tussen "ik heb 60% goed" en "ik zak" — precies
 * de informatie die je bij examenvoorbereiding nodig hebt.
 */
export function ProgressBar({
  value,
  max = 100,
  tone = 'accent',
  threshold,
  height = 8,
  label,
}: {
  value: number;
  max?: number;
  tone?: Tone;
  /** Positie van de cesuurstreep, in dezelfde eenheid als `value`. */
  threshold?: number;
  height?: number;
  label?: string;
}) {
  const ratio = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const thresholdRatio =
    threshold !== undefined && max > 0
      ? Math.max(0, Math.min(1, threshold / max))
      : null;

  return (
    <div
      className="relative w-full overflow-hidden rounded-full"
      style={{ height, background: 'var(--surface-hover)' }}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
    >
      <div
        className="h-full rounded-full transition-[width] duration-300"
        style={{
          width: `${ratio * 100}%`,
          background: toneStyles[tone].color,
        }}
      />
      {thresholdRatio !== null ? (
        <div
          className="absolute top-0 h-full"
          style={{
            left: `${thresholdRatio * 100}%`,
            width: 2,
            background: 'var(--text)',
            opacity: 0.45,
          }}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}

/** Ring die een percentage toont; gebruikt voor examengereedheid. */
export function ScoreRing({
  value,
  size = 120,
  label,
  sublabel,
  tone = 'accent',
}: {
  value: number;
  size?: number;
  label?: string;
  sublabel?: string;
  tone?: Tone;
}) {
  const stroke = size / 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-hover)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={toneStyles[tone].color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <div className="absolute grid place-items-center text-center">
        <span className="text-2xl font-semibold tabular-nums">{label ?? `${Math.round(clamped)}%`}</span>
        {sublabel ? (
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {sublabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className="rounded-xl border border-dashed px-6 py-10 text-center"
      style={{ borderColor: 'var(--border-strong)' }}
    >
      <p className="font-medium">{title}</p>
      {description ? (
        <p className="mx-auto mt-1 max-w-md text-sm" style={{ color: 'var(--text-muted)' }}>
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: Tone;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-subtle)' }}>
        {label}
      </p>
      <p
        className="mt-1 text-2xl font-semibold tabular-nums"
        style={tone ? { color: toneStyles[tone].color } : undefined}
      >
        {value}
      </p>
      {hint ? (
        <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Alleen in de app-versie
 * ------------------------------------------------------------------------- */

/**
 * Kop van een scherm, met terugknop.
 *
 * Blijft staan bij het scrollen. Op een telefoon verlies je anders bij een
 * lange lijst het overzicht van waar je bent en hoe je terugkomt.
 */
export function TopBar({
  title,
  subtitle,
  onBack,
  action,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  action?: ReactNode;
}) {
  return (
    <header
      className="sticky z-30 -mx-4 mb-4 flex items-center gap-2 border-b px-4 py-2.5 backdrop-blur"
      style={{
        top: 'var(--safe-top)',
        background: 'color-mix(in srgb, var(--surface-sunken) 90%, transparent)',
        borderColor: 'var(--border)',
      }}
    >
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="-ml-2 grid h-11 w-11 flex-shrink-0 place-items-center rounded-lg"
          aria-label="Terug"
          style={{ color: 'var(--text-muted)' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M15 5l-7 7 7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : null}

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold leading-tight">{title}</h1>
        {subtitle ? (
          <p className="truncate text-xs" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        ) : null}
      </div>

      {action ? <div className="flex flex-shrink-0 items-center gap-1">{action}</div> : null}
    </header>
  );
}

/** Groep instellingen of gegevens onder een kopje. */
export function Section({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-5">
      {title ? (
        <h2
          className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide"
          style={{ color: 'var(--text-subtle)' }}
        >
          {title}
        </h2>
      ) : null}
      <div className="p115-card overflow-hidden">{children}</div>
      {description ? (
        <p className="mt-2 px-1 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {description}
        </p>
      ) : null}
    </section>
  );
}

/** Rij binnen een `Section`, eventueel aantikbaar. */
export function Row({
  label,
  value,
  hint,
  onClick,
  trailing,
  danger = false,
  disabled = false,
}: {
  label: string;
  value?: string;
  hint?: string;
  onClick?: () => void;
  trailing?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
}) {
  const content = (
    <>
      <span className="min-w-0 flex-1 text-left">
        <span
          className="block text-[0.9375rem] font-medium"
          style={danger ? { color: 'var(--danger)' } : undefined}
        >
          {label}
        </span>
        {hint ? (
          <span className="mt-0.5 block text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {hint}
          </span>
        ) : null}
      </span>
      {value ? (
        <span className="flex-shrink-0 text-sm" style={{ color: 'var(--text-muted)' }}>
          {value}
        </span>
      ) : null}
      {trailing}
      {onClick && !trailing ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="flex-shrink-0"
          style={{ color: 'var(--text-subtle)' }}
        >
          <path
            d="M9 5l7 7-7 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </>
  );

  const className =
    'flex w-full items-center gap-3 border-b px-4 py-3.5 text-left last:border-b-0';

  if (!onClick) {
    return (
      <div className={className} style={{ borderColor: 'var(--border)' }}>
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={className}
      style={{ borderColor: 'var(--border)', opacity: disabled ? 0.5 : 1 }}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}

/**
 * Vinkje achter de gekozen optie in een keuzelijst.
 *
 * De niet-gekozen variant is niet leeg maar even breed, zodat de labels niet
 * verspringen zodra je iets anders aantikt.
 */
export function SelectedMark({ active }: { active: boolean }) {
  if (!active) return <span className="w-5 flex-shrink-0" aria-hidden="true" />;

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="flex-shrink-0"
      style={{ color: 'var(--accent)' }}
    >
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Schakelaar voor een aan-uitinstelling. */
export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="relative h-7 w-12 flex-shrink-0 rounded-full transition-colors"
      style={{
        background: checked ? 'var(--accent)' : 'var(--surface-hover)',
        border: `1px solid ${checked ? 'var(--accent)' : 'var(--border-strong)'}`,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span
        className="absolute top-0.5 h-5 w-5 rounded-full transition-[left] duration-150"
        style={{
          left: checked ? '1.5rem' : '0.125rem',
          background: checked ? 'var(--accent-contrast)' : 'var(--surface-raised)',
          boxShadow: '0 1px 3px rgb(0 0 0 / 0.2)',
        }}
      />
    </button>
  );
}

/**
 * Paneel dat vanaf de onderkant verschijnt.
 *
 * Op een telefoon is dat de plek waar je duim al is; een dialoog in het midden
 * van het scherm vraagt om een tweede hand.
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      className="p115-sheet"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(event) => {
        // Alleen sluiten bij een tik náást het paneel, niet erbinnen.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="p115-sheet-panel">
        <p className="text-base font-semibold">{title}</p>
        {children ? <div className="mt-2 text-sm leading-relaxed">{children}</div> : null}
        {actions ? <div className="mt-5 flex gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}

/** Lopende tekst binnen een `Section`, voor toelichting in plaats van keuzes. */
export function Note({ children }: { children: ReactNode }) {
  return (
    <p
      className="border-b px-4 py-3.5 text-[0.8125rem] leading-relaxed last:border-b-0"
      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
    >
      {children}
    </p>
  );
}

/** Wachtindicator; verschijnt pas na een korte vertraging. */
export function Loading({ label }: { label?: string }) {
  return (
    <div className="grid place-items-center py-16" role="status" aria-live="polite">
      <div
        className="h-7 w-7 animate-spin rounded-full border-2"
        style={{
          borderColor: 'var(--border-strong)',
          borderTopColor: 'var(--accent)',
        }}
        aria-hidden="true"
      />
      {label ? (
        <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
          {label}
        </p>
      ) : null}
    </div>
  );
}

/** Foutmelding met de mogelijkheid het opnieuw te proberen. */
export function ErrorNote({
  message,
  onRetry,
  retryLabel,
}: {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  return (
    <div
      className="rounded-xl p-4 text-sm"
      style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}
      role="alert"
    >
      <p>{message}</p>
      {onRetry ? (
        <button
          type="button"
          className="p115-btn p115-btn-secondary mt-3 text-sm"
          onClick={onRetry}
        >
          {retryLabel ?? 'Opnieuw'}
        </button>
      ) : null}
    </div>
  );
}
