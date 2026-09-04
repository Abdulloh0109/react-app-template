import js from '@eslint/js'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

/**
 * Layer boundaries.
 *
 * The architecture rule is `pages → templates/organisms → ui (molecules →
 * atoms)`, with data flowing `services → lib/api`. Discipline alone does not
 * keep that true across contributors, so each layer below declares which
 * higher layers it may not import. Adding a rule here is cheaper than
 * untangling a cycle later.
 *
 * To add a layer: give it an entry, and list it in the `forbidden` array of
 * every layer that must not depend on it.
 */
const layer = (files, forbidden, message) => ({
  files,
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: forbidden.flatMap((name) => [`@/${name}`, `@/${name}/*`]),
            message,
          },
        ],
      },
    ],
  },
})

const APP_LAYERS = [
  'pages',
  'router',
  'templates',
  'organisms',
  'providers',
  '_shared',
]

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'coverage'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
    },
  },

  /* ------------------------- layer boundary rules ------------------------- */

  layer(
    ['src/tokens/**', 'src/utils/**', 'src/types/**', 'src/constants/**'],
    [...APP_LAYERS, 'ui', 'services', 'lib', 'hooks', 'store', 'mocks'],
    'Foundation layer: tokens/utils/types/constants must not depend on anything above them.'
  ),

  layer(
    ['src/ui/**'],
    [...APP_LAYERS, 'services', 'lib', 'mocks'],
    'The UI kit is presentational: no data fetching, no feature code. Pass values in as props.'
  ),

  layer(
    ['src/lib/**'],
    [...APP_LAYERS, 'ui', 'services', 'hooks'],
    'lib/ is infrastructure — it must not reach up into features or UI.'
  ),

  layer(
    ['src/services/**'],
    [...APP_LAYERS, 'ui'],
    'Services are data-only: they must not import UI or app shell code.'
  ),

  layer(
    ['src/organisms/**', 'src/templates/**'],
    ['pages', 'router', 'providers'],
    'Organisms and templates are composed by pages, never the other way round.'
  ),

  /* --------------------- data access goes via services -------------------- */

  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
      'src/services/**',
      'src/lib/**',
      'src/mocks/**',
      'src/**/*.test.{ts,tsx}',
      'src/test/**',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/lib/api', '@/lib/api/*'],
              message:
                'Call the API through a service hook in src/services, not the raw client.',
            },
            {
              group: ['@/mocks', '@/mocks/*'],
              message:
                'Mock data must not leak into app code — it is wired in through the axios adapter only.',
            },
          ],
        },
      ],
    },
  },

  /* ------------------------------- tests ---------------------------------- */

  {
    files: ['src/**/*.test.{ts,tsx}', 'src/test/**'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  }
)
