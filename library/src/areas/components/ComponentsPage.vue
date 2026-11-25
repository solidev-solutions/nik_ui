<script setup lang="ts">
import CatalogCard from '@nichtimkopf/ui/kit/CatalogCard.vue'

import CardGroup from '../../shell/CardGroup.vue'
import LibraryPage from '../../shell/LibraryPage.vue'
import { GROUPS } from './families.ts'
</script>

<template>
  <LibraryPage title="Components">
    <CardGroup v-for="group in GROUPS" :key="group.label" :label="group.label">
      <li v-for="family in group.families" :key="family.id">
        <CatalogCard
          :to="{ name: 'family', params: { family: family.id } }"
          :label="family.label"
          :icon="family.icon"
        />
      </li>
    </CardGroup>
  </LibraryPage>
</template>
