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
  <div class="filter-scroll flex flex-nowrap items-center gap-2 mb-8 overflow-x-auto pb-3 -mx-4 px-4 sm:-mx-0 sm:px-0 lg:max-w-4xl">
    <button
      v-for="cat in CATEGORIES"
      :key="cat.value"
      class="filter-btn shrink-0 px-4 py-2.5 rounded-full text-[13px] font-medium cursor-pointer tracking-wide"
      :class="active === cat.value ? 'filter-active' : 'filter-inactive'"
      @click="emit('change', cat.value as FilterCategory)"
    >
      {{ cat.label }}
    </button>
  </div>
</template>

<style scoped>
.filter-scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.filter-scroll::-webkit-scrollbar {
  display: none;
}

.filter-btn {
  transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid transparent;
}

.filter-active {
  background: var(--accent-dim);
  color: var(--accent);
  border-color: var(--accent-soft);
  box-shadow: 0 2px 8px var(--accent-dim);
}

.filter-inactive {
  background: transparent;
  color: var(--text-secondary);
  border-color: var(--border);
}
.filter-inactive:hover {
  background: var(--surface-muted);
  color: var(--text);
  border-color: var(--border-hover);
}
</style>
