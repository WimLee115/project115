import type { Metadata } from 'next';
import { asc } from 'drizzle-orm';

import { db } from '@/db';
import { glossaryTerms, certifications } from '@/db/schema';
import { requireUser } from '@/lib/auth/session';
import { getTranslator } from '@/lib/i18n';
import { addGlossaryToReview } from '@/app/actions/review';
import { PageHeading } from '@/components/ui';
import { GlossaryBrowser } from '@/components/glossary-browser';

export const metadata: Metadata = { title: 'Begrippen' };

export default async function GlossaryPage() {
  const session = await requireUser();
  if (!session) return null;

  const t = getTranslator(session.user.locale);
  const locale = session.user.locale;

  const certs = await db
    .select()
    .from(certifications)
    .orderBy(certifications.sortOrder);

  const terms = await db
    .select()
    .from(glossaryTerms)
    .orderBy(asc(glossaryTerms.termEn));

  const entries = terms.map((term) => ({
    id: term.id,
    certificationId: term.certificationId,
    termEn: term.termEn,
    termNl: term.termNl,
    definition: locale === 'nl' ? term.definitionNl : term.definitionEn,
    definitionAlt: locale === 'nl' ? term.definitionEn : term.definitionNl,
    note: locale === 'nl' ? term.noteNl : term.noteEn,
  }));

  const groups = certs.map((cert) => ({
    id: cert.id,
    title: locale === 'nl' ? cert.titleNl : cert.titleEn,
    accentColor: cert.accentColor,
    count: entries.filter((e) => e.certificationId === cert.id).length,
  }));

  return (
    <>
      <PageHeading
        title={t('glossary.title')}
        subtitle={`${entries.length} ${t('glossary.terms')} in het Nederlands en Engels`}
      />
      <GlossaryBrowser
        entries={entries}
        groups={groups}
        addToReview={addGlossaryToReview}
        labels={{
          search: t('glossary.search'),
          noResults: t('glossary.noResults'),
          flashcards: t('glossary.flashcards'),
          terms: t('glossary.terms'),
        }}
      />
    </>
  );
}
