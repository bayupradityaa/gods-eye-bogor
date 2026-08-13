<script setup lang="ts">
import type { Camera } from '@/types/camera'
import { formatId, CATEGORY_COLORS } from '@/lib/utils'
import { Star } from '@lucide/vue'
import { useCameraPreferences } from '@/composables/useCameraPreferences'

const props = defineProps<{
  camera: Camera
  showFavorite?: boolean
  featured?: boolean
}>()

const emit = defineEmits<{
  select: []
}>()

const { isFavorite, toggleFavorite } = useCameraPreferences()

const hasTouch = typeof window !== 'undefined' && 'ontouchstart' in window

function onFavoriteClick(e: Event) {
  e.stopPropagation()
  toggleFavorite(props.camera.id)
}
</script>

<template>
  <div
    class="camera-card group relative overflow-hidden cursor-pointer flex flex-col h-full"
    :class="[featured ? 'rounded-[20px]' : 'rounded-2xl']"
    @click="emit('select')"
  >
    <!-- Preview Area -->
    <div 
      class="card-preview relative overflow-hidden bg-black flex-1 min-h-0"
      :class="[featured ? 'aspect-[16/10] sm:aspect-video' : 'aspect-video']"
    >
      <!-- Stylized Technical Placeholder (instead of empty skeleton) -->
      <div class="absolute inset-0 z-0 bg-[#0C1017]">
        <!-- Very subtle noise / texture -->
        <div class="absolute inset-0 opacity-[0.02]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
        
        <!-- Technical crosshairs -->
        <div class="absolute top-1/2 left-0 w-full h-[1px] bg-white/[0.03]"></div>
        <div class="absolute left-1/2 top-0 w-[1px] h-full bg-white/[0.03]"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border border-white/[0.05] rounded-full"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-1.5 bg-white/[0.1]"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-[1px] bg-white/[0.1]"></div>

        <!-- Corner brackets -->
        <div class="absolute top-3 left-3 w-2 h-2 border-t border-l border-white/20"></div>
        <div class="absolute top-3 right-3 w-2 h-2 border-t border-r border-white/20"></div>
        <div class="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-white/20"></div>
        <div class="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-white/20"></div>
      </div>

      <!-- Live badge -->
      <div class="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2 py-1 rounded-md backdrop-blur-md bg-black/40 border border-white/10">
        <span class="w-1.5 h-1.5 rounded-full animate-pulse" style="background: var(--accent);"></span>
        <span class="text-[9px] tracking-[0.2em] uppercase font-bold text-white leading-none pt-px">Live</span>
      </div>

      <!-- Hover scale image (simulated for placeholder) -->
      <div class="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.03] pointer-events-none"></div>
      
      <!-- Overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none"></div>

      <!-- Bottom metadata inside preview -->
      <div class="absolute bottom-3 left-3 right-3 z-10 flex justify-between items-end pointer-events-none">
        <div>
          <p class="text-[9px] tracking-widest text-white/50 tabular-nums uppercase mb-0.5">CAM {{ String(camera.id).padStart(3, '0') }}</p>
          <p class="text-[9px] tracking-widest text-white/30 tabular-nums uppercase">06°35′S 106°48′E</p>
        </div>
      </div>
    </div>

    <!-- Info Area -->
    <div class="p-3 sm:p-4 bg-surface border-t border-border flex flex-col justify-between shrink-0">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <h3 class="text-sm font-medium transition-colors group-hover:text-accent leading-snug truncate" style="color: var(--text);">
            {{ camera.name }}
          </h3>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-[10px] tracking-wider uppercase font-medium" :style="{ color: CATEGORY_COLORS[camera.category] }">
              {{ camera.category }}
            </span>
          </div>
        </div>

        <!-- Favorite button -->
        <button
          v-if="showFavorite !== false"
          class="fav-btn shrink-0 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 sm:opacity-0 transition-all duration-300"
          :class="{ 'fav-active': isFavorite(camera.id), 'opacity-100': isFavorite(camera.id) || hasTouch }"
          :aria-label="isFavorite(camera.id) ? `Remove ${camera.name} from favorites` : `Add ${camera.name} to favorites`"
          @click="onFavoriteClick"
        >
          <Star
            :size="14"
            :stroke-width="2"
            :fill="isFavorite(camera.id) ? 'currentColor' : 'none'"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.camera-card {
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms cubic-bezier(0.16, 1, 0.3, 1), border-color 300ms ease;
}
.camera-card:hover {
  border-color: var(--border-hover);
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.bg-surface {
  background: var(--surface);
}

.fav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  min-width: 44px;
  min-height: 44px;
  padding: 7px;
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  background: transparent;
  border: none;
}
.fav-btn:hover {
  color: var(--text);
  background: var(--surface-muted);
}
.fav-btn:active {
  transform: scale(0.9);
}
.fav-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.fav-active, .fav-active:hover {
  color: var(--accent);
  background: var(--accent-soft);
}
</style>
