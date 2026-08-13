<script setup lang="ts">
import type { FilterCategory } from '@/types/camera'
import { CATEGORIES } from '@/lib/utils'

defineProps<{
  active: FilterCategory
}>()

const emit = defineEmits<{
  change: [cat: FilterCategory]
}>()
</script>

<template>
  <div class="flex flex-wrap gap-2 mb-8">
    <button
      v-for="cat in CATEGORIES"
      :key="cat.value"
      class="px-4 py-2 rounded-lg text-xs tracking-wider font-medium transition-all duration-200 cursor-pointer"
      :class="active === cat.value
        ? 'bg-accent/15 text-accent border border-accent/20 shadow-glow'
        : 'bg-white/[0.03] text-text-secondary border border-white/[0.06] hover:bg-white/[0.06] hover:text-white'"
      @click="emit('change', cat.value as FilterCategory)"
    >
      {{ cat.label }}
    </button>
  </div>
</template>
