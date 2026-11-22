<script setup lang="ts">
import AppFrame from '@nichtimkopf/ui/kit/AppFrame.vue'
import UColorModeButton from '@nuxt/ui/components/color-mode/ColorModeButton.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <AppFrame
    label="NichtImKopf UI"
    line-label="Drag to resize. Click to collapse."
    storage-key="library"
  >
    <template #rail>
      <div class="flex w-16 flex-col items-center justify-end py-5">
        <UColorModeButton />
      </div>
    </template>

    <template #menu>
      <div class="p-2">
        <UColorModeButton />
      </div>
    </template>

    <RouterView />
  </AppFrame>
</template>
