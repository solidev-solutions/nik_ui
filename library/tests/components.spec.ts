import { existsSync, readdirSync, readFileSync } from 'node:fs'

import { FAMILIES, GROUPS } from '../src/areas/components/families.ts'
import type { Guidelines } from '../src/areas/components/types.ts'
import { expect, test } from './library.ts'

const folders = new URL('../src/areas/components/families/', import.meta.url)
const guidelines: Record<string, Record<string, Guidelines>> = {}
for (const family of FAMILIES) {
  const file: { default: Record<string, Guidelines> } = await import(
    new URL(`${family.id}/guidelines.ts`, folders).href
  )
  guidelines[family.id] = file.default
}
const examples = FAMILIES.flatMap((family) =>
  family.members.flatMap((member) =>
    member.examples.map((example) => ({
      ...example,
      file: new URL(`${family.id}/${example.id}.vue`, folders),
    })),
  ),
)

// A family is found by its entry in the list, an example by its file's name: neither is checked
// when the library is built.
test('every folder is a family of the list, every example a family declares is a file in its folder, and every file there is declared', () => {
  const families = readdirSync(folders, { withFileTypes: true }).filter((entry) =>
    entry.isDirectory(),
  )
  expect(families.map((folder) => folder.name).sort()).toEqual(
    FAMILIES.map((family) => family.id).sort(),
  )
  const found = families.flatMap((folder) =>
    readdirSync(new URL(`${folder.name}/`, folders))
      .filter((file) => file.endsWith('.vue'))
      .map((file) => new URL(`${folder.name}/${file}`, folders).href),
  )
  expect(found.sort()).toEqual(examples.map((example) => example.file.href).sort())
})

// A member's guidelines are found by its name, and the part to take instead by a member's: neither
// is checked when the library is built.
test('every member has its guidelines, and every part to take instead is one that a family, Nuxt UI or the kit has', () => {
  const members = FAMILIES.flatMap((family) => family.members.map((member) => member.name))
  expect(new Set(members).size).toBe(members.length)
  const components = ['../../node_modules/@nuxt/ui/dist/runtime/components/', '../../src/kit/']
  for (const family of FAMILIES) {
    expect(Object.keys(guidelines[family.id]!).sort()).toEqual(
      family.members.map((member) => member.name).sort(),
    )
    for (const [member, { use, instead, rules }] of Object.entries(guidelines[family.id]!)) {
      for (const lines of [use, instead, rules]) expect(lines.length, member).toBeGreaterThan(0)
      // Code stands between two backticks.
      for (const { take } of rules) expect(take.split('`').length % 2, take).toBe(1)
      for (const { take } of instead) {
        const has = components.some((folder) =>
          existsSync(new URL(`${folder}${take}.vue`, import.meta.url)),
        )
        expect(members.includes(take) || has, take).toBe(true)
      }
    }
  }
})

// Of ReUI only its components and its `c-` examples are free to port.
test('an example that names ReUI originals carries their copyright line, and no other does', () => {
  for (const { id, ports = [], file } of examples) {
    for (const port of ports) expect(port, id).toMatch(/^c-[a-z-]+-\d+$/)
    const ported = readFileSync(file, 'utf8').startsWith(
      '<!-- SPDX-FileCopyrightText: 2025 Keenthemes Inc -->',
    )
    expect(ported, id).toBe(ports.length > 0)
  }
})

test('the Components page lists the families as cards, each group under its heading', async ({
  page,
}) => {
  await page.goto('/components')
  const headings = await page
    .getByRole('heading')
    .evaluateAll((all) => all.map((heading) => `${heading.tagName} ${heading.textContent?.trim()}`))
  expect(headings).toEqual([
    'H1 Components',
    ...GROUPS.flatMap((group) => [
      `H2 ${group.label}`,
      ...group.families.map((family) => `H3 ${family.label}`),
    ]),
  ])
})

test('a card leads to its family’s page, and the path in its head back', async ({ page }) => {
  const family = FAMILIES[0]!
  await page.goto('/components')
  await page.getByRole('main').getByRole('link', { name: family.label, exact: true }).click()
  await expect(page).toHaveURL(`/components/${family.id}`)

  await page.getByRole('banner').getByRole('link', { name: 'Components' }).click()
  await expect(page).toHaveURL('/components')
})

test('beside the Components the navigation lists the families under their groups, and an entry leads to its family’s page', async ({
  page,
}) => {
  const family = FAMILIES[0]!
  await page.goto('/components')
  const navigation = page.getByRole('navigation', { name: 'Components' })
  await expect(navigation.getByRole('listitem')).toHaveText(
    GROUPS.flatMap((group) => [group.label, ...group.families.map(({ label }) => label)]),
  )

  await navigation.getByRole('link', { name: family.label, exact: true }).click()
  await expect(page).toHaveURL(`/components/${family.id}`)
})

// ReUI keeps an example under its component, whose name may hold a hyphen.
test('an example’s links lead to its originals at ReUI', async ({ page }) => {
  await page.goto('/components/buttons-and-links')
  const originals = page.getByRole('main').getByRole('link', { name: /^ReUI: / })
  await expect(originals.first()).toHaveAttribute(
    'href',
    'https://reui.io/components/button/c-button-1',
  )
  await expect(originals.last()).toHaveAttribute(
    'href',
    'https://reui.io/components/button-group/c-button-group-6',
  )
})

test('an example’s button shows the example’s file under it, a second press hides it, and the focus stays on the button', async ({
  page,
}) => {
  const [example] = examples
  await page.goto(`/components/${FAMILIES[0]!.id}`)
  const main = page.getByRole('main')
  const button = (name: string, expanded: boolean) =>
    main.getByRole('button', { name: `${name}: ${example!.title}`, exact: true, expanded })

  await button('Code', false).click()
  await expect(button('Hide code', true)).toBeFocused()
  await expect(main.getByRole('code')).toBeVisible()
  expect(await main.getByRole('code').textContent()).toBe(readFileSync(example!.file, 'utf8'))

  await button('Hide code', true).click()
  await expect(button('Code', false)).toBeFocused()
  await expect(main.getByRole('code')).toHaveCount(0)
})

test.describe('with the clipboard allowed', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] })

  test('the copy button of an example’s code copies the whole file, and says so', async ({
    page,
  }) => {
    const [example] = examples
    await page.goto(`/components/${FAMILIES[0]!.id}`)
    const main = page.getByRole('main')
    await main.getByRole('button', { name: `Code: ${example!.title}`, exact: true }).click()
    await main.getByRole('button', { name: `Copy code: ${example!.title}`, exact: true }).click()
    await expect(page.getByRole('status')).toHaveText(`Copied: the code of ${example!.title}`)
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      readFileSync(example!.file, 'utf8'),
    )
  })
})

test.describe('with less motion asked for', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } })

  test('a member’s AI Guidelines open at once', async ({ page }) => {
    await page.goto(`/components/${FAMILIES[0]!.id}`)
    const main = page.getByRole('main')
    await main
      .getByRole('button', { name: /^AI Guidelines: / })
      .first()
      .click()
    await expect(main.getByRole('group', { name: /^AI Guidelines: / })).toBeVisible()
    // What moves on without an end is a loading button's icon.
    const moving = await main.evaluate((main) =>
      main
        .getAnimations({ subtree: true })
        .filter((animation) => animation.effect?.getComputedTiming().endTime !== Infinity),
    )
    expect(moving).toHaveLength(0)
  })
})

test('a family the Components do not have leads back to the Components', async ({ page }) => {
  await page.goto('/components/nothing')
  await expect(page).toHaveURL('/components')
})

for (const family of FAMILIES) {
  test(`/components/${family.id} shows its members, each with its examples drawn`, async ({
    page,
  }) => {
    await page.goto(`/components/${family.id}`)
    const main = page.getByRole('main')
    await expect(main.getByRole('heading', { level: 2 })).toHaveText(
      family.members.map((member) => member.name),
    )

    for (const member of family.members) {
      const section = main.locator('section').filter({
        has: page.getByRole('heading', { level: 2, name: member.name, exact: true }),
      })
      await expect(
        section.getByRole('link', { name: `Nuxt UI docs: ${member.name}`, exact: true }),
      ).toHaveAttribute('href', `https://ui.nuxt.com/docs/components/${member.docs}`)

      for (const example of member.examples) {
        const drawn = section.getByRole('group', { name: example.title, exact: true })
        await expect(drawn.locator('> *').first()).toBeVisible()
        await expect(
          section.getByRole('button', { name: `Code: ${example.title}`, exact: true }),
        ).toBeVisible()
        for (const port of example.ports ?? [])
          await expect(
            section.getByRole('link', { name: `ReUI: ${port}`, exact: true }),
          ).toHaveAttribute('href', new RegExp(`^https://reui\\.io/components/.+/${port}$`))
      }
    }
  })
}

for (const family of FAMILIES) {
  test(`/components/${family.id} keeps every member’s AI Guidelines closed at first, a press shows that member’s lines, and a second press hides them`, async ({
    page,
  }) => {
    await page.goto(`/components/${family.id}`)
    const main = page.getByRole('main')

    for (const member of family.members) {
      const name = `AI Guidelines: ${member.name}`
      const button = (expanded: boolean) =>
        main.getByRole('button', { name, exact: true, expanded })
      const block = main.getByRole('group', { name, exact: true })
      const { use, instead, rules } = guidelines[family.id]![member.name]!

      await expect(block).toHaveCount(0)
      await button(false).click()
      await expect(button(true)).toBeFocused()
      await expect(block.getByRole('term')).toHaveText(['Use for', 'Not for', 'Rules'])
      await expect(block.getByRole('listitem')).toHaveText([
        ...use,
        ...instead.map(({ when, take }) => `${when}: ${take}`),
        ...rules.map(({ when, take }) => `${when}: ${take.replaceAll('`', '')}`),
      ])

      await button(true).click()
      await expect(button(false)).toBeFocused()
      await expect(block).toHaveCount(0)
    }
  })
}
