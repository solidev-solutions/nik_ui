<!-- SPDX-FileCopyrightText: 2025 Keenthemes Inc -->
<!-- SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska -->
<!-- SPDX-License-Identifier: MIT -->

<script setup lang="ts">
import UButton from '@nuxt/ui/components/Button.vue'

const save = () => new Promise<void>((resolve) => setTimeout(resolve, 900))
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-2">
    <UButton label="Please wait" color="primary" loading />
    <UButton label="Save changes" color="primary" loading-auto @click="save" />
  </div>
</template>
