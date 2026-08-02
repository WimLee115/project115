import type { ContentPack, QuestionSeed } from './types';

import * as itilStructure from './itil5/structure';
import { questions as itilQ1 } from './itil5/questions-01-terms';
import { questions as itilQ2 } from './itil5/questions-02-dimensions-lifecycle';
import { questions as itilQ3 } from './itil5/questions-03-value-system';
import { questions as itilQ4 } from './itil5/questions-04-streams-ai-frameworks';
import { questions as itilQ5 } from './itil5/questions-05-coverage';
import { glossary as itilGlossary } from './itil5/glossary';

import * as isfsStructure from './isfs/structure';
import { questions as isfsQ1 } from './isfs/questions-01-info-risks';
import { questions as isfsQ2 } from './isfs/questions-02-controls';
import { questions as isfsQ3 } from './isfs/questions-03-law-standards';
import { glossary as isfsGlossary } from './isfs/glossary';

export const itil5: ContentPack = {
  certification: itilStructure.certification,
  domains: itilStructure.domains,
  objectives: itilStructure.objectives,
  questions: [...itilQ1, ...itilQ2, ...itilQ3, ...itilQ4, ...itilQ5],
  glossary: itilGlossary,
};

export const isfs: ContentPack = {
  certification: isfsStructure.certification,
  domains: isfsStructure.domains,
  objectives: isfsStructure.objectives,
  questions: [...isfsQ1, ...isfsQ2, ...isfsQ3],
  glossary: isfsGlossary,
};

export const contentPacks: ContentPack[] = [itil5, isfs];

/* ---------------------------------------------------------------------------
 * Validatie
 *
 * Een vraag met twee juiste antwoorden of een verwijzing naar een niet-bestaand
 * leerdoel is erger dan een ontbrekende vraag: je leert er iets verkeerds van
 * en merkt het pas op het examen. Deze validator draait daarom bij het seeden
 * én als losse test, en weigert bij fouten door te gaan.
 * ------------------------------------------------------------------------- */

export interface ValidationIssue {
  pack: string;
  questionId?: string;
  severity: 'error' | 'warning';
  message: string;
}

const EXPECTED_OPTION_COUNT = 4;
const LIST_ITEM_COUNT = 4;

function validateQuestion(
  pack: ContentPack,
  question: QuestionSeed,
  objectiveCodes: Set<string>,
  seenIds: Set<string>,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const id = question.id;
  const add = (severity: 'error' | 'warning', message: string) =>
    issues.push({ pack: pack.certification.id, questionId: id, severity, message });

  if (seenIds.has(id)) {
    add('error', `Dubbele vraag-id '${id}'.`);
  }
  seenIds.add(id);

  if (!objectiveCodes.has(question.objective)) {
    add('error', `Verwijst naar onbekend leerdoel '${question.objective}'.`);
  }

  // Precies vier opties, precies één juist: dat is het PeopleCert- en
  // EXIN-format voor alle vraagtypes, inclusief 'list'.
  if (question.options.length !== EXPECTED_OPTION_COUNT) {
    add('error', `Heeft ${question.options.length} opties in plaats van ${EXPECTED_OPTION_COUNT}.`);
  }

  const correctCount = question.options.filter((o) => o.correct === true).length;
  if (correctCount !== 1) {
    add('error', `Heeft ${correctCount} juiste antwoorden; er moet er precies één zijn.`);
  }

  if (question.type === 'list') {
    if (!question.listItems) {
      add('error', "Type 'list' zonder listItems.");
    } else if (question.listItems.length !== LIST_ITEM_COUNT) {
      add('error', `Type 'list' heeft ${question.listItems.length} statements in plaats van ${LIST_ITEM_COUNT}.`);
    }
  } else if (question.listItems) {
    add('warning', `Heeft listItems maar type is '${question.type ?? 'standard'}'.`);
  }

  // Tweetaligheid: een lege vertaling levert tijdens een examen een lege vraag op.
  const bilinguals: Array<[string, { nl: string; en: string } | undefined]> = [
    ['stem', question.stem],
    ['explanation', question.explanation],
  ];
  for (const [field, value] of bilinguals) {
    if (!value?.nl?.trim()) add('error', `Veld '${field}' mist Nederlandse tekst.`);
    if (!value?.en?.trim()) add('error', `Veld '${field}' mist Engelse tekst.`);
  }

  question.options.forEach((option, index) => {
    if (!option.text?.nl?.trim()) add('error', `Optie ${index + 1} mist Nederlandse tekst.`);
    if (!option.text?.en?.trim()) add('error', `Optie ${index + 1} mist Engelse tekst.`);
    // Een afleider zonder uitleg leert je niets over waarom je fout zat.
    if (!option.correct && !option.rationale) {
      add('warning', `Afleider ${index + 1} heeft geen rationale.`);
    }
  });

  // Duplicaten binnen één vraag maken de vraag onbedoeld makkelijker.
  const texts = question.options.map((o) => o.text.nl.trim().toLowerCase());
  if (new Set(texts).size !== texts.length) {
    add('error', 'Bevat twee identieke antwoordopties.');
  }

  // Negatieve vragen moeten het signaalwoord bevatten, anders leest de kandidaat
  // eroverheen — precies de fout die het examen uitlokt.
  if (question.type === 'negative') {
    const hasMarker = /\bNIET\b|\bGEEN\b|\bNOT\b/.test(`${question.stem.nl} ${question.stem.en}`);
    if (!hasMarker) {
      add('warning', "Type 'negative' zonder duidelijk signaalwoord (NIET/GEEN/NOT) in de stem.");
    }
  }

  if (question.type === 'missing_word' && !question.stem.nl.includes('[ ? ]')) {
    add('warning', "Type 'missing_word' zonder '[ ? ]'-plaatshouder in de stem.");
  }

  return issues;
}

export function validatePack(pack: ContentPack): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const packId = pack.certification.id;

  const domainCodes = new Set(pack.domains.map((d) => d.code));
  const objectiveCodes = new Set(pack.objectives.map((o) => o.code));
  const seenIds = new Set<string>();

  // De wegingen komen uit de officiële syllabus en moeten optellen tot 100%.
  const totalWeight = pack.domains.reduce((sum, d) => sum + d.weight, 0);
  if (Math.abs(totalWeight - 100) > 0.01) {
    issues.push({
      pack: packId,
      severity: 'error',
      message: `Domeinwegingen tellen op tot ${totalWeight}% in plaats van 100%.`,
    });
  }

  for (const objective of pack.objectives) {
    if (!domainCodes.has(objective.domain)) {
      issues.push({
        pack: packId,
        severity: 'error',
        message: `Leerdoel ${objective.code} verwijst naar onbekend domein '${objective.domain}'.`,
      });
    }
  }

  for (const question of pack.questions) {
    issues.push(...validateQuestion(pack, question, objectiveCodes, seenIds));
  }

  // Een domein zonder vragen kan niet in een proefexamen worden vertegenwoordigd.
  const questionsByDomain = new Map<string, number>();
  for (const question of pack.questions) {
    const objective = pack.objectives.find((o) => o.code === question.objective);
    if (!objective) continue;
    questionsByDomain.set(
      objective.domain,
      (questionsByDomain.get(objective.domain) ?? 0) + 1,
    );
  }
  for (const domain of pack.domains) {
    const count = questionsByDomain.get(domain.code) ?? 0;
    // Hoeveel vragen dit domein in één examen van 40 vragen moet leveren.
    const needed = Math.round((domain.weight / 100) * pack.certification.questionCount);
    if (count === 0) {
      issues.push({
        pack: packId,
        severity: 'error',
        message: `Domein ${domain.code} (${domain.title.nl}) heeft geen vragen.`,
      });
    } else if (count < needed) {
      issues.push({
        pack: packId,
        severity: 'warning',
        message:
          `Domein ${domain.code} heeft ${count} vragen; een examen vraagt er ${needed}. ` +
          'Het proefexamen vult aan uit andere domeinen.',
      });
    }
  }

  const glossaryTerms = new Set<string>();
  for (const term of pack.glossary) {
    const key = term.termEn.toLowerCase();
    if (glossaryTerms.has(key)) {
      issues.push({
        pack: packId,
        severity: 'warning',
        message: `Dubbele glossariumterm '${term.termEn}'.`,
      });
    }
    glossaryTerms.add(key);
    if (term.objective && !objectiveCodes.has(term.objective)) {
      issues.push({
        pack: packId,
        severity: 'error',
        message: `Glossariumterm '${term.termEn}' verwijst naar onbekend leerdoel '${term.objective}'.`,
      });
    }
  }

  return issues;
}

export function validateAll(): ValidationIssue[] {
  return contentPacks.flatMap(validatePack);
}

/** Statistiek voor het dashboard en de rapportage na het seeden. */
export function packStats(pack: ContentPack) {
  const byDomain = pack.domains.map((domain) => {
    const objectives = pack.objectives.filter((o) => o.domain === domain.code);
    const codes = new Set(objectives.map((o) => o.code));
    const questions = pack.questions.filter((q) => codes.has(q.objective));
    return {
      code: domain.code,
      title: domain.title,
      weight: domain.weight,
      objectiveCount: objectives.length,
      questionCount: questions.length,
      coveredObjectives: new Set(questions.map((q) => q.objective)).size,
    };
  });

  const byType = pack.questions.reduce<Record<string, number>>((acc, q) => {
    const type = q.type ?? 'standard';
    acc[type] = (acc[type] ?? 0) + 1;
    return acc;
  }, {});

  return {
    certification: pack.certification.id,
    totalQuestions: pack.questions.length,
    totalObjectives: pack.objectives.length,
    coveredObjectives: new Set(pack.questions.map((q) => q.objective)).size,
    glossaryTerms: pack.glossary.length,
    byDomain,
    byType,
  };
}
