<script setup lang="ts">
import type { FilterCategory } from '@/types/camera'
import { CATEGORIES } from '@/lib/utils'

defineProps<{
  active: FilterCategory
  counts?: Record<string, number>
}>()

const emit = defineEmits<{
  change: [cat: FilterCategory]
}>()
</script>

<template>
  <div class="filter-scroll flex flex-nowrap items-center gap-2 mb-8 overflow-x-auto pb-3 -mx-4 px-4 sm:-mx-0 sm:px-0">
    <button
      v-for="cat in CATEGORIES"
      :key="cat.value"
      class="filter-btn shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-medium cursor-pointer tracking-wide"
      :class="active === cat.value ? 'filter-active' : 'filter-inactive'"
      @click="emit('change', cat.value as FilterCategory)"
    >
      <span>{{ cat.label }}</span>
      <span
        v-if="counts && counts[cat.value] !== undefined"
        class="text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors"
        :class="active === cat.value ? 'bg-primary/20 text-primary' : 'bg-surface-muted text-text-muted border border-border'"
      >
        {{ counts[cat.value] }}
      </span>
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
  background: var(--primary-dim);
  color: var(--primary);
  border-color: var(--primary-soft);
  box-shadow: 0 2px 8px var(--primary-dim);
}

.filter-inactive {
  background: transparent;
  color: var(--text-secondary);
  border-color: var(--border);
}
.filter-inactive:hover {
  background: var(--motion-dim);
  color: var(--motion);
  border-color: var(--motion-soft);
}
</style>
