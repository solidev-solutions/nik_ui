import type { Locator, Page } from '@playwright/test'

import { LIBRARY } from '../src/areas.ts'
import { color, expect, openMenu, test } from './library.ts'

const rail = (page: Page) => page.getByRole('complementary', { name: 'NichtImKopf UI' })

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
  // The current area's fill is the theme's: Nuxt UI sets its own in a variant that outranks a
  // plain one.
  await expect
    .poll(() => area.evaluate((link) => getComputedStyle(link, '::before').backgroundColor))
    .toBe(await color(page, '--ui-bg-selected'))
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

// Of the theme's prop defaults the library shows this one at work: the rail's tooltips have no
// delay by Nuxt UI's own doing, and the library's only slideover is the menu.
test('a rail entry that takes the focus without a key shows no tooltip', async ({ page }) => {
  await page.goto('/')
  // A focus that a script sets counts as the kind of focus before it: here a click's, which no
  // key brought.
  await rail(page).getByRole('link', { name: 'home' }).click()
  const entry = rail(page).getByRole('link', { name: 'Foundation' })
  await entry.focus()
  await expect(entry).toBeFocused()
  await expect(page.getByRole('tooltip')).toHaveCount(0)

  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('tooltip', { name: 'Foundation' })).toBeVisible()
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

  // Also for the destination a reader is on already, where no page changes.
  const again = await openMenu(page)
  await again.getByRole('link', { name: 'Foundation', exact: true }).click()
  await expect(again).toBeHidden()
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

async function expectFoundationPages(within: Page | Locator) {
  const navigation = within.getByRole('navigation', { name: 'Foundation' })
  await expect(navigation.getByRole('listitem')).toHaveText([
    'Colors',
    'Palettes',
    'Roles',
    'Type and icons',
    'Typography',
    'Shape and space',
    'Elevation',
    'Layout',
  ])
  await expect(navigation.getByRole('link', { name: 'Palettes' })).toHaveAttribute(
    'aria-current',
    'page',
  )
}

test('beside a page of the Foundation its navigation lists the pages under their groups', async ({
  page,
}) => {
  await page.goto('/foundation/palettes')
  await expectFoundationPages(page)
  // The rail shows the area as the one that is open.
  await expect(rail(page).getByRole('link', { name: 'Foundation' })).toHaveAttribute(
    'data-active',
    '',
  )

  await rail(page).getByRole('link', { name: 'Components' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Components' })).toBeVisible()
  // The rail's is the only navigation left.
  await expect(page.getByRole('navigation')).toHaveCount(1)
})

test('below 1024 px the menu shows the Foundation’s pages beside the rail’s destinations', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1023, height: 768 })
  await page.goto('/foundation/palettes')
  const menu = await openMenu(page)
  await expectFoundationPages(menu)
  await expect(menu.getByRole('link', { name: 'home' })).toBeVisible()
  const areas = menu.getByRole('navigation', { name: 'Areas' })
  await expect(areas.getByRole('link', { name: 'Foundation' })).toBeVisible()
  await expect(areas.getByRole('link', { name: 'Components' })).toBeVisible()
})

test('a change of page is announced by its title, the page of arrival is not', async ({ page }) => {
  await page.goto('/foundation')
  const announcer = page.getByRole('status')
  // The page has arrived: only then would the line have been filled.
  await expect(page.getByRole('heading', { level: 1, name: 'Foundation' })).toBeVisible()
  await expect(announcer).toBeEmpty()

  await rail(page).getByRole('link', { name: 'Components' }).click()
  await expect(announcer).toHaveText(`Components · ${LIBRARY}`)

  await rail(page).getByRole('link', { name: 'home' }).click()
  await expect(announcer).toHaveText(LIBRARY)
})

test('a change of page from the menu is announced where a screen reader hears it', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1023, height: 768 })
  await page.goto('/foundation')
  await expect(page.getByRole('heading', { level: 1, name: 'Foundation' })).toBeVisible()
  // Whether the line was open to a screen reader each time it got a text: an open dialog hides
  // what is around it.
  const heard = await page.evaluateHandle(() => {
    const line = document.querySelector('[role=status]')!
    const heard: boolean[] = []
    new MutationObserver(() => {
      if (line.textContent) heard.push(!line.closest('[aria-hidden=true]'))
    }).observe(line, { childList: true, characterData: true, subtree: true })
    return heard
  })
  const menu = await openMenu(page)
  await menu.getByRole('link', { name: 'Components' }).click()
  await expect.poll(() => heard.jsonValue()).toEqual([true])
})
