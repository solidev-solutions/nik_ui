<script setup lang="ts">
import AppFrame from '@nichtimkopf/ui/kit/AppFrame.vue'
import { RouterView } from 'vue-router'

import { LIBRARY } from '../areas.ts'
import AreaRail from './AreaRail.vue'
</script>

<template>
  <AppFrame :label="LIBRARY" line-label="Drag to resize. Click to collapse." storage-key="library">
    <template #rail>
      <AreaRail />
    </template>

    <template #menu>
      <AreaRail expanded />
    </template>

    <RouterView />
  </AppFrame>
</template>
