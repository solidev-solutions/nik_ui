<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-2">
    <UButton label="Save" color="primary" disabled />
    <UButton label="Save" variant="outline" disabled />
  </div>
</template>
