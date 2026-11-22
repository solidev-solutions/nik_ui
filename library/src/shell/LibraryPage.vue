<script setup lang="ts">
import UDashboardSidebarToggle from '@nuxt/ui/components/DashboardSidebarToggle.vue'

defineProps<{ title: string }>()
</script>

<template>
  <main class="flex-1 p-4">
    <UDashboardSidebarToggle />
    <h1 class="text-base font-semibold">{{ title }}</h1>
  </main>
</template>
