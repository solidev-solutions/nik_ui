// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

import type { NuxtUIOptions } from '@nuxt/ui/vite'

export const { ui: link } = {
  ui: {
    link: {
      base: 'underline decoration-dimmed underline-offset-2',
      variants: {
        // Nuxt UI colors a link by whether it leads to the page it stands on, in this variant,
        // which outranks `base`: either way it takes the color of the text.
        active: { true: 'text-default', false: 'text-default' },
        // Only a link that leads somewhere answers the pointer.
        disabled: { true: 'opacity-50', false: 'hover:decoration-current' },
      },
    },
    // The underline is for a link in running text. Nuxt UI sets its header's title as a link.
    header: { slots: { title: 'no-underline' } },
  },
} satisfies NuxtUIOptions
