<script setup lang="ts">
import AppFrame from '@nichtimkopf/ui/kit/AppFrame.vue'
import BrandMark from '@nichtimkopf/ui/kit/BrandMark.vue'
import { nikProps } from '@nichtimkopf/ui/theme'
import UApp from '@nuxt/ui/components/App.vue'
import UButton from '@nuxt/ui/components/Button.vue'
import UTheme from '@nuxt/ui/components/Theme.vue'
</script>

<template>
  <UTheme :props="nikProps">
    <UApp>
      <AppFrame
        label="Areas"
        line-label="Drag to resize, click to fold"
        storage-key="fixture"
        panel-label="Details"
      >
        <template #rail><BrandMark class="w-5" /></template>
        <template #navigation>Navigation</template>
        <template #navigation-footer>Navigation footer</template>
        <template #menu>Menu</template>
        <template #panel>Panel</template>

        <main class="rounded-2xl bg-raised text-success-dark ring ring-field">
          <UButton label="Button" />
        </main>
      </AppFrame>
    </UApp>
  </UTheme>
</template>
