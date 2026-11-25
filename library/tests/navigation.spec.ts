import type { Locator, Page } from '@playwright/test'

import { expect, openMenu, test } from './library.ts'

const rail = (page: Page) => page.getByRole('complementary', { name: 'NichtImKopf UI' })

/** What a color role of the theme comes to in the page. */
const color = (page: Page, role: string) =>
  page.evaluate((role) => {
    const probe = document.body.appendChild(document.createElement('span'))
    probe.style.color = `var(${role})`
    const { color } = getComputedStyle(probe)
    probe.remove()
    return color
  }, role)

async function expectDestinations(within: Locator) {
  const links = within.getByRole('link')
  const names = ['NichtImKopf UI, home', 'Foundation', 'Components']
  await expect(links).toHaveCount(names.length)
  for (const [index, name] of names.entries()) {
    await expect(links.nth(index)).toHaveAccessibleName(name)
  }
}

test('the rail lists the way home and the areas by their names', async ({ page }) => {
  await page.goto('/')
  await expectDestinations(rail(page))
  await expect(rail(page).getByRole('navigation', { name: 'Areas' })).toBeVisible()
})

// The class of the brand mark's look is one of Nuxt UI's own too, so no built stylesheet tells
// whether the look brought it: the mark itself does.
test('the way home shows the brand mark in the primary color', async ({ page }) => {
  await page.goto('/')
  const mark = rail(page).getByRole('link', { name: 'home' }).locator('svg')
  await expect(mark).toHaveCSS('color', await color(page, '--ui-primary'))
})

test('on the start page the way home is the current destination', async ({ page }) => {
  await page.goto('/')
  await expect(rail(page).getByRole('link', { name: 'home' })).toHaveAttribute(
    'aria-current',
    'page',
  )
  await expect(rail(page).locator('[aria-current]')).toHaveCount(1)
})

test('a click on an area opens its page and marks the area as the current one', async ({
  page,
}) => {
  await page.goto('/')
  const area = rail(page).getByRole('link', { name: 'Components' })
  await area.click()
  await expect(page).toHaveURL('/components')
  await expect(page.getByRole('heading', { level: 1, name: 'Components' })).toBeVisible()
  await expect(area).toHaveAttribute('aria-current', 'page')
  await expect(rail(page).locator('[aria-current]')).toHaveCount(1)
})

test.describe('in the dark theme', () => {
  // Only there is the raised surface another one than the page's.
  test.use({ colorScheme: 'dark' })

  test('the tooltip of a rail entry shows its name on the raised surface', async ({ page }) => {
    await page.goto('/')
    await rail(page).getByRole('link', { name: 'Foundation' }).hover()
    // The element in the tooltip role is a copy of the name for a screen reader, inside what shows.
    const tooltip = page.getByRole('tooltip', { name: 'Foundation' }).locator('..')
    await expect(tooltip).toBeVisible()
    await expect(tooltip).toHaveCSS('background-color', await color(page, '--ui-bg-raised'))
  })
})

test('below 1024 px the menu offers the same destinations and closes once one is chosen', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1023, height: 768 })
  await page.goto('/')
  const menu = await openMenu(page)
  await expectDestinations(menu)

  await menu.getByRole('link', { name: 'Foundation' }).click()
  await expect(menu).toBeHidden()
  await expect(page.getByRole('heading', { level: 1, name: 'Foundation' })).toBeVisible()
})

test('the menu closes where the window grows to 1024 px, and the page takes a click again', async ({
  page,
}) => {
  await page.setViewportSize({ width: 800, height: 768 })
  await page.goto('/')
  await expect(await openMenu(page)).toBeVisible()

  await page.setViewportSize({ width: 1200, height: 768 })
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await rail(page).getByRole('link', { name: 'Components' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Components' })).toBeVisible()
})
