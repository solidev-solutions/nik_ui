<script setup lang="ts">
import { nikProps } from '@nichtimkopf/ui/theme'
import UApp from '@nuxt/ui/components/App.vue'
import UTheme from '@nuxt/ui/components/Theme.vue'
import { RouterView } from 'vue-router'

import StatusLine from './shell/StatusLine.vue'
</script>

<template>
  <UTheme :props="nikProps">
    <UApp>
      <RouterView />
      <StatusLine />
    </UApp>
  </UTheme>
</template>
