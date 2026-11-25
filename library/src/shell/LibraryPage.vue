<script setup lang="ts">
import UDashboardNavbar from '@nuxt/ui/components/DashboardNavbar.vue'
import UDashboardPanel from '@nuxt/ui/components/DashboardPanel.vue'

defineProps<{ title: string }>()
defineSlots<{ default?: () => unknown }>()
</script>

<template>
  <UDashboardPanel id="page">
    <template #header>
      <UDashboardNavbar as="header" :title="title" />
    </template>

    <template #body>
      <main>
        <slot />
      </main>
    </template>
  </UDashboardPanel>
</template>
