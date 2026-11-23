<script setup lang="ts">
import AppFrame from '@nichtimkopf/ui/kit/AppFrame.vue'
import UNavigationMenu from '@nuxt/ui/components/NavigationMenu.vue'
import { ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import { LIBRARY } from '../areas.ts'
import AreaRail from './AreaRail.vue'

const route = useRoute()
const collapsed = ref(false)
</script>

<template>
  <AppFrame
    v-model:collapsed="collapsed"
    :label="LIBRARY"
    :line-label="collapsed ? 'Click to expand.' : 'Drag to resize. Click to collapse.'"
    storage-key="library"
  >
    <template #rail>
      <AreaRail />
    </template>

    <template v-if="route.meta.area?.navigation" #navigation>
      <UNavigationMenu
        :items="route.meta.area.navigation"
        orientation="vertical"
        :aria-label="route.meta.area.label"
      />
    </template>

    <!-- With an area's navigation, the rail's icons stand beside it, on the rail's ground. -->
    <template #menu>
      <template v-if="route.meta.area?.navigation">
        <AreaRail class="border-e border-default bg-muted" />
        <UNavigationMenu
          :items="route.meta.area.navigation"
          orientation="vertical"
          :aria-label="route.meta.area.label"
          class="min-w-0 flex-1 overflow-y-auto p-2"
        />
      </template>
      <AreaRail v-else expanded />
    </template>

    <RouterView />
  </AppFrame>
</template>
