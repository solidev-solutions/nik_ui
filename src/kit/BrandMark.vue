<!-- SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska -->
<!-- SPDX-License-Identifier: MIT -->

<script setup lang="ts">
import { tv } from '@nuxt/ui/utils/tv'

import { brandMark } from '../theme/kit/brand-mark.js'

const props = defineProps<{ class?: string }>()

const styles = tv(brandMark)
</script>

<template>
  <svg
    viewBox="13 23 38 18"
    fill="currentColor"
    aria-hidden="true"
    :class="styles({ class: props.class })"
  >
    <circle cx="22" cy="32" r="9" />
    <circle cx="42" cy="32" r="9" />
  </svg>
</template>
