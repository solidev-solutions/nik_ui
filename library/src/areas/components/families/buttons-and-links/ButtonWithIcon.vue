<!-- SPDX-FileCopyrightText: 2025 Keenthemes Inc -->
<!-- SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska -->
<!-- SPDX-License-Identifier: MIT -->

<script setup lang="ts">
import { icon } from '@nichtimkopf/ui/theme'
import UButton from '@nuxt/ui/components/Button.vue'
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-2">
    <UButton label="Download" :icon="icon.download" color="primary" />
    <UButton label="Next" :trailing-icon="icon.arrowRight" variant="outline" />
    <UButton label="Print" :icon="icon.print" variant="outline" />
  </div>
</template>
