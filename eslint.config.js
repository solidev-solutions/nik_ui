import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import { importX } from 'eslint-plugin-import-x'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from 'eslint-config-prettier/flat'

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  skipFormatting,

  {
    name: 'nik/published-imports',
    // What ships may import only what an app that installs the package gets with it.
    files: ['src/**/*.{vue,ts,mts,tsx}'],
    plugins: { 'import-x': importX },
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        { devDependencies: false, includeTypes: true },
      ],
    },
  },

  {
    name: 'nik/ported-names',
    files: ['src/kit/Frame.vue'],
    // A port keeps the names of its original, and ReUI names the frame's outer part in one word.
    rules: { 'vue/multi-word-component-names': ['error', { ignores: ['Frame'] }] },
  },

  {
    name: 'nik/library-tests',
    // Only the `test` of tests/library.ts fails on a request to another origin.
    files: ['library/tests/**/*.ts'],
    ignores: ['library/tests/library.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@playwright/test',
              importNames: ['test', 'default'],
              message: 'Take `test` from ./library.ts.',
            },
          ],
        },
      ],
    },
  },
)
