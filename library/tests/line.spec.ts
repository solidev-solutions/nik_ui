import type { Page } from '@playwright/test'

import { expect, test } from './library.ts'

// The line between the Foundation's navigation and its page, from 1024 px.
const open = 'Drag to resize. Click to collapse.'
const folded = 'Click to expand.'
const line = (page: Page, name = open) => page.getByRole('separator', { name })
// The navigation's box, which is there folded too.
const sidebar = (page: Page) => page.locator('#library-sidebar-navigation')
const navigation = (page: Page) => page.getByRole('navigation', { name: 'Foundation' })

async function drag(page: Page, by: number) {
  const { x, y, width, height } = (await line(page).boundingBox())!
  await page.mouse.move(x + width / 2, y + height / 2)
  await page.mouse.down()
  await page.mouse.move(x + width / 2 + by, y + height / 2, { steps: 4 })
  await page.mouse.up()
}

test('a click on the line folds the navigation, out of sight, focus and speech, and a second opens it', async ({
  page,
}) => {
  await page.goto('/foundation/palettes')
  const link = sidebar(page).getByRole('link', { name: 'Palettes', includeHidden: true })

  await line(page).click()
  await expect(sidebar(page)).toHaveCSS('width', '1px')
  await expect(link).toBeHidden()
  await expect(navigation(page)).toHaveCount(0)
  await link.focus()
  await expect(link).not.toBeFocused()

  await line(page, folded).click()
  await expect(sidebar(page)).toHaveCSS('width', '208px')
  await expect(navigation(page)).toBeVisible()
  await link.focus()
  await expect(link).toBeFocused()
})

test.describe('with reduced motion', () => {
  // The navigation folds at once there: a fold at the drag's end would show at the first look.
  test.use({ reducedMotion: 'reduce' })

  test('a drag on the line sizes the navigation and does not fold it', async ({ page }) => {
    await page.goto('/foundation/palettes')
    await drag(page, 80)
    await expect(sidebar(page)).toHaveCSS('width', '288px')
    await expect(navigation(page)).toBeVisible()
  })
})

test.describe('with a finger', () => {
  test.use({ hasTouch: true })

  test('a tap on the line folds the navigation', async ({ page }) => {
    await page.goto('/foundation/palettes')
    await line(page).tap()
    await expect(sidebar(page)).toHaveCSS('width', '1px')
  })
})

test('the navigation’s width and whether it is folded outlast a reload', async ({ page }) => {
  await page.goto('/foundation/palettes')
  await drag(page, 80)
  await expect(sidebar(page)).toHaveCSS('width', '288px')
  await page.reload()
  await expect(sidebar(page)).toHaveCSS('width', '288px')

  await line(page).click()
  await expect(sidebar(page)).toHaveCSS('width', '1px')
  await page.reload()
  await expect(line(page, folded)).toBeAttached()
  await expect(sidebar(page)).toHaveCSS('width', '1px')
  await expect(navigation(page)).toHaveCount(0)
})

test('without a pointer, a button in the page’s head folds the navigation and opens it', async ({
  page,
}) => {
  await page.goto('/foundation/palettes')
  // A focus that a script sets counts as the kind of focus before it: here a key's.
  await page.keyboard.press('Tab')
  await page.getByRole('banner').getByRole('button', { name: 'Collapse sidebar' }).focus()

  await page.keyboard.press('Enter')
  await expect(sidebar(page)).toHaveCSS('width', '1px')
  await expect(page.getByRole('button', { name: 'Expand sidebar' })).toBeFocused()

  await page.keyboard.press('Enter')
  await expect(sidebar(page)).toHaveCSS('width', '208px')
  await expect(navigation(page)).toBeVisible()
})
