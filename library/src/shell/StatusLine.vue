<script setup lang="ts">
import { onScopeDispose } from 'vue'
import { START_LOCATION, useRouter } from 'vue-router'

import { announce, announcement } from './announcer.ts'

// The app's one status line, for what happens without a move of the focus. A change of page loads
// no document, so a screen reader would say nothing: the line says the new page's title. Not for
// the page a reader arrives on, which it reads itself, nor for a move within a page, which takes
// the focus along. A page is known by its route, not by its address, which may end in a slash.
onScopeDispose(
  useRouter().afterEach((to, from, failure) => {
    const within =
      to.name === from.name && JSON.stringify(to.params) === JSON.stringify(from.params)
    if (!failure && from !== START_LOCATION && !within) announce(document.title)
  }),
)
</script>

<template>
  <!-- The role alone makes it a live region, but an open dialog hides what is around it from a
       screen reader and spares only what names `aria-live` itself: the menu is such a dialog. -->
  <p role="status" aria-live="polite" class="sr-only">{{ announcement }}</p>
</template>
