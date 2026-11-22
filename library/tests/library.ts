import { expect, test as base, type Page } from '@playwright/test'

import { AREAS } from '../src/areas.ts'

export const pages = ['/', ...AREAS.map((area) => `/${area.id}`)]

/**
 * Fails when a page of the test requests something from another origin before the test ends, as
 * it does for an icon the build lacks.
 */
export const test = base.extend<{ sameOrigin: void }>({
  sameOrigin: [
    async ({ context, baseURL }, use) => {
      const here = baseURL && new URL(baseURL).origin
      const elsewhere: string[] = []
      context.on('request', (request) => {
        if (new URL(request.url()).origin !== here) elsewhere.push(request.url())
      })
      await use()
      expect(elsewhere).toEqual([])
    },
    { auto: true },
  ],
})

/** Opens the menu that stands for rail and navigation below 1024 px. */
export async function openMenu(page: Page) {
  await page.getByRole('button', { name: 'Open sidebar' }).click()
  return page.getByRole('dialog')
}

export { expect }
