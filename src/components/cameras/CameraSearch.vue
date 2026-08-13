<script setup lang="ts">
import { watch, ref } from 'vue'

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
  <div class="relative mb-6">
    <input
      ref="inputRef"
      :value="query"
      type="text"
      placeholder="Search cameras..."
      class="w-full px-4 py-3 pl-11 pr-24 rounded-xl bg-surface border border-white/[0.06] text-sm text-white placeholder:text-text-muted/50 outline-none transition-all duration-200 focus:border-accent/30 focus:bg-surface-elevated focus:shadow-glow"
      @input="emit('update:query', ($event.target as HTMLInputElement).value)"
      @keydown="onKeydown"
    />
    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-base">⌕</span>
    <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
      <span class="hidden sm:inline-flex text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-text-muted">
        ⌘K
      </span>
      <button
        v-if="query"
        class="text-text-muted hover:text-white transition-colors text-xs cursor-pointer"
        @click="emit('update:query', '')"
      >
        ✕
      </button>
    </div>
  </div>
</template>
