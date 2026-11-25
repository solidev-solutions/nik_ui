<script setup lang="ts">
import UColorModeButton from '@nuxt/ui/components/color-mode/ColorModeButton.vue'
import UNavigationMenu from '@nuxt/ui/components/NavigationMenu.vue'

import { AREAS } from '../areas.ts'
import HomeMark from './HomeMark.vue'

defineProps<{
  /** In the menu, where the areas show their names; the rail shows their icons. */
  expanded?: boolean
}>()

// The name once more as the link's own: the rail hides the label.
const items = AREAS.map((area) => ({
  label: area.label,
  'aria-label': area.label,
  icon: area.icon,
  to: { name: area.id },
}))
</script>

<template>
  <div class="flex flex-col gap-5" :class="expanded ? 'flex-1 p-2' : 'w-16 items-center py-5'">
    <HomeMark />
    <UNavigationMenu
      :items="items"
      orientation="vertical"
      :collapsed="!expanded"
      tooltip
      aria-label="Areas"
    />
    <div class="mt-auto">
      <UColorModeButton />
    </div>
  </div>
</template>
