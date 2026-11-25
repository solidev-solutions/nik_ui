<script setup lang="ts">
import { hexOf } from './colors.ts'
import TokenGroup from './TokenGroup.vue'
import TokenTile from './TokenTile.vue'

// A role by the class one types for it, a row of them in a string. Written out: Tailwind makes a
// class only of a name it finds whole, and the page takes a role's values from its class.
const GROUPS = [
  {
    title: 'Background',
    hint: 'Default is the page, muted the ground around it, raised a card, a menu or a dialog. Elevated, accented, hover, selected and overlay are see-through and shown as they fall on the default background.',
    rows: [
      'bg-default bg-muted bg-raised bg-elevated bg-accented bg-hover bg-selected bg-overlay bg-inverted',
    ],
  },
  {
    title: 'Text',
    hint: 'Highlighted and default are the same ink. Muted is the lightest gray that words take; dimmed is for icons.',
    rows: ['text-highlighted text-default text-toned text-muted text-dimmed text-inverted'],
  },
  {
    title: 'Border',
    hint: 'Default draws every edge and divider, field the edge of a control; the border roles also go with ring- and divide-. In the dark theme default and muted are see-through and shown as they fall on the default background.',
    rows: ['border-default border-muted border-accented ring-field border-inverted'],
  },
  {
    title: 'Primary',
    hint: 'The tints are see-through shares of primary, shown as they fall on the default background: soft fill 10%, its hover 15%, selection 20%, focus 25%, an outline’s edge 50%, a solid’s hover 90%.',
    rows: [
      'bg-primary bg-primary/10 bg-primary/15 bg-primary/20 outline-primary/25 ring-primary/50 bg-primary/90',
    ],
  },
  {
    title: 'Status',
    hint: 'On an alert, dark is the text, base the icon, light the edge and lighter the surface; error adds the text under a field. In the dark theme light and lighter are see-through tints of base, shown as they fall on the default background.',
    rows: [
      'text-success-dark text-success ring-success-light bg-success-lighter',
      'text-info-dark text-info ring-info-light bg-info-lighter',
      'text-warning-dark text-warning ring-warning-light bg-warning-lighter',
      'text-error-dark text-error ring-error-light bg-error-lighter text-error-text',
    ],
  },
  {
    title: 'Category',
    hint: 'The name alone is a category’s text, surface what the text stands on, hover that surface under the pointer and mark the dot beside a word; neutral is the surface of an entry without a category.',
    wide: true,
    rows: [
      'bg-category-neutral-surface bg-category-neutral-hover',
      'text-category-rose bg-category-rose-surface bg-category-rose-hover text-category-rose-mark',
      'text-category-red bg-category-red-surface bg-category-red-hover text-category-red-mark',
      'text-category-orange bg-category-orange-surface bg-category-orange-hover text-category-orange-mark',
      'text-category-amber bg-category-amber-surface bg-category-amber-hover text-category-amber-mark',
      'text-category-lime bg-category-lime-surface bg-category-lime-hover text-category-lime-mark',
      'text-category-green bg-category-green-surface bg-category-green-hover text-category-green-mark',
      'text-category-teal bg-category-teal-surface bg-category-teal-hover text-category-teal-mark',
      'text-category-cyan bg-category-cyan-surface bg-category-cyan-hover text-category-cyan-mark',
      'text-category-blue bg-category-blue-surface bg-category-blue-hover text-category-blue-mark',
      'text-category-indigo bg-category-indigo-surface bg-category-indigo-hover text-category-indigo-mark',
      'text-category-violet bg-category-violet-surface bg-category-violet-hover text-category-violet-mark',
      'text-category-pink bg-category-pink-surface bg-category-pink-hover text-category-pink-mark',
    ],
  },
]

// What a class colors, by its utility.
const COLORED = {
  bg: 'background-color',
  text: 'color',
  border: 'border-top-color',
  ring: '--tw-ring-color',
  outline: 'outline-color',
}

/**
 * The color a class gives in a theme. An element with a theme's class has that theme's roles,
 * whatever the theme of the page is.
 */
function colorOf(name: string, theme: 'light' | 'dark') {
  const scope = document.body.appendChild(document.createElement('div'))
  scope.className = theme
  const probe = scope.appendChild(document.createElement('span'))
  probe.className = name
  const utility = name.slice(0, name.indexOf('-')) as keyof typeof COLORED
  const color = getComputedStyle(probe).getPropertyValue(COLORED[utility])
  scope.remove()
  return color
}

// A see-through role is shown as it falls on the default background of its theme.
const GROUND = { light: colorOf('bg-default', 'light'), dark: colorOf('bg-default', 'dark') }

const TILES = GROUPS.map((group) => ({
  ...group,
  rows: group.rows.map((row) =>
    row.split(' ').map((name) => {
      const light = colorOf(name, 'light')
      const dark = colorOf(name, 'dark')
      return {
        name,
        // The light theme's color at the left, the dark theme's at the right, each on its ground.
        // The colors themselves, not their hex values: a screen with a wider gamut shows a color
        // outside sRGB as it is.
        swatch: `linear-gradient(to right, ${light} 50%, ${dark} 50%), linear-gradient(to right, ${GROUND.light} 50%, ${GROUND.dark} 50%)`,
        value: { Light: hexOf(light, GROUND.light), Dark: hexOf(dark, GROUND.dark) },
      }
    }),
  ),
}))

// The most tiles a row holds from each width of the page's column on: below 38rem, from 38rem,
// from 51rem and from 56rem. A role's name takes up to 129 px and a category's up to 190 px; on a
// screen below 640 px, whose column stays below 38rem, a name is larger.
const MOST = { role: [2, 4, 5, 6], category: [1, 2, 4, 4] }

// A row's tiles share the width of the page's column, and spread evenly over the lines they need:
// with the row lengths this page has, no line is left with one tile where two can share them.
function columns(tiles: number, wide?: boolean) {
  const [few, some, many, all] = MOST[wide ? 'category' : 'role'].map((most) =>
    Math.ceil(tiles / Math.ceil(tiles / most)),
  )
  return { '--few': few, '--some': some, '--many': many, '--all': all }
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <TokenGroup
      v-for="{ title, hint, wide, rows } in TILES"
      :key="title"
      :title="title"
      :hint="hint"
    >
      <div class="flex flex-col gap-6">
        <!-- Without the role VoiceOver does not call a list without markers a list. -->
        <ul
          v-for="(row, at) in rows"
          :key="at"
          role="list"
          class="grid grid-cols-[repeat(var(--few),minmax(0,1fr))] gap-x-3 gap-y-6 @min-[38rem]:grid-cols-[repeat(var(--some),minmax(0,1fr))] @min-[51rem]:grid-cols-[repeat(var(--many),minmax(0,1fr))] @4xl:grid-cols-[repeat(var(--all),minmax(0,1fr))]"
          :style="columns(row.length, wide)"
        >
          <li v-for="{ name, swatch, value } in row" :key="name">
            <TokenTile :name="name" :value="value" :copy="name">
              <span
                class="h-15 rounded-lg ring ring-default ring-inset"
                :style="{ background: swatch }"
              />
            </TokenTile>
          </li>
        </ul>
      </div>
    </TokenGroup>
  </div>
</template>
