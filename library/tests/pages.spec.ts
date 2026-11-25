import AxeBuilder from '@axe-core/playwright'

import { AREAS, LIBRARY } from '../src/areas.ts'
import { FAMILIES } from '../src/areas/components/families.ts'
import { SECTIONS } from '../src/areas/foundation/sections.ts'
import { content, expect, openMenu, pages, showWhole, test } from './library.ts'

const heads = [
  { path: '/', title: LIBRARY, documentTitle: LIBRARY },
  ...AREAS.map((area) => ({
    path: `/${area.id}`,
    title: area.label,
    documentTitle: `${area.label} · ${LIBRARY}`,
  })),
  ...SECTIONS.map((section) => ({
    path: `/foundation/${section.id}`,
    title: section.label,
    documentTitle: `${section.label} · Foundation · ${LIBRARY}`,
  })),
  ...FAMILIES.map((family) => ({
    path: `/components/${family.id}`,
    title: family.label,
    documentTitle: `${family.label} · Components · ${LIBRARY}`,
  })),
]

for (const { path, title, documentTitle } of heads) {
  test(`${path} has a document title of its own and its title as the one heading, in its head`, async ({
    page,
  }) => {
    await page.goto(path)
    await expect(page).toHaveTitle(documentTitle)
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(page.getByRole('banner').getByRole('heading', { level: 1 })).toHaveText(title)
  })
}

test('the document title follows the way back to the start page', async ({ page }) => {
  await page.goto('/foundation')
  await page.getByRole('link', { name: 'home' }).click()
  await expect(page).toHaveTitle(LIBRARY)
})

// Both are the theme's: Nuxt UI's title is 14 px, and its head does not keep the room for a
// scrollbar that the body under it keeps.
test('the head shows its title at 16 px and begins where the page’s body begins', async ({
  page,
}) => {
  // Below 1024 px the library's content takes the body's whole width.
  for (const width of [600, 800]) {
    await page.setViewportSize({ width, height: 768 })
    await page.goto('/foundation')
    const head = page.getByRole('banner')
    await expect(head.getByRole('heading', { level: 1 })).toHaveCSS('font-size', '16px')
    const first = (await head.getByRole('button').first().boundingBox())!
    const body = (await page.getByRole('main').boundingBox())!
    expect(first.x).toBe(body.x)
  }
})

test('a region’s scrollbar shows while the keyboard’s focus is inside it, and not after a click', async ({
  page,
}) => {
  await page.goto('/foundation/roles')
  const main = page.getByRole('main')
  await main.getByRole('heading', { level: 2 }).first().waitFor()
  const region = main.locator('..')
  const bar = () => region.evaluate((box) => getComputedStyle(box).scrollbarColor)
  // Away from the region, over the rail.
  await page.mouse.move(8, 400)
  const hidden = await bar()

  await region.hover()
  const shown = await bar()
  expect(shown).not.toBe(hidden)

  await main.getByRole('button').first().click()
  await page.mouse.move(8, 400)
  await expect.poll(bar).toBe(hidden)

  await page.keyboard.press('Tab')
  await expect.poll(bar).toBe(shown)
})

// Nuxt UI makes a panel at least as tall as the screen, and the frame's card is shorter than that.
test('the page ends where the frame’s card ends', async ({ page }) => {
  await page.goto('/')
  const panel = page.locator('#library-panel-page')
  const card = panel.locator('..')
  const bottom = async (box: typeof panel) => {
    const { y, height } = (await box.boundingBox())!
    return y + height
  }
  expect(await bottom(panel)).toBeLessThanOrEqual(await bottom(card))
})

for (const path of pages) {
  test(`${path}: nothing scrolls sideways at 390 px`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(path)
    await content(page, path)
    const sideways = await page.evaluate(() =>
      [...document.querySelectorAll('*')]
        .filter((element) => {
          const { overflowX } = getComputedStyle(element)
          const scrolls = element === document.documentElement || /auto|scroll/.test(overflowX)
          return scrolls && element.scrollWidth > element.clientWidth
        })
        .map((element) => element.outerHTML.slice(0, 80)),
    )
    expect(sideways).toEqual([])
  })
}

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`in the ${colorScheme} theme`, () => {
    test.use({ colorScheme })

    for (const path of pages) {
      test(`${path}: no axe findings`, async ({ page }) => {
        await page.goto(path)
        const root = expect(page.locator('html'))
        await (colorScheme === 'dark' ? root : root.not).toContainClass('dark')
        await content(page, path)
        await showWhole(page)
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
