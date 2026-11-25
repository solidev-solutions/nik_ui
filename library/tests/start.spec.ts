import type { Locator, Page } from '@playwright/test'

import { AREAS, LIBRARY } from '../src/areas.ts'
import { color, expect, test } from './library.ts'

const card = (page: Page, label: string) =>
  page
    .getByRole('main')
    .getByRole('listitem')
    .filter({ has: page.getByRole('link', { name: label }) })

test('the start page shows its sections by their headings under the one h1', async ({ page }) => {
  await page.goto('/')
  const headings = await page
    .getByRole('heading')
    .evaluateAll((all) => all.map((heading) => `${heading.tagName} ${heading.textContent?.trim()}`))
  expect(headings).toEqual([
    `H1 ${LIBRARY}`,
    `H2 What is ${LIBRARY}`,
    'H2 The references we build on',
    'H2 Quick access',
    ...AREAS.map((area) => `H3 ${area.label}`),
  ])
})

for (const area of AREAS) {
  test(`the card of ${area.label} leads to its area from anywhere on it`, async ({ page }) => {
    await page.goto('/')
    const link = page.getByRole('main').getByRole('link', { name: area.label })
    await expect(link).toHaveAccessibleName(area.label)
    await link.scrollIntoViewIfNeeded()

    // What lies under each point of the card, corners and line under the name included.
    const targets = await card(page, area.label).evaluate((item) => {
      const { x, y, width, height } = item.getBoundingClientRect()
      return [0.02, 0.5, 0.98].flatMap((across) =>
        [0.02, 0.5, 0.95].map(
          (down) =>
            document.elementFromPoint(x + width * across, y + height * down)?.closest('a')?.href,
        ),
      )
    })
    expect(new Set(targets)).toEqual(new Set([new URL(`/${area.id}`, page.url()).href]))

    await card(page, area.label).click({ position: { x: 24, y: 24 } })
    await expect(page).toHaveURL(`/${area.id}`)
  })
}

test('a card that has risen is the link down to the lower edge of its place', async ({ page }) => {
  await page.goto('/')
  const [area] = AREAS
  const item = card(page, area!.label)
  await item.scrollIntoViewIfNeeded()
  const place = (await item.boundingBox())!
  const foot = { x: place.x + place.width / 2, y: place.y + place.height - 1 }
  const link = item.getByRole('link')
  const { y } = (await link.boundingBox())!

  await page.mouse.move(foot.x, foot.y)
  await expect.poll(async () => (await link.boundingBox())!.y).toBeCloseTo(y - 4, 1)
  const under = await page.evaluate(
    ({ x, y }) => document.elementFromPoint(x, y)?.closest('a')?.getAttribute('href'),
    foot,
  )
  expect(under).toBe(`/${area!.id}`)
})

/** The color of a card's edge: of the box around its link that has one. */
const edge = (link: Locator) =>
  link.evaluate((inside) => {
    let box = inside.parentElement!
    while (parseFloat(getComputedStyle(box).borderTopWidth) === 0) box = box.parentElement!
    return getComputedStyle(box).borderTopColor
  })

test('a card rises under the pointer, and its edge darkens', async ({ page }) => {
  await page.goto('/')
  const link = page.getByRole('main').getByRole('link').first()
  await link.scrollIntoViewIfNeeded()
  const { y } = (await link.boundingBox())!
  expect(await edge(link)).toBe(await color(page, '--ui-border'))

  await link.hover()
  await expect.poll(async () => (await link.boundingBox())!.y).toBeCloseTo(y - 4, 1)
  await expect.poll(() => edge(link)).toBe(await color(page, '--ui-border-accented'))
})

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('a card stays where it is under the pointer, and its edge darkens', async ({ page }) => {
    await page.goto('/')
    const link = page.getByRole('main').getByRole('link').first()
    await link.scrollIntoViewIfNeeded()
    const { y } = (await link.boundingBox())!

    await link.hover()
    // The edge tells of the pointer there, at once.
    expect(await edge(link)).toBe(await color(page, '--ui-border-accented'))
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0)
    expect((await link.boundingBox())!.y).toBe(y)
  })
})

test('a card shows a focus ring around it while its link has the keyboard’s focus', async ({
  page,
}) => {
  await page.goto('/')
  const link = page.getByRole('main').getByRole('link').first()
  // A focus that a script sets counts as the kind of focus before it: here a key's.
  await page.keyboard.press('Tab')
  await link.focus()

  const ring = await link.evaluate((focused) => {
    const item = focused.closest('li')!
    const outlined = [...item.querySelectorAll('*')].filter(
      (element) => getComputedStyle(element).outlineStyle !== 'none',
    )
    const box = (element: Element) => JSON.stringify(element.getBoundingClientRect())
    return outlined.map((element) => ({
      width: getComputedStyle(element).outlineWidth,
      aroundCard: box(element) === box(item),
    }))
  })
  expect(ring).toEqual([{ width: '3px', aroundCard: true }])
})

for (const { width, side } of [
  { width: 1280, side: true },
  { width: 390, side: false },
]) {
  test(`at ${width} px the cards stand ${side ? 'side by side' : 'one under the other'}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/')
    const [first, second] = await Promise.all(
      AREAS.map(async (area) => (await card(page, area.label).boundingBox())!),
    )
    if (side) {
      expect(second!.y).toBe(first!.y)
      expect(second!.x).toBeGreaterThan(first!.x + first!.width)
    } else {
      expect(second!.x).toBe(first!.x)
      expect(second!.y).toBeGreaterThan(first!.y + first!.height)
    }
  })
}

// There the line under one card's name takes two lines and the cards are equally tall: the room
// that is left belongs to the foot of the shorter one, not to its art.
test('at 640 px the art of both cards keeps its shape', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 844 })
  await page.goto('/')
  for (const area of AREAS) {
    const art = (await card(page, area.label).locator('[class~="aspect-3/2"]').boundingBox())!
    expect(art.width / art.height).toBeCloseTo(1.5, 1)
  }
})

test('the text and the cards share one column in the middle of the page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const main = (await page.getByRole('main').boundingBox())!
  const boxes = await Promise.all(
    [
      page.getByRole('heading', { level: 2 }).first().locator('..'),
      page.getByRole('main').getByRole('list'),
    ].map(async (part) => (await part.boundingBox())!),
  )
  for (const box of boxes) {
    expect(box.width).toBe(640)
    expect(box.x - main.x).toBeCloseTo(main.x + main.width - (box.x + box.width), 0)
  }
})
