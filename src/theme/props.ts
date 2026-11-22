// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

import type { ThemeProps } from '@nuxt/ui/components/Theme.vue'

/** The defaults of props, which no class can set: an app hands them to Nuxt UI's `UTheme`. */
export const { props: nikProps } = {
  props: {
    slideover: { inset: true },
    tooltip: { delayDuration: 300, ignoreNonKeyboardFocus: true },
  },
} satisfies ThemeProps
