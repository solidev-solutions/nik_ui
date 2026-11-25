// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

export const resizeLine = {
  slots: {
    root: 'hover:[&>div]:bg-primary peer-data-[dragging=true]:[&>div]:bg-primary',
    grip: 'relative z-2 h-6 w-1 shrink-0 rounded-lg bg-accented',
  },
}
