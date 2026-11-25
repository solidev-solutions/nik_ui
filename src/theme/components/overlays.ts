// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

import type { NuxtUIOptions } from '@nuxt/ui/vite'

// What lies above the page stands on the raised surface: in the dark theme it is lighter than the
// page, where no shadow shows.
const raised = { slots: { content: 'bg-raised' } }
// With an arrow, the arrow is of the surface too.
const pointing = { slots: { ...raised.slots, arrow: 'fill-(--ui-bg-raised)' } }

export const { ui: overlays } = {
  ui: {
    tooltip: pointing,
    dropdownMenu: raised,
    contextMenu: raised,
    popover: raised,
    // Nuxt UI dims the page under a dialog and a drawer with the elevated background, which is a
    // faint tint in this theme: the overlay role dims it, as under the slideover.
    modal: { ...raised, variants: { overlay: { true: { overlay: 'bg-overlay' } } } },
    drawer: { slots: { overlay: 'bg-overlay', content: 'bg-raised' } },
    card: { variants: { variant: { outline: { root: 'bg-raised' } } } },
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
        // One from the bottom or the top lies on that edge there, over the full width.
        {
          side: 'bottom',
          inset: true,
          class: { content: 'max-sm:inset-x-0 max-sm:bottom-0 max-sm:rounded-b-none' },
        },
        {
          side: 'top',
          inset: true,
          class: { content: 'max-sm:inset-x-0 max-sm:top-0 max-sm:rounded-t-none' },
        },
      ],
    },
  },
} satisfies NuxtUIOptions
