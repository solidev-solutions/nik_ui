import { readdirSync, readFileSync } from 'node:fs'

import { FAMILIES, GROUPS } from '../src/areas/components/families.ts'
import { expect, test } from './library.ts'

const folders = new URL('../src/areas/components/families/', import.meta.url)
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
        for (const port of example.ports ?? [])
          await expect(
            section.getByRole('link', { name: `ReUI: ${port}`, exact: true }),
          ).toHaveAttribute('href', new RegExp(`^https://reui\\.io/components/.+/${port}$`))
      }
    }
  })
}
