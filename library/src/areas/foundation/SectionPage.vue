<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import LibraryPage from '../../shell/LibraryPage.vue'
import { sectionOf } from './sections.ts'

const props = defineProps<{ section: string }>()
// The router lets in only a section that exists, and only below its area.
const section = computed(() => sectionOf(props.section)!)
const area = useRoute().meta.area!
const parents = [{ label: area.label, to: { name: area.id } }]
</script>

<template>
  <LibraryPage :title="section.label" :parents="parents" />
</template>
