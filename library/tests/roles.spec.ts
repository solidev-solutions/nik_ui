import { readFileSync } from 'node:fs'

import type { Page } from '@playwright/test'

import { nikTheme } from '../../src/theme/index.ts'
import { expect, test } from './library.ts'

/** The tiles as the page shows them: under a group's heading, each role with its two values. */
async function shown(page: Page) {
  const headings = page.getByRole('main').getByRole('heading', { level: 2 })
  await headings.first().waitFor()
  return headings.evaluateAll((all) =>
    Object.fromEntries(
      all.map((heading) => [
        heading.textContent,
        Object.fromEntries(
          [...heading.closest('section')!.querySelectorAll('button')].map((tile) => {
            const [name, ...values] = tile.innerText.split('\n')
            return [name, values.join(' ')]
          }),
        ),
      ]),
    ),
  )
}

// The test reads the roles by another way than the page: every color the theme's stylesheet gives
// a class, the roles Nuxt UI's stylesheet defines, and the theme's colors.
test('the page shows Nuxt UI’s and the theme’s roles in their groups, each once', async ({
  page,
}) => {
  const css = readFileSync(new URL('../../src/theme.css', import.meta.url), 'utf8')
  const start = css.indexOf('@theme inline')
  const classes = css.slice(start, css.indexOf('\n}', start))
  const roles = [...classes.matchAll(/--[a-z-]*color-([\w-]+):/g)].map(([, role]) => role!)
  const nuxtUi = readFileSync(
    new URL('../../node_modules/@nuxt/ui/dist/runtime/index.css', import.meta.url),
    'utf8',
  )
  const named = new Set([
    ...[...nuxtUi.matchAll(/--ui-(bg|text|border)(?:-(\w+))?:/g)].map(
      ([, utility, role]) => `${utility}-${role ?? 'default'}`,
    ),
    ...nikTheme.theme.colors.map((color) => (color === 'primary' ? 'bg-primary' : `text-${color}`)),
  ])

  await page.goto('/foundation/roles')
  const groups = await shown(page)
  expect(Object.keys(groups)).toEqual([
    'Background',
    'Text',
    'Border',
    'Primary',
    'Status',
    'Category',
  ])
  // A role stands under the utility that wears it: `field` as `ring-field`.
  const names = Object.values(groups).flatMap((tiles) => Object.keys(tiles))
  const shownRoles = names.map((name) => name.replace(/^[a-z]+-/, ''))
  expect(roles.filter((role) => !shownRoles.includes(role))).toEqual([])
  expect([...named].filter((name) => !names.includes(name))).toEqual([])
  await expect(page.getByRole('main').getByRole('button')).toHaveCount(names.length)
})

test('a role shows its value in the light theme and in the dark, the same on the dark page', async ({
  page,
}) => {
  await page.goto('/foundation/roles')
  const light = await shown(page)
  // Values the theme writes in hex. The tint is see-through: it falls on white in the light theme
  // and on the dark theme's background, Tailwind's stone 900, in the dark one.
  expect(light.Status['text-success-dark']).toBe('Light #0B4627 Dark #C2F5DA')
  expect(light.Primary['bg-primary/10']).toBe('Light #F1EDEB Dark #2C2622')
  // One of each other utility the page reads a color from.
  expect(light.Border['border-default']).toBe('Light #E7E5E4 Dark #393735')
  expect(light.Border['ring-field']).toBe('Light #8F8883 Dark #817A74')
  expect(light.Primary['outline-primary/25']).toBe('Light #DBD3CD Dark #433932')

  // The tile itself: the light theme's color at the left, the dark theme's at the right.
  const swatch = page
    .getByRole('button', { name: 'text-success-dark', exact: false })
    .locator('span')
    .first()
  await expect(swatch).toHaveCSS(
    'background-image',
    /^linear-gradient\(to right, rgb\(11, 70, 39\) 50%, rgb\(194, 245, 218\) 50%\)/,
  )

  await page.emulateMedia({ colorScheme: 'dark' })
  await page.reload()
  await expect(page.locator('html')).toContainClass('dark')
  expect(await shown(page)).toEqual(light)
})

test.describe('with the clipboard allowed', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] })

  test('a press on a tile copies the role’s name and says so', async ({ page }) => {
    await page.goto('/foundation/roles')
    // A tile's name for a screen reader is what stands under it: the role and its two values.
    const tile = page.getByRole('button', {
      name: 'text-error-text Light #D02533 Dark #FFC0C5',
      exact: true,
    })
    await expect(tile).toHaveAccessibleDescription('Copy text-error-text')
    await tile.click()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('text-error-text')
    await expect(page.getByRole('status')).toHaveText('Copied: text-error-text')
  })
})

// The page takes a role's values from the class it names.
test('a class the page names colors with its role', async ({ page }) => {
  await page.goto('/foundation/roles')
  const names = Object.values(await shown(page)).flatMap((tiles) => Object.keys(tiles))
  const unruled = await page.evaluate((names) => {
    const selectors = new Set<string>()
    const collect = (rules: CSSRuleList) => {
      for (const rule of rules) {
        if (rule instanceof CSSStyleRule)
          rule.selectorText.split(', ').forEach((selector) => selectors.add(selector))
        if ('cssRules' in rule) collect(rule.cssRules as CSSRuleList)
      }
    }
    for (const sheet of document.styleSheets) collect(sheet.cssRules)
    return names.filter((name) => !selectors.has(`.${CSS.escape(name)}`))
  }, names)
  expect(unruled).toEqual([])

  for (const [name, property, role] of [
    ['bg-raised', 'background-color', '--ui-bg-raised'],
    ['text-error-text', 'color', '--ui-error-text'],
    ['border-accented', 'border-top-color', '--ui-border-accented'],
    ['ring-field', '--tw-ring-color', '--ui-border-field'],
  ] as const) {
    for (const theme of ['light', 'dark']) {
      const [ofClass, ofRole] = await page.evaluate(
        ([name, property, role, theme]) => {
          const scope = document.body.appendChild(document.createElement('div'))
          scope.className = theme
          const worn = scope.appendChild(document.createElement('span'))
          worn.className = name
          const told = scope.appendChild(document.createElement('span'))
          told.style.setProperty(property, `var(${role})`)
          const colors = [worn, told].map((probe) =>
            getComputedStyle(probe).getPropertyValue(property),
          )
          scope.remove()
          return colors
        },
        [name, property, role, theme] as const,
      )
      expect(ofClass, `${name} in the ${theme} theme`).toBe(ofRole)
    }
  }
})

// Two of the widths at which a row of roles takes another number of tiles a line.
for (const width of [1440, 1024]) {
  test(`at ${width} px a row’s tiles fill their lines: each starts at the left edge of the page’s column, a full one reaches the right, and the last is at most one tile short`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/foundation/roles')
    const rows = page.getByRole('main').getByRole('list')
    await rows.first().waitFor()
    const main = (await page.getByRole('main').boundingBox())!
    const lines = await rows.evaluateAll((lists) =>
      lists.map((list) => {
        const byTop = new Map<number, DOMRect[]>()
        for (const tile of list.querySelectorAll('button')) {
          const box = tile.getBoundingClientRect()
          byTop.set(Math.round(box.top), [...(byTop.get(Math.round(box.top)) ?? []), box])
        }
        return [...byTop.values()].map((tiles) => ({
          tiles: tiles.length,
          left: Math.min(...tiles.map((tile) => tile.left)),
          right: Math.max(...tiles.map((tile) => tile.right)),
        }))
      }),
    )
    for (const row of lines) {
      for (const [at, line] of row.entries()) {
        // The 32 px that the page keeps free at each side of its column.
        expect(line.left - main.x).toBe(32)
        if (at < row.length - 1 || row.length === 1)
          expect(main.x + main.width - line.right).toBeCloseTo(32, 0)
        expect(row[0]!.tiles - line.tiles).toBeLessThanOrEqual(1)
        expect(line.tiles).toBeGreaterThan(1)
      }
    }
  })
}
