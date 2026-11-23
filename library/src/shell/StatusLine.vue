<script setup lang="ts">
import { onScopeDispose } from 'vue'
import { START_LOCATION, useRouter } from 'vue-router'

import { announce, announcement } from './announcer.ts'

// The app's one status line, for what happens without a move of the focus. A change of page loads
// no document, so a screen reader would say nothing: the line says the new page's title. Not for
// the page a reader arrives on, which it reads itself.
onScopeDispose(
  useRouter().afterEach((_to, from, failure) => {
    if (!failure && from !== START_LOCATION) announce(document.title)
  }),
)
</script>

<template>
  <!-- The role alone makes it a live region, but an open dialog hides what is around it from a
       screen reader and spares only what names `aria-live` itself: the menu is such a dialog. -->
  <p role="status" aria-live="polite" class="sr-only">{{ announcement }}</p>
</template>
