import { fileURLToPath } from 'node:url'

import { defineConfig } from '@playwright/test'

// The scripts are the package's, a folder above.
const cwd = fileURLToPath(new URL('..', import.meta.url))

/** The library as it is developed: only there do Vue and Reka UI write their warnings. */
export const development = 'http://localhost:5733'

export default defineConfig({
  testDir: 'tests',
  forbidOnly: Boolean(process.env.CI),
  // Playwright starts them one after the other, so the first builds what both serve.
  webServer: [
    {
      cwd,
      command:
        'npm run library:build && npx --no-install vite preview library --port 5732 --strictPort',
      port: 5732,
      // The build is part of the start: on a machine under load it outlasts Playwright's 60 s.
      timeout: 180_000,
    },
    { cwd, command: 'npx --no-install vite library --port 5733 --strictPort', port: 5733 },
  ],
  use: { baseURL: 'http://localhost:5732' },
})
