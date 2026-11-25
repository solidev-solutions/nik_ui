// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

import type { NuxtUIOptions } from '@nuxt/ui/vite'

export const { ui: overlays } = {
  ui: {
    // With an arrow, the arrow is of the tooltip's surface too.
    tooltip: { slots: { content: 'bg-raised', arrow: 'fill-(--ui-bg-raised)' } },
  },
} satisfies NuxtUIOptions
