'use client';

import { useActionState, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';

import {
  beginTotpSetup,
  enableTotp,
  disableTotp,
  type ActionResult,
  type TotpSetup,
} from '@/app/actions/auth';

/** Formulieren op de instellingenpagina die clientstate nodig hebben. */

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="p115-btn p115-btn-primary text-sm" disabled={pending}>
      {pending ? '…' : label}
    </button>
  );
}

function Feedback({ state, savedLabel }: { state: ActionResult | null; savedLabel: string }) {
  if (!state) return null;
  const ok = state.ok;
  return (
    <p
      role="status"
      className="rounded-lg px-3 py-2 text-sm"
      style={
        ok
          ? { background: 'var(--success-soft)', color: 'var(--success)' }
          : { background: 'var(--danger-soft)', color: 'var(--danger)' }
      }
    >
      {ok ? savedLabel : state.error}
    </p>
  );
}

/**
 * Naam en interfacetaal.
 *
 * De taal wordt op de server bepaald en niet in de browser, dus na het opslaan
 * moet de pagina opnieuw worden opgebouwd; dat doet de actie zelf met
 * `revalidatePath`. Vandaar dat dit formulier verder niets hoeft te onthouden.
 */
export function ProfileForm({
  action,
  defaults,
  labels,
}: {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  defaults: { displayName: string; locale: 'nl' | 'en' };
  labels: {
    name: string;
    language: string;
    languageHint: string;
    dutch: string;
    english: string;
    submit: string;
    saved: string;
  };
}) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="grid max-w-lg gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Feedback state={state} savedLabel={labels.saved} />
      </div>

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
          defaultValue={defaults.displayName}
          className="p115-input"
        />
      </div>

      <div>
        <label className="p115-label" htmlFor="locale">
          {labels.language}
        </label>
        <select
          id="locale"
          name="locale"
          defaultValue={defaults.locale}
          className="p115-input"
        >
          <option value="nl">{labels.dutch}</option>
          <option value="en">{labels.english}</option>
        </select>
        <p className="mt-1.5 text-xs" style={{ color: 'var(--text-subtle)' }}>
          {labels.languageHint}
        </p>
      </div>

      <div className="sm:col-span-2">
        <SubmitButton label={labels.submit} />
      </div>
    </form>
  );
}

export function PasswordForm({
  action,
  labels,
}: {
  action: (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;
  labels: { current: string; next: string; submit: string; saved: string };
}) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="max-w-sm space-y-3">
      <Feedback state={state} savedLabel={labels.saved} />

      <div>
        <label className="p115-label" htmlFor="currentPassword">
          {labels.current}
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className="p115-input"
        />
      </div>

      <div>
        <label className="p115-label" htmlFor="newPassword">
          {labels.next}
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
          className="p115-input"
        />
        <p className="mt-1.5 text-xs" style={{ color: 'var(--text-subtle)' }}>
          Minimaal 12 tekens. Na wijziging worden alle andere sessies beëindigd.
        </p>
      </div>

      <SubmitButton label={labels.submit} />
    </form>
  );
}

/**
 * Tweestapsverificatie in- en uitschakelen.
 *
 * Het secret verschijnt als tekst én als otpauth-URI. Een QR-code zou een
 * extra afhankelijkheid vragen; handmatig invoeren van het secret werkt in
 * elke authenticator-app en is voor eenmalig gebruik prima.
 */
export function TotpSection({
  enabled,
  labels,
}: {
  enabled: boolean;
  labels: {
    enable: string;
    disable: string;
    code: string;
    password: string;
    verify: string;
    cancel: string;
  };
}) {
  const [setup, setSetup] = useState<TotpSetup | null>(null);
  const [pending, startTransition] = useTransition();
  const [enableState, enableAction] = useActionState(enableTotp, null);
  const [disableState, disableAction] = useActionState(disableTotp, null);

  if (enabled) {
    return (
      <div className="max-w-sm space-y-3">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Bij het inloggen wordt naast je wachtwoord een code uit je
          authenticator-app gevraagd.
        </p>
        <form action={disableAction} className="space-y-3">
          <Feedback state={disableState} savedLabel="Tweestapsverificatie uitgeschakeld." />
          <div>
            <label className="p115-label" htmlFor="disablePassword">
              {labels.password}
            </label>
            <input
              id="disablePassword"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="p115-input"
            />
          </div>
          <button type="submit" className="p115-btn p115-btn-secondary text-sm">
            {labels.disable}
          </button>
        </form>
      </div>
    );
  }

  if (!setup) {
    return (
      <div>
        <p className="mb-3 text-sm" style={{ color: 'var(--text-muted)' }}>
          Een tweede factor beschermt je account ook wanneer je wachtwoord
          bekend zou worden.
        </p>
        <button
          type="button"
          className="p115-btn p115-btn-primary text-sm"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await beginTotpSetup();
              if (result) setSetup(result);
            })
          }
        >
          {labels.enable}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md space-y-4">
      <div>
        <p className="mb-1.5 text-sm font-medium">1. Voeg toe aan je authenticator-app</p>
        <code
          className="block break-all rounded-lg p-3 text-xs"
          style={{ background: 'var(--surface-sunken)', fontFamily: 'var(--font-mono)' }}
        >
          {setup.secret}
        </code>
        <p className="mt-1.5 text-xs" style={{ color: 'var(--text-subtle)' }}>
          Of gebruik de URI: <span className="break-all">{setup.uri}</span>
        </p>
      </div>

      <div>
        <p className="mb-1.5 text-sm font-medium">2. Bewaar je herstelcodes</p>
        <p className="mb-2 text-xs" style={{ color: 'var(--text-subtle)' }}>
          Zonder deze codes verlies je de toegang als je je telefoon kwijtraakt.
          Bewaar ze buiten deze machine.
        </p>
        <ul
          className="grid grid-cols-2 gap-1.5 rounded-lg p-3 text-xs"
          style={{ background: 'var(--surface-sunken)', fontFamily: 'var(--font-mono)' }}
        >
          {setup.recoveryCodes.map((code) => (
            <li key={code}>{code}</li>
          ))}
        </ul>
      </div>

      <form action={enableAction} className="space-y-3">
        <Feedback state={enableState} savedLabel="Tweestapsverificatie ingeschakeld." />
        <input type="hidden" name="secret" value={setup.secret} />
        <input
          type="hidden"
          name="recoveryCodes"
          value={JSON.stringify(setup.recoveryCodes)}
        />

        <div>
          <label className="p115-label" htmlFor="totpCode">
            3. {labels.code}
          </label>
          <input
            id="totpCode"
            name="code"
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            required
            autoComplete="one-time-code"
            className="p115-input max-w-[10rem] text-center tracking-[0.3em]"
          />
        </div>

        <div className="flex gap-2">
          <SubmitButton label={labels.verify} />
          <button
            type="button"
            className="p115-btn p115-btn-ghost text-sm"
            onClick={() => setSetup(null)}
          >
            {labels.cancel}
          </button>
        </div>
      </form>
    </div>
  );
}
