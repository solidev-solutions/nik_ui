<!-- SPDX-FileCopyrightText: 2025 Keenthemes Inc -->
<!-- SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska -->
<!-- SPDX-License-Identifier: MIT -->

<script setup lang="ts">
import { tv } from '@nuxt/ui/utils/tv'

import { frameHeader } from '../theme/kit/frame.js'

const props = defineProps<{ class?: string }>()
defineSlots<{ default: () => unknown }>()

const styles = tv(frameHeader)
</script>

<template>
  <div :class="styles({ class: props.class })">
    <slot />
  </div>
</template>
