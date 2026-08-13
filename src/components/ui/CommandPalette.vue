<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Camera } from '@/types/camera'
import { CAMERAS } from '@/data/cameras'
import { formatId, CATEGORY_COLORS } from '@/lib/utils'
import { nextTick } from 'vue'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
  select: [cam: Camera]
}>()

const query = ref('')
const selectedIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

const results = computed(() => {
  if (!query.value) return CAMERAS.slice(0, 8)
  const q = query.value.toLowerCase()
  return CAMERAS.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q) ||
    String(c.id).includes(q)
  ).slice(0, 10)
})

watch(() => props.open, (open) => {
  if (open) {
    query.value = ''
    selectedIndex.value = 0
    nextTick(() => inputRef.value?.focus())
    document.body.classList.add('no-scroll')
  } else {
    document.body.classList.remove('no-scroll')
  }
})


function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, results.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
  } else if (e.key === 'Enter' && results.value[selectedIndex.value]) {
    emit('select', results.value[selectedIndex.value])
  } else if (e.key === 'Escape') {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out-expo"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-[15vh]" @click="emit('close')">
        <div
          class="w-full max-w-lg bg-[#11161F] rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden"
          @click.stop
        >
          <!-- Search input -->
          <div class="relative border-b border-white/[0.06]">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-base z-10">⌕</span>
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              placeholder="Search cameras..."
              class="w-full px-4 py-4 pl-11 pr-4 bg-transparent text-sm text-white placeholder:text-text-muted/50 outline-none"
              @keydown="onKeydown"
            />
          </div>

          <!-- Results -->
          <div class="max-h-80 overflow-y-auto p-2">
            <button
              v-for="(cam, i) in results"
              :key="cam.id"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer"
              :class="i === selectedIndex ? 'bg-accent/10 border border-accent/15' : 'hover:bg-white/[0.03] border border-transparent'"
              @click="emit('select', cam)"
              @mouseenter="selectedIndex = i"
            >
              <div class="flex-1 min-w-0">
                <p class="text-sm text-white truncate" :class="{ 'text-accent': i === selectedIndex }">
                  {{ cam.name }}
                </p>
                <p class="text-[11px] text-text-muted mt-0.5">
                  {{ formatId(cam.id) }} · <span :style="{ color: CATEGORY_COLORS[cam.category] }">{{ cam.category }}</span>
                </p>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <span class="w-1.5 h-1.5 rounded-full bg-accent/60"></span>
                <span class="text-[10px] text-text-muted uppercase tracking-wider">Live</span>
              </div>
            </button>

            <div v-if="results.length === 0" class="py-8 text-center">
              <p class="text-sm text-text-muted">No cameras found</p>
              <p class="text-xs text-text-muted/50 mt-1">Try a different search</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-4 py-2.5 border-t border-white/[0.04] flex items-center gap-4 text-[10px] text-text-muted">
            <span>↑↓ Navigate</span>
            <span>↵ Open</span>
            <span>ESC Close</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
