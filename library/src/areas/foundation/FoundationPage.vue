<script setup lang="ts">
import CatalogCard from '@nichtimkopf/ui/kit/CatalogCard.vue'

import LibraryPage from '../../shell/LibraryPage.vue'
import { GROUPS } from './sections.ts'
</script>

<template>
  <LibraryPage title="Foundation">
    <section v-for="group in GROUPS" :key="group.label" class="flex flex-col gap-4">
      <h2 class="text-base font-semibold">{{ group.label }}</h2>
      <!-- Without the role a screen reader does not call a list without markers a list. -->
      <ul role="list" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="section in group.sections" :key="section.id">
          <CatalogCard
            :to="{ name: 'section', params: { section: section.id } }"
            :label="section.label"
            :icon="section.icon"
          />
        </li>
      </ul>
    </section>
  </LibraryPage>
</template>
