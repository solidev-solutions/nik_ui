// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

import type { NuxtUIOptions } from '@nuxt/ui/vite'

export const { ui: sidebar } = {
  ui: { sidebar: { slots: { title: 'text-base' } } },
} satisfies NuxtUIOptions
