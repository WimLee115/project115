import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

/**
 * Lintregels voor Project115.
 *
 * `next lint` is met Next 16 verdwenen; dit is de vervanger. De opzet is
 * bewust bescheiden: alleen regels die op echte fouten wijzen, geen
 * stijlvoorschriften. De typecontrole (`npm run typecheck`) doet het zware
 * werk al, en een lint die over komma's klaagt gaat iedereen uitzetten.
 */
export default tseslint.config(
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'dist-web/**',
      'dist-single/**',
      'release/**',
      'drizzle/**',
      'android-app/android/**',
      'next-env.d.ts',
      '**/*.tsbuildinfo',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // De hooks-regels vervangen het stuk van `next lint` dat er werkelijk toe
    // deed. Bewust alleen deze twee, niet de volledige `recommended` van
    // eslint-plugin-react-hooks 7: die zet ook de purity-regels van de React
    // Compiler aan, en die keuren hier `Date.now()` in een event handler af
    // alsof het in de render staat. Dat is werkende code die dan rood wordt,
    // zonder dat er een bug onder zit.
    plugins: { 'react-hooks': reactHooks },
    rules: {
      // Hooks alleen op het hoogste niveau en alleen vanuit componenten.
      // Overtreed je dit, dan is het echt kapot.
      'react-hooks/rules-of-hooks': 'error',
      // Een onvolledige dependency-lijst is een bug die zich pas maanden
      // later laat zien. Waarschuwing, want soms is het weglaten bewust.
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    rules: {
      // Een ongebruikte variabele is meestal een vergeten regel. Een naam die
      // met _ begint is een bewuste keuze en mag blijven staan.
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // `any` is soms de eerlijkste beschrijving van wat er binnenkomt.
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    // Scripts draaien in Node en loggen naar de console; dat hoort daar.
    files: ['scripts/**/*.ts', 'test/**/*.ts', 'test/**/*.mts'],
    rules: {
      'no-console': 'off',
    },
  },
);
