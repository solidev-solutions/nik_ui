// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

import type { NuxtUIOptions } from '@nuxt/ui/vite'

const hover = 'hover:before:bg-hover active:before:bg-selected'

export const { ui: navigationMenu } = {
  ui: {
    navigationMenu: {
      slots: { label: 'font-medium text-muted', separator: 'h-1 bg-transparent' },
      variants: {
        disabled: { true: { link: 'opacity-50' } },
        active: {
          true: { childLink: 'before:bg-selected' },
          false: { childLink: hover },
        },
      },
      compoundVariants: [
        { orientation: 'vertical', collapsed: false, class: { linkLeadingIcon: 'size-4' } },
        {
          orientation: 'vertical',
          collapsed: false,
          active: false,
          class: { link: 'font-normal' },
        },
        { orientation: 'vertical', collapsed: true, class: { list: 'flex flex-col gap-0.5' } },
        {
          orientation: 'vertical',
          collapsed: true,
          active: false,
          class: { linkLeadingIcon: 'text-highlighted' },
        },
        // Nuxt UI sets the fill of the current link and of one under the pointer in compound
        // variants, and those outrank a plain variant: the two below repeat their conditions.
        // Its fills for a current link under the pointer with `highlight`, and for the open entry
        // of a horizontal menu, stay as they are.
        { variant: 'pill', active: true, highlight: false, class: { link: 'before:bg-selected' } },
        { variant: 'pill', active: false, disabled: false, class: { link: hover } },
      ],
      defaultVariants: { color: 'neutral' },
    },
  },
} satisfies NuxtUIOptions
