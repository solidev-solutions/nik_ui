import { fileURLToPath } from 'node:url'

import ui from '@nuxt/ui/vite'
import vue from '@vitejs/plugin-vue'
import { build } from 'vite'
import { expect, test } from 'vitest'

import { icon, nikTheme } from '../src/theme/index.ts'

const root = fileURLToPath(new URL('./fixtures/app', import.meta.url))
const output = (built: Awaited<ReturnType<typeof build>>) => ('output' in built ? built.output : [])
const text = (files: ReturnType<typeof output>, extension: string) =>
  files
    .filter((file) => file.fileName.endsWith(extension))
    .map((file) => (file.type === 'chunk' ? file.code : file.source))
    .join('')
const selector = (name: string) => `.${name.replace(/[^\w-]/g, '\\$&')}`

// The fixture as an app that has Nuxt UI keep the looks only of the components it finds in use.
const detecting = await build({
  root,
  configFile: false,
  logLevel: 'error',
  build: { write: false },
  plugins: [
    vue(),
    ui({
      ...nikTheme,
      components: false,
      autoImport: false,
      router: false,
      experimental: { componentDetection: true },
    }),
  ],
})
const detectingCss = text(output(detecting), '.css')

const files = output(
  await build({
    root,
    logLevel: 'error',
    build: { write: false },
  }),
)
const css = text(files, '.css')
const script = text(files, '.js')

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

// A role the theme does not name keeps Nuxt UI's Lucide icon, which no build of an app with this
// theme holds: it would be fetched from a server at the first sight.
test('the script holds no icon role that Nuxt UI still names', () => {
  expect(script).not.toMatch(/i-lucide-/)
})

test('the stylesheet carries the classes of a kit look and of a theme override', () => {
  // A class that nothing else names, of each: the frame's look and the dashboard sidebar's override.
  for (const name of ['data-[collapsed=true]:border-e-0', 'sm:max-w-72']) {
    expect(css).toContain(selector(name))
  }
})

test('Nuxt UI’s configuration in the script carries a theme override', () => {
  expect(script).toContain('sm:max-w-72')
})

test('the stylesheet and the script carry the navigation menu’s override', () => {
  // A class that nothing else names.
  expect(css).toContain(selector('hover:before:bg-hover'))
  expect(script).toContain('hover:before:bg-hover')
})

test('the stylesheet and the script carry the overrides of button, link and kbd', () => {
  // Of each a class that nothing else names.
  for (const name of [
    'active:not-disabled:not-aria-disabled:not-aria-[haspopup]:[transform:translateY(1px)]',
    'decoration-dimmed',
    'normal-case',
  ]) {
    expect(css).toContain(selector(name))
  }
  expect(script).toContain('[transform:translateY(1px)]')
  expect(script).toContain('decoration-dimmed')
  // The script holds the kbd's class a second time, in the list that tells conflicting classes
  // apart: the pattern is that of the configuration.
  expect(script).toMatch(/\bkbd:\s*\{\s*base:\s*["'`]normal-case["'`]/)
})

test('the stylesheet and the script carry the dashboard panel’s override', () => {
  // A class that nothing else names.
  expect(css).toContain(selector('scrollbar-gutter-both'))
  expect(script).toContain('scrollbar-gutter-both')
})

// The library's Elevation page names these parts for its levels.
test('every part that lies above the page stands on the raised surface', () => {
  const { tooltip, dropdownMenu, contextMenu, popover, modal, slideover, drawer, card } =
    nikTheme.ui
  for (const part of [tooltip, dropdownMenu, contextMenu, popover, modal, slideover, drawer]) {
    expect(part.slots.content).toContain('bg-raised')
  }
  expect(card.variants.variant.outline.root).toBe('bg-raised')
})

test('the script carries the prop defaults the app hands to UTheme', () => {
  expect(script).toMatch(/slideover:\s*\{\s*inset:\s*(!0|true)\s*\}/)
  expect(script).toMatch(/tooltip:\s*\{\s*delayDuration:\s*300\b/)
})

test('with component detection Nuxt UI keeps the looks of the components the kit renders', () => {
  // Detection is at work: the looks of the components nothing renders are left out.
  expect(detectingCss.length).toBeLessThan(css.length)
  // The dashboard sidebar's width, a class of its own look.
  expect(detectingCss).toContain(selector('w-(--width)'))
})

test('a tooltip and its arrow are of the raised surface', () => {
  expect(nikTheme.ui.tooltip.slots).toEqual({
    content: 'bg-raised',
    arrow: 'fill-(--ui-bg-raised)',
  })
})

// What no page of the library shows yet: the looks as the theme hands them to Nuxt UI.
test('the theme narrows a square button’s padding to icons, darkens a status’s soft label and frees a header’s title of the underline', () => {
  const { button, header, slideover } = nikTheme.ui
  const square = button.compoundVariants.filter((entry) => 'square' in entry)
  expect(square.every((entry) => 'leading' in entry || 'trailing' in entry)).toBe(true)
  for (const [color, text] of [
    ['error', 'text-error-text'],
    ['success', 'text-success-dark'],
    ['warning', 'text-warning-dark'],
    ['info', 'text-info-dark'],
  ]) {
    expect(button.compoundVariants).toContainEqual({
      color,
      variant: ['soft', 'subtle'],
      class: text,
    })
  }
  expect(header.slots.title).toBe('no-underline')
  expect(slideover.compoundVariants.map((entry) => entry.side)).toEqual(
    expect.arrayContaining(['bottom', 'top']),
  )
})
