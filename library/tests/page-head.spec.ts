import type { Page } from '@playwright/test'

import { expect, test } from './library.ts'

const title = (page: Page) => page.getByRole('heading', { level: 1 })
// Nuxt UI's name for a breadcrumb.
const path = (page: Page) =>
  page.getByRole('banner').getByRole('navigation', { name: 'breadcrumb' })

test('the head of a section shows the way up as a path that is not the current page', async ({
  page,
}) => {
  await page.goto('/foundation/palettes')
  await expect(title(page)).toHaveCount(1)
  await expect(title(page)).toHaveText('Palettes')
  await expect(path(page).getByRole('listitem')).toHaveText(['Foundation'])
  await expect(path(page).locator('[aria-current]')).toHaveCount(0)
  // The separator after the last page above, before the title.
  await expect(path(page).locator('[data-slot="separator"]')).toBeVisible()

  await path(page).getByRole('link').click()
  await expect(page).toHaveURL('/foundation')
  await expect(title(page)).toHaveText('Foundation')
  await expect(path(page)).toHaveCount(0)
})

// Text that a record's name could have: alone it is wider than the head's row.
const long = 'A name that alone is wider than the head at every width a screen has, '.repeat(3)

for (const width of [680, 1023, 1024, 1280]) {
  test(`at ${width} px, with long names, the path lies before the title and shows its link and its focus ring`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 600 })
    await page.goto('/foundation/palettes')
    const link = path(page).getByRole('link')
    const label = link.locator('[data-slot="linkLabel"]')
    // A focus that a script sets counts as the kind of focus before it: here a key's.
    await page.keyboard.press('Tab')
    await link.focus()
    await expect(link).toHaveCSS('outline-width', '3px')

    const cases = [
      { title: long, above: 'Foundation' },
      { title: 'Palettes', above: long },
      { title: long, above: long },
    ]
    for (const names of cases) {
      await title(page).evaluate((element, text) => (element.textContent = text), names.title)
      await label.evaluate((element, text) => (element.textContent = text), names.above)
      const { x: start, width: shown } = (await title(page).boundingBox())!
      expect(shown).toBeGreaterThan(0)
      const measured = await path(page).evaluate((nav) => {
        const parts = [...nav.querySelectorAll('*')].filter((part) => part.getClientRects().length)
        const link = nav.querySelector('a')!
        const label = link.querySelector('[data-slot="linkLabel"]')!
        const clipping: string[] = []
        for (
          let box = link.parentElement;
          box && box.tagName !== 'HEADER';
          box = box.parentElement
        ) {
          if (getComputedStyle(box).overflowX !== 'visible') clipping.push(box.tagName)
        }
        return {
          end: Math.max(...parts.map((part) => part.getBoundingClientRect().right)),
          shown: label.clientWidth,
          whole: label.scrollWidth,
          clipping,
        }
      })
      expect(measured.end).toBeLessThanOrEqual(start)
      // A link keeps 2rem, or its whole name where that is shorter.
      expect(measured.shown).toBeGreaterThanOrEqual(Math.min(measured.whole, 32))
      expect(measured.clipping).toEqual([])
      // Beside a title that takes all the room there is, the path has given way to its least.
      if (names.title === long && names.above === long) expect(measured.shown).toBe(32)
    }
  })
}

// The head's own width counts, less what it keeps free at each side: its padding, and the room for
// a scrollbar, which differs from one system to the next.
test('a head narrower than 36rem shows the title alone', async ({ page }) => {
  await page.setViewportSize({ width: 560, height: 600 })
  await page.goto('/foundation/palettes')
  const head = page.getByRole('banner')
  const inner = () =>
    head.evaluate((box) => {
      const { paddingLeft, paddingRight } = getComputedStyle(box)
      return box.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight)
    })
  await expect(path(page)).toHaveCount(0)
  await expect(head.getByRole('link', { includeHidden: true })).toBeHidden()

  // From 640 px the head keeps more free: its own width falls there once more.
  for (const width of [600, 632, 640, 648, 700]) {
    await page.setViewportSize({ width, height: 600 })
    await expect(path(page)).toHaveCount((await inner()) < 576 ? 0 : 1)
  }
  expect(await inner()).toBeGreaterThanOrEqual(576)
})

test('so does a head that the navigation beside it leaves less than that', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 600 })
  await page.goto('/foundation/palettes')
  await expect(path(page)).toBeVisible()

  // The navigation at its widest, as a drag leaves it.
  await page.evaluate(() =>
    localStorage.setItem(
      'library-sidebar-navigation',
      JSON.stringify({ size: 360, collapsed: false }),
    ),
  )
  await page.reload()
  await expect(title(page)).toBeVisible()
  await expect(path(page)).toHaveCount(0)
})
