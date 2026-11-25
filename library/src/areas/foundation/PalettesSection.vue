<script setup lang="ts">
import { nikTheme } from '@nichtimkopf/ui/theme'

import { hexOf } from './colors.ts'
import TokenGroup from './TokenGroup.vue'
import TokenTile from './TokenTile.vue'

// The steps of a palette in Tailwind and Nuxt UI. Every palette of the theme is a whole scale.
const SCALE = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']

const root = getComputedStyle(document.documentElement)
const { neutral, ...colors } = nikTheme.ui.colors
const PALETTES = Object.entries({ neutral, ...colors }).map(([color, palette]) => ({
  color,
  palette,
  steps: SCALE.map((step) => ({
    step,
    value: hexOf(root.getPropertyValue(`--ui-color-${color}-${step}`)),
  })),
}))
</script>

<template>
  <div class="flex flex-col gap-8">
    <TokenGroup
      v-for="{ color, palette, steps } in PALETTES"
      :key="color"
      :title="palette"
      :hint="`The ${color} color.`"
    >
      <!-- As many of the eleven steps in a row as the page's column has room for. Without the
           role VoiceOver does not call a list without markers a list. -->
      <ul role="list" class="grid grid-cols-4 gap-x-3 gap-y-6 @lg:grid-cols-6 @3xl:grid-cols-11">
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
