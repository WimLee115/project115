'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import type { ActionResult } from '@/app/actions/auth';

/**
 * Formulieren voor inloggen, registreren en de tweede factor.
 *
 * De pending-status komt uit `useFormStatus`, zodat een dubbele klik geen
 * tweede inlogpoging afvuurt — dat zou onnodig tegen de rate limit lopen.
 */

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="p115-btn p115-btn-primary w-full" disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}

function ErrorMessage({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg px-3 py-2 text-sm"
      style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}
    >
      {message}
    </p>
  );
}

type Action = (
  prev: ActionResult | null,
  formData: FormData,
) => Promise<ActionResult>;

export function LoginForm({
  action,
  labels,
}: {
  action: Action;
  labels: { email: string; password: string; submit: string };
}) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      <ErrorMessage message={state?.error} />

      <div>
        <label className="p115-label" htmlFor="email">
          {labels.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          autoFocus
          className="p115-input"
        />
      </div>

      <div>
        <label className="p115-label" htmlFor="password">
          {labels.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="p115-input"
        />
      </div>

      <SubmitButton label={labels.submit} pendingLabel="..." />
    </form>
  );
}

export function RegisterForm({
  action,
  labels,
}: {
  action: Action;
  labels: { name: string; email: string; password: string; submit: string };
}) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      <ErrorMessage message={state?.error} />

      <div>
        <label className="p115-label" htmlFor="displayName">
          {labels.name}
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          required
          maxLength={80}
          autoComplete="name"
          autoFocus
          className="p115-input"
        />
      </div>

      <div>
        <label className="p115-label" htmlFor="email">
          {labels.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="p115-input"
        />
      </div>

      <div>
        <label className="p115-label" htmlFor="password">
          {labels.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          className="p115-input"
        />
        <p className="mt-1.5 text-xs" style={{ color: 'var(--text-subtle)' }}>
          Minimaal 12 tekens. Een zin die je onthoudt is sterker dan een kort,
          ingewikkeld wachtwoord.
        </p>
      </div>

      <SubmitButton label={labels.submit} pendingLabel="..." />
    </form>
  );
}

export function TotpForm({
  action,
  labels,
}: {
  action: Action;
  labels: { code: string; prompt: string; submit: string };
}) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-4">
      <ErrorMessage message={state?.error} />

      <div>
        <label className="p115-label" htmlFor="code">
          {labels.code}
        </label>
        <input
          id="code"
          name="code"
          type="text"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          required
          autoFocus
          autoComplete="one-time-code"
          className="p115-input text-center text-lg tracking-[0.4em]"
        />
        <p className="mt-1.5 text-xs" style={{ color: 'var(--text-subtle)' }}>
          {labels.prompt}
        </p>
      </div>

      <SubmitButton label={labels.submit} pendingLabel="..." />
    </form>
  );
}
