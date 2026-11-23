<script setup lang="ts">
import { nikProps } from '@nichtimkopf/ui/theme'
import UApp from '@nuxt/ui/components/App.vue'
import UTheme from '@nuxt/ui/components/Theme.vue'
import { RouterView } from 'vue-router'

import RouteAnnouncer from './shell/RouteAnnouncer.vue'
</script>

<template>
  <UTheme :props="nikProps">
    <UApp>
      <RouterView />
      <RouteAnnouncer />
    </UApp>
  </UTheme>
</template>
