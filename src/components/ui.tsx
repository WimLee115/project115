import type { ReactNode } from 'react';

/**
 * Kleine, gedeelde presentatiecomponenten.
 *
 * Bewust server components zonder eigen state: alles wat interactie nodig
 * heeft, staat in een eigen 'use client'-bestand. Zo blijft de hoeveelheid
 * JavaScript die naar de browser gaat beperkt tot wat echt interactief is.
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
