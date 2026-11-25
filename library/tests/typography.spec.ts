import { readFileSync } from 'node:fs'

import type { Page } from '@playwright/test'

import { expect, test } from './library.ts'

// The measure and the weight that Tailwind's scale gives the classes of the six styles.
const STYLES: Record<string, [classes: string, style: string][]> = {
  Title: [
    ['text-xl font-semibold', '20/28 · Semibold'],
    ['text-base font-semibold', '16/24 · Semibold'],
  ],
  Label: [
    ['text-sm font-medium', '14/20 · Medium'],
    ['text-xs font-medium', '12/16 · Medium'],
  ],
  Paragraph: [
    ['text-sm', '14/20 · Regular'],
    ['text-xs', '12/16 · Regular'],
  ],
}
const WEIGHTS: Record<string, string> = { Regular: '400', Medium: '500', Semibold: '600' }

// The test reads a family's name by another way than the page: from the theme's stylesheet as it
// is written.
const css = readFileSync(new URL('../../src/theme.css', import.meta.url), 'utf8')
const family = (name: string) => new RegExp(`--font-${name}:\\s*'([^']+)'`).exec(css)![1]!

/** A token by the name a press on it copies. */
const token = (page: Page, name: string) => page.getByTitle(`Copy ${name}`, { exact: true })

/** The tokens as the page shows them: under a group's heading, each name with its line of value. */
async function shown(page: Page) {
  const headings = page.getByRole('main').getByRole('heading', { level: 2 })
  await headings.first().waitFor()
  return headings.evaluateAll((all) =>
    Object.fromEntries(
      all.map((heading) => [
        heading.textContent,
        [...heading.closest('section')!.querySelectorAll('button')].map((token) => [
          token.title.replace('Copy ', ''),
          token.innerText.split('\n').at(-1)!,
        ]),
      ]),
    ),
  )
}

test('the page shows the two families and the six styles under their headings, a style with the measure and the weight of its classes', async ({
  page,
}) => {
  await page.goto('/foundation/typography')
  const { Families, ...groups } = await shown(page)
  expect(Families).toEqual([
    ['font-sans', family('sans')],
    ['font-mono', family('mono')],
  ])
  // A style's line ends in its use, which is the page's own word.
  const styles = Object.entries(groups).map(([group, rows]) => [
    group,
    rows.map(([classes, line]) => [classes, line!.slice(0, line!.lastIndexOf(' · '))]),
  ])
  expect(styles).toEqual(Object.entries(STYLES))
})

// Tailwind's sizes are shares of the text size a reader has set in the browser.
test('a row shows its style’s measure, whatever text size the reader has set', async ({ page }) => {
  // Set before the page reads its values: it is opened from the Foundation's page, without a load.
  await page.goto('/foundation')
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '32px'
  })
  await page.getByRole('main').getByRole('link', { name: 'Typography' }).click()
  await expect(token(page, 'text-xl font-semibold')).toContainText('20/28 · Semibold')
  await expect(token(page, 'text-xl font-semibold').getByText('Open requests')).toHaveCSS(
    'font-size',
    '40px',
  )
})

test('a style’s specimen is set in that style, in the theme’s sans', async ({ page }) => {
  await page.goto('/foundation/typography')
  for (const [classes, style] of Object.values(STYLES).flat()) {
    // A row shows its classes, its specimen and its line of value.
    const [, sentence] = (await token(page, classes).innerText()).split('\n')
    const specimen = token(page, classes).getByText(sentence!, { exact: true })
    const [size, line, weight] = style.split(/\/| · /)
    await expect(specimen).toHaveCSS('font-size', `${size}px`)
    await expect(specimen).toHaveCSS('line-height', `${line}px`)
    await expect(specimen).toHaveCSS('font-weight', WEIGHTS[weight!]!)
    await expect(specimen).toHaveCSS('font-family', new RegExp(`^"${family('sans')}"`))
  }
})

test('a family’s tile shows the family the theme names, loaded, the sans with the slashed zero', async ({
  page,
}) => {
  await page.goto('/foundation/typography')
  for (const name of ['sans', 'mono']) {
    await expect(token(page, `font-${name}`).getByText('Aa 0')).toHaveCSS(
      'font-family',
      new RegExp(`^"${family(name)}"`),
    )
  }
  await expect(token(page, 'font-sans').getByText('Aa 0')).toHaveCSS(
    'font-feature-settings',
    '"zero"',
  )
  // The faces themselves: in the sans a narrow letter takes less room than a wide one, in the
  // mono both take the same.
  const widths = (name: string) =>
    token(page, `font-${name}`)
      .getByText('Aa 0')
      .evaluate((tile) =>
        ['i', 'm'].map((letter) => {
          const probe = tile.appendChild(document.createElement('span'))
          probe.textContent = letter
          const { width } = probe.getBoundingClientRect()
          probe.remove()
          return width
        }),
      )
  const [narrow, wide] = await widths('sans')
  expect(wide! / narrow!).toBeGreaterThan(2)
  const [one, other] = await widths('mono')
  expect(one).toBe(other)
  // Both have come from their files, and `test` lets a page load nothing from another origin.
  await expect
    .poll(() =>
      page.evaluate(() =>
        [...document.fonts].filter((face) => face.status === 'loaded').map((face) => face.family),
      ),
    )
    .toEqual(expect.arrayContaining([family('sans'), family('mono')]))
})

test.describe('with the clipboard allowed', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] })

  test('a press anywhere on a row copies its classes and says so, with the pointer and with the keyboard', async ({
    page,
  }) => {
    await page.goto('/foundation/typography')
    const copied = () => page.evaluate(() => navigator.clipboard.readText())

    // At the row's edge, beside what it shows.
    const row = page
      .getByRole('main')
      .getByRole('listitem')
      .filter({ hasText: 'text-xs font-medium' })
    await row.click({ position: { x: 6, y: 24 } })
    await expect(page.getByRole('status')).toHaveText('Copied: text-xs font-medium')
    expect(await copied()).toBe('text-xs font-medium')

    // And at its other edge, far from its text.
    const other = page.getByRole('main').getByRole('listitem').filter({ hasText: 'Chapter' })
    const { width } = (await other.boundingBox())!
    await other.click({ position: { x: width - 6, y: 24 } })
    await expect(page.getByRole('status')).toHaveText('Copied: text-xl font-semibold')

    await token(page, 'text-xl font-semibold').focus()
    await page.keyboard.press('Enter')
    await expect.poll(copied).toBe('text-xl font-semibold')
  })
})
