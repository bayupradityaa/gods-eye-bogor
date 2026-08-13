<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { Camera } from '@/types/camera'
import CameraCard from './CameraCard.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps<{
  cameras: Camera[]
  total: number
  canLoadMore: boolean
}>()

const emit = defineEmits<{
  select: [cam: Camera]
  loadMore: []
}>()

const gridRef = ref<HTMLElement | null>(null)

// Watch for array length changes to animate newly added cameras
watch(() => props.cameras.length, async (newLen, oldLen) => {
  if (newLen > oldLen && oldLen > 0) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    await nextTick()
    
    // Select only the newly added camera cards
    const newCards = gridRef.value?.querySelectorAll(`.camera-card:nth-child(n+${oldLen + 1})`)
    if (newCards && newCards.length > 0) {
      gsap.fromTo(newCards, 
        { opacity: 0, y: 12, scale: 0.99 }, 
        { opacity: 1, y: 0, scale: 1, stagger: 0.04, duration: 0.4, ease: 'power2.out' }
      )
    }
  }
})

// Initial enter animation for the first batch using ScrollTrigger
import { onMounted } from 'vue'
onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  ScrollTrigger.batch('.camera-card', {
    interval: 0.1,
    batchMax: 6,
    onEnter: (batch) => {
      // Only animate if they haven't been animated by the loadMore watcher
      gsap.fromTo(batch, 
        { opacity: 0, y: 20, scale: 0.98 }, 
        { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.6, ease: 'power3.out', overwrite: 'auto' }
      )
    }
  })
})
</script>

<template>
  <div>
    <!-- Empty State -->
    <div v-if="cameras.length === 0" class="text-center py-24 sm:py-32">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-muted border border-border mb-4">
        <span class="text-2xl opacity-40">⌕</span>
      </div>
      <p class="text-sm font-semibold tracking-wide uppercase" style="color: var(--text);">Kamera tidak ditemukan</p>
      <p class="text-[13px] mt-1.5 mb-6" style="color: var(--text-secondary);">Coba lokasi atau kategori lain.</p>
      <button 
        class="px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase border bg-surface hover:bg-surface-muted transition-colors"
        style="color: var(--text); border-color: var(--border);"
        @click="$emit('select', null as any)"
      >
        Hapus Pencarian
      </button>
    </div>

    <!-- Grid -->
    <div v-else ref="gridRef" class="camera-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div
        v-for="(cam, index) in cameras"
        :key="cam.id"
        class="camera-card"
        :class="{
          'sm:col-span-2 lg:col-span-2': index === 0 // Featured camera spans 2 columns
        }"
      >
        <CameraCard 
          :camera="cam" 
          :featured="index === 0"
          @select="emit('select', cam)" 
        />
      </div>
    </div>

    <!-- Load More UI -->
    <div v-if="cameras.length > 0" class="mt-16 flex flex-col items-center border-t pt-10" style="border-color: var(--border);">
      <p class="text-[10px] tracking-widest font-semibold uppercase mb-6" style="color: var(--text-muted);">
        {{ cameras.length }} / {{ total }} KAMERA
      </p>

      <button
        v-if="canLoadMore"
        class="group inline-flex items-center gap-2 px-6 py-3 rounded-full border text-xs font-semibold tracking-wide uppercase transition-all duration-300"
        style="background: var(--surface); border-color: var(--border); color: var(--text);"
        @click="emit('loadMore')"
      >
        Muat Lebih Banyak
        <span class="text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
      </button>
      
      <p v-else class="text-[9px] tracking-[0.2em] uppercase font-medium" style="color: var(--text-muted);">
        Semua kamera ditampilkan
      </p>
    </div>
  </div>
</template>

<style scoped>
.camera-card {
  will-change: transform, opacity;
}

button:hover {
  background: var(--surface-muted) !important;
  border-color: var(--border-hover) !important;
}
</style>
