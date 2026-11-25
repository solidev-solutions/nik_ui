<!-- SPDX-FileCopyrightText: 2025 Keenthemes Inc -->
<!-- SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska -->
<!-- SPDX-License-Identifier: MIT -->

<script setup lang="ts">
import { icon } from '@nichtimkopf/ui/theme'
import UButton from '@nuxt/ui/components/Button.vue'
import UTooltip from '@nuxt/ui/components/Tooltip.vue'
import { useClipboard } from '@vueuse/core'

const LINK = 'https://example.com/projects/2417'

const { copy, copied } = useClipboard({ copiedDuring: 2000 })
const { copy: copyByIcon, copied: copiedByIcon } = useClipboard({ copiedDuring: 2000 })
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-2">
    <UButton
      :label="copied ? 'Copied' : 'Copy link'"
      :icon="copied ? icon.copyCheck : icon.copy"
      variant="outline"
      @click="copy(LINK)"
    />
    <UTooltip :text="copiedByIcon ? 'Copied' : 'Copy link'">
      <UButton
        :icon="copiedByIcon ? icon.copyCheck : icon.copy"
        variant="outline"
        :aria-label="copiedByIcon ? 'Copied' : 'Copy link'"
        @click="copyByIcon(LINK)"
      />
    </UTooltip>
  </div>
</template>
