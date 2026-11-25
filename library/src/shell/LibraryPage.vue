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
      <main class="mx-auto flex w-full max-w-5xl flex-col gap-12 pb-12 lg:px-8">
        <slot />
      </main>
    </template>
  </UDashboardPanel>
</template>
