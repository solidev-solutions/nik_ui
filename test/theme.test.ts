import { fileURLToPath } from 'node:url'

import { build } from 'vite'
import { expect, test } from 'vitest'

import { icon, nikTheme } from '../src/theme/index.ts'

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

test('the radius classes take the theme’s scale', () => {
  expect(css).toMatch(/\.rounded-lg\s*\{\s*border-radius:\s*var\(--radius-lg\)/)
  expect(css).toMatch(/--radius-lg:\s*0?\.625rem/)
})

// Nuxt UI derives the two largest from a knob of its own: there the scale would follow it only at
// its upper end.
test('the largest radii are the theme’s too, whatever Nuxt UI’s knob says', () => {
  expect(css).toMatch(/\.rounded-2xl\s*\{\s*border-radius:\s*var\(--radius-2xl\)/)
  expect(css).toMatch(/--radius-2xl:\s*1rem/)
})

test('a selection shows on a surface of the primary and of the inverted color', () => {
  for (const surface of ['bg-primary', 'bg-inverted']) {
    expect(css).toMatch(new RegExp(`\\.${surface} ::selection[^{]*\\{[^}]*color:`))
  }
})

test('a scrollbar also shows for the keyboard’s focus inside its region', () => {
  expect(css).toMatch(/:has\(:focus-visible\)[^{]*\{[^}]*scrollbar-color/)
})

test('Nuxt UI’s components come without the transitions the option turns off', () => {
  expect(css).not.toMatch(/\.transition-colors\b/)
})

test('the stylesheet carries the easing, the rule that delays a hover and the focus ring', () => {
  expect(css).toMatch(/--ease-reveal:\s*cubic-bezier\(/)
  expect(css).toMatch(/\.hover-intent[^{]*\{[^}]*transition/)
  // The theme's own ring, on whatever takes the focus: Nuxt UI's rule names the link alone.
  expect(css).toMatch(/[,{}]\s*:focus-visible\s*\{[^}]*outline:\s*3px/)
})

test('the stylesheet loads the fonts from files of the build', () => {
  for (const name of ['inter-latin', 'inter-latin-ext', 'jetbrains-mono-latin-wght-normal']) {
    const font = files.find((file) => file.type === 'asset' && file.names.includes(`${name}.woff2`))
    expect(css).toContain(`url(/${font?.fileName})`)
  }
})

test('the stylesheet carries the fonts and the slashed zero', () => {
  expect(css).toMatch(/--font-sans:\s*["']Inter Variable["']/)
  expect(css).toMatch(
    /@font-face\s*\{[^}]*font-family:\s*["']?Inter Variable["']?[;}][^}]*inter-latin/,
  )
  expect(css).toMatch(/--font-mono:\s*["']JetBrains Mono Variable["']/)
  expect(css).toMatch(/--font-sans--font-feature-settings:\s*["']zero["']/)
})

test('Nuxt UI’s configuration in the script names the theme’s icons', () => {
  for (const [role, name] of Object.entries(nikTheme.ui.icons)) {
    expect(script).toMatch(new RegExp(`\\b${role}:\\s*["'\`]${name}["'\`]`))
  }
})

test('the script carries every icon of the registry', () => {
  for (const name of Object.values(icon)) {
    expect(script).toContain(`"${name.replace('i-hugeicons-', '')}":{`)
  }
})
