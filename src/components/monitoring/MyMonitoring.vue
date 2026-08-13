<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Star, Clock, ArrowRight } from '@lucide/vue'
import type { Camera } from '@/types/camera'
import { useCameraPreferences } from '@/composables/useCameraPreferences'
import CameraCard from '@/components/cameras/CameraCard.vue'

gsap.registerPlugin(ScrollTrigger)

const {
  favoriteCameraList,
  recentCameraList,
  hasPreferences,
} = useCameraPreferences()

const emit = defineEmits<{
  select: [cam: Camera]
}>()

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  gsap.from('.monitoring-section .monitoring-content', {
    scrollTrigger: { trigger: '.monitoring-section', start: 'top 90%' },
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power3.out',
  })
})
</script>

<template>
  <section class="monitoring-section relative z-10 layout-container py-8 sm:py-12">
    <div class="monitoring-content">
      
      <!-- Empty State -->
      <template v-if="!hasPreferences">
        <div class="empty-state-compact flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl px-6 py-6 sm:px-8 border" style="background: var(--surface-muted); border-color: var(--border);">
          <div class="flex items-center gap-4">
            <div class="empty-icon shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-black/20 border" style="border-color: var(--border);">
              <Star :size="16" :stroke-width="2" style="color: var(--text-muted);" />
            </div>
            <div>
              <p class="text-sm font-semibold tracking-wide uppercase" style="color: var(--text);">My Monitoring</p>
              <p class="text-[13px] mt-0.5" style="color: var(--text-secondary);">
                Simpan kamera yang sering kamu pantau untuk akses lebih cepat.
              </p>
            </div>
          </div>
          <a
            href="#explorer"
            class="explore-cta shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wide cursor-pointer border"
            style="background: var(--surface); border-color: var(--border); color: var(--text);"
          >
            Explore Cameras
            <span class="text-sm">→</span>
          </a>
        </div>
      </template>

      <!-- Has Content -->
      <template v-else>
        <div class="mb-8">
          <p class="text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2 font-medium" style="color: var(--text-muted);">Personalized</p>
          <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight" style="color: var(--text);">
            My Monitoring
          </h2>
        </div>

        <div class="grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-12 items-start">
          <!-- Favorites -->
          <div v-if="favoriteCameraList.length > 0" class="min-w-0">
            <div class="flex items-center gap-2 mb-4">
              <Star :size="14" :stroke-width="2" style="color: var(--accent);" />
              <span class="text-[10px] sm:text-xs tracking-wider uppercase font-semibold" style="color: var(--text-secondary);">
                Favorites · {{ favoriteCameraList.length }}
              </span>
            </div>
            <div class="monitoring-scroll flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-0 sm:px-0">
              <div
                v-for="cam in favoriteCameraList"
                :key="cam.id"
                class="shrink-0 w-[280px]"
              >
                <CameraCard :camera="cam" @select="emit('select', cam)" />
              </div>
            </div>
          </div>

          <!-- Recently Viewed -->
          <div v-if="recentCameraList.length > 0" class="shrink-0">
            <div class="flex items-center gap-2 mb-4">
              <Clock :size="14" :stroke-width="2" style="color: var(--text-muted);" />
              <span class="text-[10px] sm:text-xs tracking-wider uppercase font-semibold" style="color: var(--text-secondary);">
                Recently Viewed
              </span>
            </div>
            <div class="flex flex-col gap-2">
              <div
                v-for="cam in recentCameraList"
                :key="cam.id"
                class="recent-item flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer border"
                @click="emit('select', cam)"
              >
                <div class="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style="background: var(--accent);"></div>
                <div class="min-w-0 flex-1">
                  <p class="text-[13px] font-medium truncate" style="color: var(--text);">{{ cam.name }}</p>
                  <p class="text-[10px] tracking-wider uppercase mt-0.5 tabular-nums" style="color: var(--text-muted);">
                    CAM {{ String(cam.id).padStart(3, '0') }} · {{ cam.category }}
                  </p>
                </div>
                <ArrowRight :size="14" :stroke-width="2" class="shrink-0 text-muted opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.monitoring-scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.monitoring-scroll::-webkit-scrollbar {
  display: none;
}

.explore-cta {
  transition: all 200ms ease;
}
.explore-cta:hover {
  background: var(--bg-secondary);
  border-color: var(--border-hover);
}

.recent-item {
  background: var(--surface);
  border-color: var(--border);
  transition: all 200ms ease;
}
.recent-item:hover {
  border-color: var(--border-hover);
  background: var(--surface-elevated);
  box-shadow: var(--shadow-sm);
  transform: translateX(2px);
}
</style>
