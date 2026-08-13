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

  const ctx = gsap.context(() => {
    // Reveal the section text and wrappers first
    gsap.from('.monitoring-content > div:not(.camera-card-wrapper)', {
      scrollTrigger: { trigger: '.monitoring-section', start: 'top 90%' },
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
    })

    // Batch animate camera cards identically to Hero and CameraGrid
    ScrollTrigger.batch('.monitoring-section .camera-card', {
      interval: 0.1,
      batchMax: 4,
      onEnter: (batch) => {
        gsap.fromTo(batch, 
          { opacity: 0, clipPath: 'inset(0% 0% 100% 0%)', scale: 1.04 }, 
          { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', scale: 1, stagger: 0.08, duration: 0.9, ease: 'cubic-bezier(0.16, 1, 0.3, 1)', overwrite: 'auto' }
        )
      }
    })
  })
})
</script>

<template>
  <section id="watchlist" class="monitoring-section relative z-10 layout-container">
    <div class="monitoring-content">
      
      <!-- Empty State -->
      <template v-if="!hasPreferences">
        <div class="empty-state-compact flex flex-col items-center justify-center text-center gap-4 rounded-3xl p-10 sm:p-16 border mx-auto max-w-3xl" style="background: var(--surface); border-color: var(--border);">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center border mb-2" style="border-color: var(--border); background: var(--surface-muted);">
            <Star :size="24" :stroke-width="1.5" style="color: var(--text-muted);" />
          </div>
          <div>
            <h3 class="text-lg sm:text-xl font-semibold tracking-tight" style="color: var(--text);">Belum ada kamera yang disimpan</h3>
            <p class="text-sm mt-2 max-w-sm mx-auto" style="color: var(--text-secondary);">
              Simpan kamera yang sering Anda pantau untuk akses lebih cepat.
            </p>
          </div>
          <a
            href="#cameras"
            class="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-colors border hover:bg-[var(--surface-muted)]"
            style="background: transparent; border-color: var(--border); color: var(--text);"
          >
            Jelajahi Kamera
          </a>
        </div>
      </template>

      <!-- Has Content -->
      <template v-else>
        <div class="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p class="text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2 font-medium" style="color: var(--text-muted);">Personal</p>
            <h2 class="text-3xl sm:text-4xl lg:text-4xl font-semibold tracking-tight" style="color: var(--text);">
              Pantauan Saya
            </h2>
            <p class="mt-3 text-[14px] sm:text-[15px] leading-relaxed max-w-lg" style="color: var(--text-secondary);">
              Kamera yang Anda simpan untuk akses cepat.
            </p>
          </div>
          <div class="hidden sm:flex items-center pb-1">
            <span class="text-[11px] tracking-[0.2em] uppercase font-bold" style="color: var(--text-muted);">
              {{ String(favoriteCameraList.length).padStart(2, '0') }} Kamera
            </span>
          </div>
        </div>

        <div class="grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-12 items-start">
          <!-- Favorites -->
          <div v-if="favoriteCameraList.length > 0" class="min-w-0">
            <div class="flex items-center gap-2 mb-4">
              <Star :size="14" :stroke-width="2" style="color: var(--accent);" />
              <span class="text-[10px] sm:text-xs tracking-wider uppercase font-semibold" style="color: var(--text-secondary);">
                Favorit · {{ favoriteCameraList.length }}
              </span>
            </div>
            <div class="monitoring-scroll flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-0 sm:px-0">
              <div
                v-for="cam in favoriteCameraList"
                :key="cam.id"
                class="shrink-0 w-[280px] sm:w-[320px]"
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
                Terakhir Dilihat
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
