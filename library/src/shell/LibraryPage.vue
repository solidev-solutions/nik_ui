<script setup lang="ts">
import PageHead from '@nichtimkopf/ui/kit/PageHead.vue'
import type { BreadcrumbItem } from '@nuxt/ui/components/Breadcrumb.vue'
import UDashboardPanel from '@nuxt/ui/components/DashboardPanel.vue'
import UDashboardSidebarCollapse from '@nuxt/ui/components/DashboardSidebarCollapse.vue'
import { useRoute } from 'vue-router'

defineProps<{ title: string; parents?: BreadcrumbItem[] }>()
defineSlots<{ default?: () => unknown }>()

const route = useRoute()
</script>

<template>
  <UDashboardPanel id="page">
    <template #header>
      <PageHead as="header" :title="title" :parents="parents">
        <!-- The way to fold the navigation without a pointer, from 1024 px where it stands. -->
        <template v-if="route.meta.area?.navigation" #leading>
          <UDashboardSidebarCollapse />
        </template>
      </PageHead>
    </template>

    <template #body>
      <main class="mx-auto flex w-full max-w-5xl flex-col gap-12 pb-12 lg:px-8">
        <slot />
      </main>
    </template>
  </UDashboardPanel>
</template>
