// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

import type { NuxtUIOptions } from '@nuxt/ui/vite'

export const { ui: overlays } = {
  ui: {
    // With an arrow, the arrow is of the tooltip's surface too.
    tooltip: { slots: { content: 'bg-raised', arrow: 'fill-(--ui-bg-raised)' } },
    slideover: {
      slots: { overlay: 'bg-overlay', content: 'bg-raised', title: 'text-base' },
      variants: { inset: { true: { content: 'rounded-xl' } } },
      compoundVariants: [
        // Inset, a slideover floats beside the page. A phone has no room for that: there it fills
        // the screen.
        {
          side: ['left', 'right'],
          inset: true,
          class: { content: 'max-sm:inset-0 max-sm:w-full max-sm:rounded-none sm:max-w-136' },
        },
      ],
    },
  },
} satisfies NuxtUIOptions
