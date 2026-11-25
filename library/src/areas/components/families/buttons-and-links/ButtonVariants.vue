<!-- SPDX-FileCopyrightText: 2025 Keenthemes Inc -->
<!-- SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska -->
<!-- SPDX-License-Identifier: MIT -->

<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-2">
    <UButton label="Save" color="primary" />
    <UButton label="Export" variant="outline" />
    <UButton label="Edit" variant="ghost" />
    <UButton label="Details" color="primary" variant="link" to="/components/buttons-and-links" />
    <UButton label="Delete" color="error" variant="soft" />
  </div>
</template>
