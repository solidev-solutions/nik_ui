import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    dir: 'test',
    globalSetup: 'test/global-setup.ts',
  },
})
