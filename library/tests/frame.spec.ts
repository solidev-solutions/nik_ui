import { development } from '../playwright.config.ts'
import { expect, openMenu, pages, test } from './library.ts'

test.describe('in development', () => {
  test.use({ baseURL: development })

  for (const path of pages) {
    test(`${path} loads without an error or a warning in the console`, async ({ page }) => {
      const messages: string[] = []
      page.on('console', (message) => {
        if (['error', 'warning'].includes(message.type())) messages.push(message.text())
      })
      page.on('pageerror', (error) => messages.push(error.message))

      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await page.waitForLoadState('networkidle')
      expect(messages).toEqual([])
    })
  }
})

test('the rail shows from 1024 px', async ({ page }) => {
  const rail = page.getByRole('complementary', { name: 'NichtImKopf UI' })

  await page.setViewportSize({ width: 1024, height: 768 })
  await page.goto('/')
  await expect(rail).toBeVisible()

  await page.setViewportSize({ width: 1023, height: 768 })
  await expect(rail).toBeHidden()
})

// Nuxt UI sizes its menu anew from 640 px, so the width is looked at on both sides of it.
for (const width of [1023, 639]) {
  test(`at ${width} px the menu opens, 288 px wide, and closes again`, async ({ page }) => {
    const menu = page.getByRole('dialog')

    await page.setViewportSize({ width, height: 768 })
    await page.goto('/')
    await openMenu(page)
    await expect(menu).toBeVisible()
    await expect(menu).toHaveCSS('width', '288px')

    await menu.getByRole('button', { name: 'Close sidebar' }).click()
    await expect(menu).toBeHidden()
  })
}
