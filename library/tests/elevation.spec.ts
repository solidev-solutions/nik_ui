import type { Page } from '@playwright/test'

import { content, expect, test } from './library.ts'

/** A theme's drawing, by the theme's name above it. */
const drawing = (page: Page, theme: string) => page.getByRole('figure', { name: theme })

/**
 * The levels as the page shows them in each drawing: a level's name, and the surface its line of
 * value begins with.
 */
async function shown(page: Page) {
  const levels = (theme: string) =>
    drawing(page, theme)
      .getByRole('button')
      .evaluateAll((all: HTMLButtonElement[]) =>
        all.map((level) => {
          // A level shows its name and, under it, its line of value.
          const [name, value] = level.innerText.split('\n')
          return [name, value!.split(' · ')[0]]
        }),
      )
  await drawing(page, 'Light').waitFor()
  return { Light: await levels('Light'), Dark: await levels('Dark') }
}

test('the page shows the levels in the light theme and in the dark, each with its surface, the same on the dark page', async ({
  page,
}) => {
  await page.goto('/foundation/elevation')
  const light = await shown(page)
  // From the top layer down to the page. The light theme's surfaces are white; in the dark one the
  // page is Tailwind's stone 900 and the raised surface a mix of its stone 800 and 700.
  const names = [
    'bg-raised ring ring-default shadow-sm',
    'bg-raised ring ring-default shadow-lg',
    'bg-raised ring ring-default',
    'bg-default',
  ]
  expect(light).toEqual({
    Light: names.map((name) => [name, '#FFFFFF']),
    Dark: names.map((name) => [name, name === 'bg-default' ? '#1C1917' : '#383330']),
  })

  await page.emulateMedia({ colorScheme: 'dark' })
  await page.reload()
  await expect(page.locator('html')).toContainClass('dark')
  expect(await shown(page)).toEqual(light)
})

// The test reads a level's look by another way than the drawing: from an element that wears only
// the classes the level's name gives, in the drawing's theme.
test('a drawn level wears the surface, ring and shadow of its classes in its theme, and in the dark the levels share one surface that is not the page’s', async ({
  page,
}) => {
  await page.goto('/foundation/elevation')
  await content(page, '/foundation/elevation')
  for (const theme of ['Light', 'Dark']) {
    const looks = await drawing(page, theme)
      .getByRole('button')
      .evaluateAll(
        (all: HTMLButtonElement[], theme) =>
          all.map((level) => {
            const name = level.innerText.split('\n')[0]!
            const scope = document.body.appendChild(document.createElement('div'))
            scope.className = theme
            const probe = scope.appendChild(document.createElement('span'))
            probe.className = name
            // Tailwind draws a ring as a shadow: the box shadow holds both.
            const look = (each: Element) => {
              const { backgroundColor, boxShadow } = getComputedStyle(each)
              return { surface: backgroundColor, boxShadow }
            }
            const drawn = look(level)
            const worn = look(probe)
            scope.remove()
            return { name, drawn, worn }
          }),
        // The page's class for a theme.
        theme.toLowerCase(),
      )
    for (const { name, drawn, worn } of looks) expect(drawn, `${name}, ${theme}`).toEqual(worn)

    if (theme === 'Dark') {
      const ground = looks.find(({ name }) => name === 'bg-default')!.drawn.surface
      const surfaces = new Set(
        looks.filter(({ name }) => name !== 'bg-default').map(({ drawn }) => drawn.surface),
      )
      expect(surfaces.size).toBe(1)
      expect(surfaces).not.toContain(ground)
    }
  }
})

test.describe('with the clipboard allowed', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] })

  test('a press on a level copies its classes and says so', async ({ page }) => {
    await page.goto('/foundation/elevation')
    await drawing(page, 'Dark')
      .getByTitle('Copy bg-raised ring ring-default shadow-lg', { exact: true })
      .click()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      'bg-raised ring ring-default shadow-lg',
    )
    await expect(page.getByRole('status')).toHaveText(
      'Copied: bg-raised ring ring-default shadow-lg',
    )
  })
})
