<!-- SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska -->
<!-- SPDX-License-Identifier: MIT -->

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui/components/Breadcrumb.vue'
import UBreadcrumb from '@nuxt/ui/components/Breadcrumb.vue'
import type { DashboardNavbarProps } from '@nuxt/ui/components/DashboardNavbar.vue'
import UDashboardNavbar from '@nuxt/ui/components/DashboardNavbar.vue'
import { tv } from '@nuxt/ui/utils/tv'
import { computed } from 'vue'

import { pageHead } from '../theme/kit/page-head.js'

const props = withDefaults(
  defineProps<{
    title: string
    /** The pages above this one, from the top: each leads there. */
    parents?: BreadcrumbItem[]
    /** The head's element: a `header` stands for the page's banner. */
    as?: DashboardNavbarProps['as']
    class?: string
  }>(),
  { parents: () => [] },
)
defineSlots<{
  /** Before the path. */
  leading?: () => unknown
  right?: () => unknown
}>()

const styles = tv(pageHead)()
// Nuxt UI draws a separator only between two items: one more that never shows has it draw the
// last one, before the title. None of the pages above is the last item, nor the current page.
const path = computed(() => [...props.parents, { ui: { item: 'hidden' } }])
</script>

<template>
  <UDashboardNavbar :as="as" :title="title" :class="styles.root({ class: props.class })">
    <template #leading>
      <slot name="leading" />
      <UBreadcrumb
        v-if="parents.length"
        :items="path"
        :ui="{
          root: styles.path(),
          list: styles.list(),
          link: styles.link(),
          separatorIcon: styles.separator(),
        }"
      />
    </template>

    <template #right>
      <slot name="right" />
    </template>
  </UDashboardNavbar>
</template>
