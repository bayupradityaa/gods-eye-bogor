<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  query: string
}>()

const emit = defineEmits<{
  'update:query': [q: string]
  'open-palette': []
}>()

const inputRef = ref<HTMLInputElement | null>(null)

function onKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    emit('open-palette')
  }
}
</script>

<template>
  <div class="relative mb-6 group w-full lg:max-w-3xl">
    <input
      ref="inputRef"
      :value="query"
      type="text"
      placeholder="Cari kamera atau lokasi..."
      class="search-input w-full px-5 py-4 pl-12 pr-24 rounded-2xl text-[15px] outline-none shadow-sm"
      @input="emit('update:query', ($event.target as HTMLInputElement).value)"
      @keydown="onKeydown"
    />
    <span class="absolute left-5 top-1/2 -translate-y-1/2 text-lg transition-colors group-focus-within:text-accent" style="color: var(--text-muted);">⌕</span>
    <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
      <button
        v-if="query"
        class="text-xs w-6 h-6 rounded-full bg-surface-muted flex items-center justify-center cursor-pointer transition-colors hover:text-text hover:bg-border"
        :style="{ color: 'var(--text-muted)' }"
        @click="emit('update:query', '')"
      >
        ✕
      </button>
      <span class="search-kbd hidden sm:inline-flex text-[11px] font-medium px-2 py-1 rounded-md tracking-widest">
        ⌘K
      </span>
    </div>
  </div>
</template>

<style scoped>
.search-input {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  transition: all 300ms ease;
}
.search-input::placeholder {
  color: var(--text-muted);
  font-weight: 400;
}
.search-input:hover {
  border-color: var(--border-hover);
}
.search-input:focus {
  border-color: var(--accent);
  background: var(--surface-elevated);
  box-shadow: 0 0 0 4px var(--accent-dim);
}

.search-kbd {
  background: var(--surface-muted);
  border: 1px solid var(--border);
  color: var(--text-secondary);
}
</style>
