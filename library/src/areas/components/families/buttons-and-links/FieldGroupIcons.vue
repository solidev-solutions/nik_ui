<!-- SPDX-FileCopyrightText: 2025 Keenthemes Inc -->
<!-- SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska -->
<!-- SPDX-License-Identifier: MIT -->

<script setup lang="ts">
import { icon } from '@nichtimkopf/ui/theme'
import UButton from '@nuxt/ui/components/Button.vue'
import UFieldGroup from '@nuxt/ui/components/FieldGroup.vue'
import UTooltip from '@nuxt/ui/components/Tooltip.vue'

const TOOLS = [
  { label: 'Archive', icon: icon.archive },
  { label: 'Remind me', icon: icon.remind },
  { label: 'Snooze', icon: icon.later },
]
</script>

<template>
  <UFieldGroup role="group" aria-label="Notification actions">
    <UTooltip v-for="tool in TOOLS" :key="tool.label" :text="tool.label">
      <UButton :icon="tool.icon" variant="outline" :aria-label="tool.label" />
    </UTooltip>
  </UFieldGroup>
</template>
