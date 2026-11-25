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

// FieldGroup and Link are members of this family; the library shows no Switch yet.
test('a part to take instead of a Button leads to that part where the library shows it, and is plain text where it does not', async ({
  page,
}) => {
  await page.goto('/components/buttons-and-links')
  const main = page.getByRole('main')
  await main.getByRole('button', { name: 'AI Guidelines: Button', exact: true }).click()
  const block = main.getByRole('group', { name: 'AI Guidelines: Button', exact: true })
  await expect(block.getByRole('listitem').filter({ hasText: 'Switch' })).toBeVisible()
  await expect(block.getByRole('link')).toHaveText(['FieldGroup', 'Link'])

  await block.getByRole('link', { name: 'FieldGroup', exact: true }).click()
  await expect(page).toHaveURL('/components/buttons-and-links#FieldGroup')
  const part = main.getByRole('heading', { level: 2, name: 'FieldGroup', exact: true })
  await expect(part).toBeInViewport()
  await expect(part).toBeFocused()
})

test('a move to a part of the page is not announced as a change of page, whatever the address ends in', async ({
  page,
}) => {
  await page.goto('/components/buttons-and-links/')
  const main = page.getByRole('main')
  await main.getByRole('button', { name: 'AI Guidelines: Button', exact: true }).click()
  await main.getByRole('link', { name: 'FieldGroup', exact: true }).click()
  await expect(main.getByRole('heading', { level: 2, name: 'FieldGroup' })).toBeFocused()
  // The line is filled a moment after a change of page.
  await page.waitForTimeout(250)
  await expect(page.getByRole('status')).toBeEmpty()
})
