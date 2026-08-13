<script setup lang="ts">
import { onMounted } from 'vue'
import type { Camera } from '@/types/camera'
import CameraCard from './CameraCard.vue'
import gsap from 'gsap'

defineProps<{
  cameras: Camera[]
}>()

const emit = defineEmits<{
  select: [cam: Camera]
}>()

onMounted(() => {
  gsap.from('.camera-card', {
    scrollTrigger: { trigger: '.camera-grid', start: 'top 90%' },
    opacity: 0,
    y: 20,
    scale: 0.98,
    stagger: 0.04,
    duration: 0.4,
    ease: 'power3.out',
  })
})
</script>

<template>
  <div v-if="cameras.length === 0" class="text-center py-20">
    <div class="text-4xl mb-4 opacity-30">⌕</div>
    <p class="text-text-muted text-sm">No cameras found</p>
    <p class="text-text-muted/50 text-xs mt-1">Try another search or category</p>
  </div>

  <div v-else class="camera-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
    <div
      v-for="cam in cameras"
      :key="cam.id"
      class="camera-card"
    >
      <CameraCard :camera="cam" @select="emit('select', cam)" />
    </div>
  </div>
</template>
