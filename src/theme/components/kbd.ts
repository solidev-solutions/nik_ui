// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

import type { NuxtUIOptions } from '@nuxt/ui/vite'

export const { ui: kbd } = {
  ui: {
    kbd: {
      base: 'normal-case',
      variants: { size: { sm: 'text-xs', md: 'text-xs' } },
    },
  },
} satisfies NuxtUIOptions
