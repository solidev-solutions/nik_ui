import { expect, test as base, type Page } from '@playwright/test'

import { AREAS, LIBRARY } from '../src/areas.ts'

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

/** What a color role of the theme comes to in the page. */
export const color = (page: Page, role: string) =>
  page.evaluate((role) => {
    const probe = document.body.appendChild(document.createElement('span'))
    probe.style.color = `var(${role})`
    const { color } = getComputedStyle(probe)
    probe.remove()
    return color
  }, role)

/** Opens the menu that stands for rail and navigation below 1024 px, from the page's head. */
export async function openMenu(page: Page) {
  await page.getByRole('banner').getByRole('button', { name: 'Open sidebar' }).click()
  return page.getByRole('dialog', { name: LIBRARY })
}

export { expect }
