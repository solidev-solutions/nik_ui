import { fileURLToPath } from 'node:url'

import { build } from 'vite'
import { expect, test } from 'vitest'

import { nikTheme } from '../src/theme/index.ts'

const built = await build({
  root: fileURLToPath(new URL('./fixtures/app', import.meta.url)),
  logLevel: 'error',
  build: { write: false },
})
const files = 'output' in built ? built.output : []
const text = (extension: string) =>
  files
    .filter((file) => file.fileName.endsWith(extension))
    .map((file) => (file.type === 'chunk' ? file.code : file.source))
    .join('')
const css = text('.css')
const script = text('.js')

test('the stylesheet carries every step of the walnut palette', () => {
  for (const step of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]) {
    expect(css).toContain(`--color-walnut-${step}:`)
  }
})

// A step between two that the status roles take: Tailwind's own would break the scale there.
test('the palettes of the status colors are whole scales of their own', () => {
  for (const [step, value] of [
    ['green-100', '#d6f5e8'],
    ['blue-600', '#3559e9'],
    ['orange-700', '#ce5e12'],
    ['red-800', '#ad1f2b'],
  ]) {
    expect(css).toMatch(new RegExp(`--color-${step}:\\s*${value}`, 'i'))
  }
})

test('the stylesheet carries the roles for the light and the dark theme', () => {
  expect(css).toMatch(
    /:root,\s*:host,\s*\.light\s*\{[^}]*--ui-primary:\s*var\(--ui-color-primary-700\)/,
  )
  expect(css).toMatch(/\.dark\s*\{[^}]*--ui-primary:\s*var\(--ui-color-primary-400\)/)
})

test('Nuxt UI generates its classes for the theme’s aliases only', () => {
  for (const alias of nikTheme.theme.colors)
    expect(css).toMatch(new RegExp(`\\.text-${alias}(?![\\w-])`))
  expect(css).not.toContain('secondary')
})

test('Nuxt UI’s configuration in the script names the theme’s palettes', () => {
  for (const [alias, palette] of Object.entries(nikTheme.ui.colors)) {
    expect(script).toMatch(new RegExp(`\\b${alias}:\\s*["'\`]${palette}["'\`]`))
  }
})

test('the roles the stylesheet adds give classes', () => {
  for (const name of ['bg-raised', 'ring-field', 'text-success-dark']) {
    expect(css).toContain(`.${name}`)
  }
})
