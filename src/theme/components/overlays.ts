// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

import type { NuxtUIOptions } from '@nuxt/ui/vite'

export const { ui: overlays } = {
  ui: {
    tooltip: { slots: { content: 'bg-raised' } },
  },
} satisfies NuxtUIOptions
