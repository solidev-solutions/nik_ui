import AxeBuilder from '@axe-core/playwright'

import { expect, openMenu, pages, test } from './library.ts'

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`in the ${colorScheme} theme`, () => {
    test.use({ colorScheme })

    for (const path of pages) {
      test(`${path}: no axe findings`, async ({ page }) => {
        await page.goto(path)
        const root = expect(page.locator('html'))
        await (colorScheme === 'dark' ? root : root.not).toContainClass('dark')
        const { violations } = await new AxeBuilder({ page }).analyze()
        expect(violations).toEqual([])
      })

      test(`${path}: no axe findings at 390 px with the menu open`, async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 })
        await page.goto(path)
        await expect(await openMenu(page)).toBeVisible()
        // The open menu locks the page's scroll, which hides what overflows the body, and the body
        // has no height where all in it is fixed: axe then takes the menu for cut off and leaves
        // its contrast unchecked.
        await page.addStyleTag({ content: 'body { min-height: 100vh }' })
        const { violations } = await new AxeBuilder({ page }).analyze()
        expect(violations).toEqual([])
      })
    }
  })
}
