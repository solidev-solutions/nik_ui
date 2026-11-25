<script setup lang="ts">
import CatalogCard from '@nichtimkopf/ui/kit/CatalogCard.vue'

import CardGroup from '../../shell/CardGroup.vue'
import LibraryPage from '../../shell/LibraryPage.vue'
import { GROUPS } from './sections.ts'
</script>

<template>
  <LibraryPage title="Foundation">
    <CardGroup v-for="group in GROUPS" :key="group.label" :label="group.label">
      <li v-for="section in group.sections" :key="section.id">
        <CatalogCard
          :to="{ name: 'section', params: { section: section.id } }"
          :label="section.label"
          :icon="section.icon"
        />
      </li>
    </CardGroup>
  </LibraryPage>
</template>
