// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

import type { NuxtUIOptions } from '@nuxt/ui/vite'

export const { ui: button } = {
  ui: {
    button: {
      slots: {
        // A press moves the button down by 1 px. Not one that opens a menu or a popover: that opens
        // on the release, against the button on its way back, and would jump 1 px after it. By a
        // transform, which adds to a place the button has by a translate of its own: one centered
        // by half its height stays there. The transition gives way to one a caller names.
        base: 'disabled:opacity-50 aria-disabled:opacity-50 active:not-disabled:not-aria-disabled:not-aria-[haspopup]:[transform:translateY(1px)] transition-transform motion-reduce:transition-none',
      },
      // Nuxt UI sets an icon-only button's padding and the look of each color in compound
      // variants, and those outrank a plain variant: an entry below repeats the conditions of the
      // one it changes. A class stands written out per color, because Tailwind finds no class that
      // is put together from parts.
      compoundVariants: [
        // A size's classes belong in `variants`. With `theme.transitions: false` Nuxt UI generates
        // a `false` among the button's own classes, and its type for `variants` then takes no
        // class per slot: these stand here, each as a compound variant of one condition.
        { size: 'xs', class: { leadingIcon: 'size-3', trailingIcon: 'size-3' } },
        { size: 'sm', class: { leadingIcon: 'size-3.5', trailingIcon: 'size-3.5' } },
        {
          size: 'md',
          class: { base: 'rounded-lg', leadingIcon: 'size-4', trailingIcon: 'size-4' },
        },
        {
          size: 'lg',
          class: {
            base: 'px-2.5 gap-1.5 rounded-lg',
            leadingIcon: 'size-4',
            trailingIcon: 'size-4',
          },
        },
        {
          size: 'xl',
          class: { base: 'rounded-lg', leadingIcon: 'size-5', trailingIcon: 'size-5' },
        },
        // An icon-only button keeps Nuxt UI's height although its icon is smaller. Only one with
        // an icon: a square button with a label or an avatar has Nuxt UI's height as it is.
        { size: 'xs', square: true, leading: true, class: 'p-1.5' },
        { size: 'sm', square: true, leading: true, class: 'p-1.75' },
        { size: 'md', square: true, leading: true, class: 'p-2' },
        { size: 'lg', square: true, leading: true, class: 'p-2.5' },
        { size: 'xl', square: true, leading: true, class: 'p-2.5' },
        { size: 'xs', square: true, trailing: true, class: 'p-1.5' },
        { size: 'sm', square: true, trailing: true, class: 'p-1.75' },
        { size: 'md', square: true, trailing: true, class: 'p-2' },
        { size: 'lg', square: true, trailing: true, class: 'p-2.5' },
        { size: 'xl', square: true, trailing: true, class: 'p-2.5' },
        // Nuxt UI takes a fill back to 75 % under the pointer and the press: in the light theme the
        // label on the primary color falls from 7.4:1 to 4.0:1 there. At 90 % it keeps 5.8:1.
        { color: 'primary', variant: 'solid', class: 'hover:bg-primary/90 active:bg-primary/90' },
        { color: 'success', variant: 'solid', class: 'hover:bg-success/90 active:bg-success/90' },
        { color: 'info', variant: 'solid', class: 'hover:bg-info/90 active:bg-info/90' },
        { color: 'warning', variant: 'solid', class: 'hover:bg-warning/90 active:bg-warning/90' },
        { color: 'error', variant: 'solid', class: 'hover:bg-error/90 active:bg-error/90' },
        {
          color: 'primary',
          variant: 'link',
          class: 'hover:text-primary/90 active:text-primary/90',
        },
        {
          color: 'success',
          variant: 'link',
          class: 'hover:text-success/90 active:text-success/90',
        },
        { color: 'info', variant: 'link', class: 'hover:text-info/90 active:text-info/90' },
        {
          color: 'warning',
          variant: 'link',
          class: 'hover:text-warning/90 active:text-warning/90',
        },
        { color: 'error', variant: 'link', class: 'hover:text-error/90 active:text-error/90' },
        // On its own soft fill a status's color reads below 4.5:1, in the light theme at 2.5:1 to
        // 4.4:1: the label takes the status's dark text, the error's its text role.
        { color: 'error', variant: ['soft', 'subtle'], class: 'text-error-text' },
        { color: 'success', variant: ['soft', 'subtle'], class: 'text-success-dark' },
        { color: 'warning', variant: ['soft', 'subtle'], class: 'text-warning-dark' },
        { color: 'info', variant: ['soft', 'subtle'], class: 'text-info-dark' },
        {
          color: 'neutral',
          variant: 'outline',
          class: 'ring-default hover:bg-hover active:bg-selected',
        },
        { color: 'neutral', variant: 'ghost', class: 'hover:bg-hover active:bg-selected' },
        // The fill of one that is on stays under the pointer.
        {
          color: 'neutral',
          variant: ['outline', 'ghost'],
          active: true,
          class: 'bg-selected hover:bg-selected',
        },
      ],
      defaultVariants: { color: 'neutral' },
    },
  },
} satisfies NuxtUIOptions
