<script setup lang="ts">
import { onMounted } from 'vue'
import type { Camera } from '@/types/camera'
import CameraCard from './CameraCard.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

defineProps<{
  cameras: Camera[]
}>()

const emit = defineEmits<{
  select: [cam: Camera]
}>()

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  ScrollTrigger.batch('.camera-card', {
    interval: 0.1,
    batchMax: 6,
    onEnter: (batch) => {
      gsap.fromTo(batch, 
        { opacity: 0, y: 30, scale: 0.96 }, 
        { opacity: 1, y: 0, scale: 1, stagger: 0.05, duration: 0.6, ease: 'power3.out', overwrite: true }
      )
    }
  })
})
</script>

<template>
  <div v-if="cameras.length === 0" class="text-center py-24 sm:py-32">
    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-muted border border-border mb-4">
      <span class="text-2xl opacity-40">⌕</span>
    </div>
    <p class="text-sm font-medium tracking-wide uppercase" style="color: var(--text);">No cameras found</p>
    <p class="text-xs mt-1.5" style="color: var(--text-secondary);">Try adjusting your search or category filter.</p>
  </div>

  <div v-else class="camera-grid grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
    <div
      v-for="(cam, index) in cameras"
      :key="cam.id"
      class="camera-card"
      :class="{
        'col-span-2 lg:col-span-2': index === 0 // Featured camera spans 2 columns
      }"
    >
      <CameraCard 
        :camera="cam" 
        :featured="index === 0"
        @select="emit('select', cam)" 
      />
    </div>
  </div>
</template>

<style scoped>
.camera-card {
  will-change: transform, opacity;
}
</style>
