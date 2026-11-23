<script setup lang="ts">
import { nikTheme } from '@nichtimkopf/ui/theme'
import theme from '@nichtimkopf/ui/theme.css?raw'

import { hexOf } from './colors.ts'
import TokenGroup from './TokenGroup.vue'
import TokenTile from './TokenTile.vue'

// The steps of a palette in Tailwind and Nuxt UI.
const SCALE = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']

// Read from the stylesheet: the page cannot tell the steps the theme defines from steps of
// Tailwind's that something else names, as Nuxt UI's chart colors name blue 400.
const defined = (palette: string) =>
  [...theme.matchAll(new RegExp(`--color-${palette}-(\\d+):`, 'g'))].map(([, step]) => step!)

const root = getComputedStyle(document.documentElement)
const { neutral, ...colors } = nikTheme.ui.colors
const PALETTES = Object.entries({ neutral, ...colors }).map(([color, palette]) => {
  const steps = defined(palette)
  return {
    color,
    palette,
    // A palette the theme defines no step of is Tailwind's as it is.
    steps: (steps.length ? steps : SCALE).map((step) => ({
      step,
      value: hexOf(root.getPropertyValue(`--ui-color-${color}-${step}`)),
    })),
  }
})

// As many columns as the page's column has room for, and no more than the palette has steps.
const columns = (steps: number) => ({
  '--few': Math.min(steps, 4),
  '--some': Math.min(steps, 6),
  '--all': Math.min(steps, SCALE.length),
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <TokenGroup
      v-for="{ color, palette, steps } in PALETTES"
      :key="color"
      :title="palette"
      :hint="`The ${color} color.`"
    >
      <!-- A palette's steps share the row's width: eleven fill it, and so do four. Without the
           role a screen reader does not call a list without markers a list. -->
      <ul
        role="list"
        class="grid grid-cols-[repeat(var(--few),minmax(0,1fr))] gap-x-3 gap-y-6 @lg:grid-cols-[repeat(var(--some),minmax(0,1fr))] @3xl:grid-cols-[repeat(var(--all),minmax(0,1fr))]"
        :style="columns(steps.length)"
      >
        <li v-for="{ step, value } in steps" :key="step">
          <TokenTile :name="step" :value="value" :copy="`${color}-${step}`">
            <span
              class="h-15 rounded-lg ring ring-default ring-inset"
              :style="{ background: `var(--ui-color-${color}-${step})` }"
            />
          </TokenTile>
        </li>
      </ul>
    </TokenGroup>
  </div>
</template>
