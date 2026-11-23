<script setup lang="ts">
import { icon } from '@nichtimkopf/ui/theme'
import UButton from '@nuxt/ui/components/Button.vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useControlSize } from './phone.ts'

const route = useRoute()
const router = useRouter()
const size = useControlSize()

// The pages before and after this one in its area's navigation; none for a page that is not in
// it. A page is known by its route, not by its address, which may end in a slash.
const neighbors = computed(() => {
  const pages = (route.meta.area?.navigation ?? []).flat().filter((page) => page.to)
  const here = pages.findIndex((page) => {
    const { name, params } = router.resolve(page.to!)
    return name === route.name && JSON.stringify(params) === JSON.stringify(route.params)
  })
  return here < 0 ? {} : { previous: pages[here - 1], next: pages[here + 1] }
})
</script>

<template>
  <nav
    v-if="neighbors.previous || neighbors.next"
    class="flex flex-wrap gap-4 border-t border-default pt-6"
    aria-label="Previous and next page"
  >
    <!-- Each stands out by its own padding, so that what it shows ends at the edge of the page's
         column. The arrow tells a reader who sees it which way a page lies; the name says it. -->
    <UButton
      v-if="neighbors.previous"
      :to="neighbors.previous.to"
      :label="neighbors.previous.label"
      :aria-label="`Previous: ${neighbors.previous.label}`"
      :leading-icon="icon.arrowLeft"
      :size="size"
      variant="ghost"
      class="-ms-3 min-w-0 sm:-ms-2.5"
    />
    <UButton
      v-if="neighbors.next"
      :to="neighbors.next.to"
      :label="neighbors.next.label"
      :aria-label="`Next: ${neighbors.next.label}`"
      :trailing-icon="icon.arrowRight"
      :size="size"
      variant="ghost"
      class="ms-auto -me-3 min-w-0 sm:-me-2.5"
    />
  </nav>
</template>
