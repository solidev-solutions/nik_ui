import type { Page } from '@playwright/test'

import { color, expect, test } from './library.ts'

// Both are neutral ghost buttons by Nuxt UI's own defaults, so their color tells nothing: the look
// shows in the radius, where Nuxt UI rounds a button of this size by 8 px, in the fills, where it
// takes the elevated surface for both, and in the press, which it does not move.
const buttons = [
  {
    name: 'the color mode button',
    width: 1280,
    find: (page: Page) => page.getByRole('button', { name: 'Switch to dark mode' }),
  },
  {
    name: 'the sidebar toggle',
    width: 1023,
    find: (page: Page) => page.getByRole('button', { name: 'Open sidebar' }),
  },
]

for (const { name, width, find } of buttons) {
  test(`${name} has the theme's look at rest, under the pointer and pressed`, async ({ page }) => {
    await page.setViewportSize({ width, height: 768 })
    await page.goto('/')
    const button = find(page)
    await expect(button).toHaveCSS('border-radius', '10px')

    await button.hover()
    await expect(button).toHaveCSS('background-color', await color(page, '--ui-bg-hover'))

    await page.mouse.down()
    await expect(button).toHaveCSS('background-color', await color(page, '--ui-bg-selected'))
    await expect(button).toHaveCSS('translate', '0px 1px')
    // Released beside the button, which makes no click of it.
    await page.mouse.move(0, 0)
    await page.mouse.up()
  })
}
