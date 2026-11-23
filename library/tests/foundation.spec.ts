import { LIBRARY } from '../src/areas.ts'
import { expect, test } from './library.ts'

test('the Foundation page lists its pages as cards, each group under its heading', async ({
  page,
}) => {
  await page.goto('/foundation')
  const headings = await page
    .getByRole('heading')
    .evaluateAll((all) => all.map((heading) => `${heading.tagName} ${heading.textContent?.trim()}`))
  expect(headings).toEqual(['H1 Foundation', 'H2 Colors', 'H3 Palettes', 'H3 Roles'])
})

test('a card leads to its page, whose title is announced', async ({ page }) => {
  await page.goto('/foundation')
  await page.getByRole('main').getByRole('link', { name: 'Palettes' }).click()
  await expect(page).toHaveURL('/foundation/palettes')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Palettes')
  await expect(page.getByRole('status')).toHaveText(`Palettes · Foundation · ${LIBRARY}`)
})

test('a page the Foundation does not have leads back to the Foundation', async ({ page }) => {
  await page.goto('/foundation/nothing')
  await expect(page).toHaveURL('/foundation')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Foundation')
})

// A route's own guard would not run here: only the parameter changes.
test('so does a change to such a page from one the Foundation has', async ({ page }) => {
  await page.goto('/foundation/palettes')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Palettes')
  await page.evaluate(() => {
    history.pushState(history.state, '', '/foundation/nothing')
    dispatchEvent(new PopStateEvent('popstate'))
  })
  await expect(page).toHaveURL('/foundation')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Foundation')
})

test('a path the library does not have leads to the start page', async ({ page }) => {
  await page.goto('/nothing/at/all')
  await expect(page).toHaveURL('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(LIBRARY)
})

// At 1024 px the navigation stands beside the page and takes a part of its width.
test('beside the navigation a card keeps its art whole and its row full', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.goto('/foundation')
  const main = page.getByRole('main')
  await expect(main.getByRole('listitem').first()).toBeVisible()
  const cut = await main
    .getByRole('listitem')
    .evaluateAll(
      (cards) =>
        cards.filter((card) =>
          [...card.querySelectorAll('*')].some(
            (box) =>
              getComputedStyle(box).overflowY === 'hidden' && box.scrollHeight > box.clientHeight,
          ),
        ).length,
    )
  expect(cut).toBe(0)

  // The cards of a group share their row to its end.
  for (const row of await main.getByRole('list').all()) {
    const { x, width } = (await row.boundingBox())!
    const last = (await row.getByRole('listitem').last().boundingBox())!
    expect(last.x + last.width).toBeCloseTo(x + width, 0)
  }
})
