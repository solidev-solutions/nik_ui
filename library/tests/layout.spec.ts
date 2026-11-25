import type { Page } from '@playwright/test'

import { content, expect, test } from './library.ts'

/** The tokens as the page shows them: a token's name, and under it the numbers of its line. */
async function shown(page: Page) {
  await content(page, '/foundation/layout')
  const tokens = await page
    .getByRole('main')
    .getByRole('button')
    .evaluateAll((all: HTMLButtonElement[]) => all.map((token) => token.innerText.split('\n')))
  return Object.fromEntries(
    tokens.map(([name, value]) => [name, value!.match(/\d+/g)!.map(Number)] as const),
  )
}

// The test measures the library's own frame, which is the kit's frame with the theme's looks.
test('the page shows the gutter, the head’s height and the width the frame docks at, as the library’s frame has them', async ({
  page,
}) => {
  await page.goto('/foundation/layout')
  const tokens = await shown(page)
  expect(Object.keys(tokens)).toEqual(['p-4 sm:p-6', 'h-(--ui-header-height)', 'lg:'])
  const [gutter, gutterFromSm, sm] = tokens['p-4 sm:p-6']!
  const [head] = tokens['h-(--ui-header-height)']!
  const [lg] = tokens['lg:']!

  await expect(page.getByRole('banner')).toHaveCSS('height', `${head}px`)

  // The page's body, around its content.
  const body = page.getByRole('main').locator('..')
  await page.setViewportSize({ width: sm! - 1, height: 768 })
  await expect(body).toHaveCSS('padding-top', `${gutter}px`)
  await page.setViewportSize({ width: sm!, height: 768 })
  await expect(body).toHaveCSS('padding-top', `${gutterFromSm}px`)

  // The sidebar beside the page holds the area's navigation.
  const sidebar = page.getByRole('navigation', { name: 'Foundation' })
  await page.setViewportSize({ width: lg! - 1, height: 768 })
  await expect(sidebar).toBeHidden()
  await page.setViewportSize({ width: lg!, height: 768 })
  await expect(sidebar).toBeVisible()
})

test('the measures are the frame’s at the usual 16 px of text, whatever size a reader has set', async ({
  page,
}) => {
  await page.goto('/foundation/layout')
  const tokens = await shown(page)
  // Set before the page reads its values: it is opened from the Foundation's page, without a load.
  await page.goto('/foundation')
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '32px'
  })
  await page.getByRole('main').getByRole('link', { name: 'Layout' }).click()
  await page.getByRole('heading', { name: 'Frame' }).waitFor()
  expect(await shown(page)).toEqual(tokens)
})

test.describe('with the clipboard allowed', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] })

  test('a press on a token copies its name and says so', async ({ page }) => {
    await page.goto('/foundation/layout')
    await page.getByRole('main').getByRole('button', { name: 'p-4 sm:p-6' }).click()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('p-4 sm:p-6')
    await expect(page.getByRole('status')).toHaveText('Copied: p-4 sm:p-6')
  })
})
