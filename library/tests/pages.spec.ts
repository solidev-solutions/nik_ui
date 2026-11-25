import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`in the ${colorScheme} theme`, () => {
    test.use({ colorScheme })

    test('/: no axe findings', async ({ page }) => {
      await page.goto('/')
      const root = expect(page.locator('html'))
      await (colorScheme === 'dark' ? root : root.not).toContainClass('dark')
      const { violations } = await new AxeBuilder({ page }).analyze()
      expect(violations).toEqual([])
    })
  })
}
