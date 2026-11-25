import { expect, test } from './library.ts'

test.describe('with the clipboard allowed', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] })

  test('a press on a copy button copies the link, and that button says so', async ({ page }) => {
    await page.goto('/components/buttons-and-links')
    const example = page.getByRole('group', { name: 'Copy', exact: true })
    // The one with its label, then the one that is an icon alone.
    for (const at of [0, 1]) {
      await page.evaluate(() => navigator.clipboard.writeText(''))
      const buttons = example.getByRole('button')
      await buttons.nth(at).click()
      await expect(buttons.nth(at)).toHaveAccessibleName('Copied')
      await expect(buttons.nth(1 - at)).toHaveAccessibleName('Copy link')
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
        'https://example.com/projects/2417',
      )
      await page.reload()
    }
  })
})
