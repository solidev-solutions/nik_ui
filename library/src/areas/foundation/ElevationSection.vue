<script setup lang="ts">
import UBadge from '@nuxt/ui/components/Badge.vue'

import { hexOf } from './colors.ts'
import TokenGroup from './TokenGroup.vue'
import TokenTile from './TokenTile.vue'

// A level by the classes one types for it, from the top layer down, and the parts that wear it.
// Written out: Tailwind makes a class only of a name it finds whole, and the page takes a level's
// surface from its classes.
const LEVELS = [
  { classes: 'bg-raised ring ring-default shadow-sm', use: 'Tooltip' },
  { classes: 'bg-raised ring ring-default shadow-lg', use: 'Menu, popover, dialog, slideover' },
  { classes: 'bg-raised ring ring-default', use: 'Card, drawer' },
]
const PAGE = 'bg-default'

// Where a layer lies: over the top 48 px of the one after it, a step further to the end. The one
// under it keeps its text 12 px below that. The list keeps the layers' places in the stack to
// itself.
const PLACES = ['z-3 self-end', 'z-2 self-center -mt-12', 'z-1 self-start -mt-12']

/**
 * The surface classes give in a theme, as it shows on that theme's page. An element with a
 * theme's class has that theme's roles, whatever the theme of the page is.
 */
function surfaceOf(classes: string, theme: string) {
  const scope = document.body.appendChild(document.createElement('div'))
  scope.className = `${theme} ${PAGE}`
  const probe = scope.appendChild(document.createElement('span'))
  probe.className = classes
  const surface = hexOf(
    getComputedStyle(probe).backgroundColor,
    getComputedStyle(scope).backgroundColor,
  )
  scope.remove()
  return surface
}

const DRAWINGS = [
  { theme: 'light', label: 'Light' },
  { theme: 'dark', label: 'Dark' },
].map(({ theme, label }) => ({
  theme,
  label,
  levels: LEVELS.map(({ classes, use }) => ({
    classes,
    value: `${surfaceOf(classes, theme)} · ${use}`,
  })),
  page: surfaceOf(PAGE, theme),
}))
</script>

<template>
  <TokenGroup
    title="Levels"
    hint="A level is a bundle of surface, ring and shadow: take its classes together. In the light the shadow tells the levels apart; in the dark they share one surface, lighter than the page."
  >
    <!-- Side by side from a column of 50rem: below it the longest name would wrap. -->
    <div class="grid gap-3 @min-[50rem]:grid-cols-2">
      <!-- A drawing wears its theme's class, and the text color too: the page's own is worked out
           at the body, from the page's theme. -->
      <figure
        v-for="{ theme, label, levels, page } in DRAWINGS"
        :key="theme"
        class="flex flex-col gap-4 rounded-xl border border-default bg-default p-4 text-default"
        :class="theme"
      >
        <figcaption>
          <UBadge :label="label" color="neutral" variant="soft" />
        </figcaption>
        <!-- Without the role VoiceOver does not call a list without markers a list. -->
        <ul role="list" class="isolate flex flex-col">
          <li
            v-for="({ classes, value }, at) in levels"
            :key="classes"
            class="relative w-[calc(100%-2rem)] @md:w-[calc(100%-4rem)]"
            :class="PLACES[at]"
          >
            <TokenTile
              :name="classes"
              :value="value"
              :copy="classes"
              class="px-3.5 pb-3"
              :class="[classes, at ? 'pt-15' : 'pt-3']"
            />
          </li>
          <li>
            <TokenTile
              :name="PAGE"
              :value="page"
              :copy="PAGE"
              class="px-3.5 pt-3.5"
              :class="PAGE"
            />
          </li>
        </ul>
      </figure>
    </div>
  </TokenGroup>
</template>
