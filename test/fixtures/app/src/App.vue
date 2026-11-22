<script setup lang="ts">
import AppFrame from '@nichtimkopf/ui/kit/AppFrame.vue'
import UButton from '@nuxt/ui/components/Button.vue'
</script>

<template>
  <AppFrame
    label="Areas"
    line-label="Drag to resize, click to fold"
    storage-key="fixture"
    panel-label="Details"
  >
    <template #rail>Rail</template>
    <template #navigation>Navigation</template>
    <template #navigation-footer>Navigation footer</template>
    <template #menu>Menu</template>
    <template #panel>Panel</template>

    <main class="rounded-2xl bg-raised text-success-dark ring ring-field">
      <UButton label="Button" />
    </main>
  </AppFrame>
</template>
