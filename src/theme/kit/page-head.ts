// SPDX-FileCopyrightText: 2026 Solidev - Thomas Liska
// SPDX-License-Identifier: MIT

export const pageHead = {
  slots: {
    // What the head shows depends on its own width, not on the window's.
    root: '@container',
    // A head narrower than 36rem cannot carry the path beside the title in one row: it shows the
    // title alone. In a row that gets narrow the path gives way before the title does, down to
    // the least width of its list and no further: it never lies over the title.
    path: 'min-w-auto shrink-[99] @max-xl:hidden',
    // A link and a separator by turns. A link's column gives way from its name's width down to
    // 2rem, about two letters and the ellipsis; a name shorter than that stands in 2rem too.
    list: 'grid grid-flow-col auto-cols-[minmax(2rem,max-content)_auto]',
    link: 'text-base font-normal',
    separator: 'size-4 text-dimmed',
  },
}
