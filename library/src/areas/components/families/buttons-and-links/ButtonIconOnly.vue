<!-- SPDX-FileCopyrightText: 2025 Keenthemes Inc -->
<!-- SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska -->
<!-- SPDX-License-Identifier: MIT -->

<script setup lang="ts">
import { icon } from '@nichtimkopf/ui/theme'
import UButton from '@nuxt/ui/components/Button.vue'
import UTooltip from '@nuxt/ui/components/Tooltip.vue'
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-2">
    <UTooltip text="Search">
      <UButton :icon="icon.search" color="primary" aria-label="Search" />
    </UTooltip>
    <UTooltip text="Filter">
      <UButton :icon="icon.filter" variant="outline" aria-label="Filter" />
    </UTooltip>
  </div>
</template>
