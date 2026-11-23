import { readFileSync } from 'node:fs'

import type { Page } from '@playwright/test'
import tailwind from 'tailwindcss/colors'

import { nikTheme } from '../../src/theme/index.ts'
import { expect, test } from './library.ts'

/** The tiles as the page shows them: under a palette's heading, each step with its value. */
async function shown(page: Page) {
  const headings = page.getByRole('main').getByRole('heading', { level: 2 })
  await headings.first().waitFor()
  return headings.evaluateAll((all) =>
    Object.fromEntries(
      all.map((heading) => [
        heading.textContent,
        Object.fromEntries(
          [...heading.closest('section')!.querySelectorAll('button')].map((tile) =>
            tile.innerText.split('\n'),
          ),
        ),
      ]),
    ),
  )
}

// A tile's name for a screen reader is what stands under it: the step and its value.
const walnut700 = (page: Page) => page.getByRole('button', { name: '700 #6F4E37' })
const stone200 = (page: Page) => page.getByRole('button', { name: '200 #E7E5E4' })

const toasts = (page: Page) =>
  page.getByRole('region', { name: 'Notifications' }).getByRole('listitem')

// The test reads the theme as the page does, by another way: the stylesheet as it is written, and
// Tailwind's own scale for a palette the theme defines no step of.
test('the page shows each palette of the theme under its heading, with the steps the theme defines', async ({
  page,
}) => {
  const css = readFileSync(new URL('../../src/theme.css', import.meta.url), 'utf8')
  const defined = Object.values(nikTheme.ui.colors).map((palette) => {
    const steps = [...css.matchAll(new RegExp(`--color-${palette}-(\\d+):`, 'g'))].map(
      ([, step]) => step,
    )
    return [palette, steps.length ? steps : Object.keys(tailwind[palette as 'stone'])]
  })

  await page.goto('/foundation/palettes')
  const steps = Object.entries(await shown(page)).map(([palette, tiles]) => [
    palette,
    Object.keys(tiles),
  ])
  expect(Object.fromEntries(steps)).toEqual(Object.fromEntries(defined))
})

test('a step shows its value in hex, the same in the dark theme', async ({ page }) => {
  await page.goto('/foundation/palettes')
  const light = await shown(page)
  // One step that the theme writes in hex, and one it writes in oklch: there a browser's own
  // conversion may end one unit beside the exact one.
  expect(light.walnut['700']).toBe('#6F4E37')
  expect(['#FBF6F1', '#FBF6F2']).toContain(light.walnut['50'])

  await page.emulateMedia({ colorScheme: 'dark' })
  await page.reload()
  await expect(page.locator('html')).toContainClass('dark')
  expect(await shown(page)).toEqual(light)
})

test.describe('with the clipboard allowed', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] })

  test('a press on a tile copies its name and says so, with the pointer and with the keyboard', async ({
    page,
  }) => {
    await page.goto('/foundation/palettes')
    const copied = () => page.evaluate(() => navigator.clipboard.readText())

    await expect(walnut700(page)).toHaveAccessibleDescription('Copy primary-700')
    await walnut700(page).click()
    expect(await copied()).toBe('primary-700')
    await expect(page.getByRole('status')).toHaveText('Copied: primary-700')
    await expect(toasts(page)).toHaveText('Copiedprimary-700')

    await stone200(page).focus()
    await page.keyboard.press('Enter')
    expect(await copied()).toBe('neutral-200')
    await expect(page.getByRole('status')).toHaveText('Copied: neutral-200')

    // The same name once more is said once more: a line that stays as it is says nothing.
    const said = await page.getByRole('status').evaluateHandle((status) => {
      const lines: (string | null)[] = []
      new MutationObserver(() => lines.push(status.textContent)).observe(status, {
        childList: true,
        characterData: true,
        subtree: true,
      })
      return lines
    })
    await page.keyboard.press('Enter')
    await expect.poll(() => said.jsonValue()).toEqual(['', 'Copied: neutral-200'])
  })
})

// A browser without the permission, as the test's is by itself.
test('where the browser refuses to copy, the page says that', async ({ page }) => {
  await page.goto('/foundation/palettes')
  await walnut700(page).click()
  await expect(page.getByRole('status')).toHaveText('Could not copy: primary-700')
  await expect(toasts(page)).toHaveText('Could not copyprimary-700')
})

// The theme's prop defaults: Nuxt UI shows a toast at the bottom right, with a bar that runs out.
test('a toast stands in the middle of the bottom edge, without a bar', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/foundation/palettes')
  await walnut700(page).click()
  const toast = toasts(page)
  await expect(toast).toBeVisible()
  await expect
    .poll(async () => {
      const { x, y, width, height } = (await toast.boundingBox())!
      return { left: x, right: 1280 - x - width, below: 720 - y - height }
    })
    .toEqual({ left: 448, right: 448, below: 16 })
  // Looked at once, while the toast stands: a bar is gone with its toast.
  expect(await toast.getByRole('progressbar').count()).toBe(0)
})

// The steps that fit in one row there: eleven from 1440 px, six at 1024 px beside the navigation.
for (const { width, fit } of [
  { width: 1440, fit: 11 },
  { width: 1024, fit: 6 },
]) {
  test(`at ${width} px a palette of up to ${fit} steps reaches from one edge of the page’s column to the other`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/foundation/palettes')
    const rows = page.getByRole('main').getByRole('list')
    await expect(rows).toHaveCount(Object.keys(nikTheme.ui.colors).length)
    const main = (await page.getByRole('main').boundingBox())!
    let measured = 0
    for (const row of await rows.all()) {
      if ((await row.getByRole('button').count()) > fit) continue
      measured++
      const first = (await row.getByRole('button').first().boundingBox())!
      const last = (await row.getByRole('button').last().boundingBox())!
      // The 32 px that the page keeps free at each side of its column.
      expect(first.x - main.x).toBe(32)
      expect(main.x + main.width - last.x - last.width).toBeCloseTo(32, 0)
    }
    expect(measured).toBeGreaterThanOrEqual(4)
  })
}
