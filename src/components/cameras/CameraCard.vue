<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Camera } from '@/types/camera'
import { formatId } from '@/lib/utils'
import { Star, MapPin } from '@lucide/vue'
import { useCameraPreferences } from '@/composables/useCameraPreferences'

const props = defineProps<{
  camera: Camera
  showFavorite?: boolean
}>()

const emit = defineEmits<{
  select: []
}>()

const { isFavorite, toggleFavorite } = useCameraPreferences()

const imageError = ref(false)

const snapshotUrl = computed(() => {
  return props.camera.stream.replace('.m3u8', '.jpg')
})

function onFavoriteClick(e: Event) {
  e.stopPropagation()
  toggleFavorite(props.camera.id)
}
</script>

<template>
  <div
    class="camera-card group relative flex flex-col h-full overflow-hidden rounded-xl border shadow-[0_4px_20px_rgba(15,23,42,0.06)] dark:shadow-none cursor-pointer"
    style="background: var(--surface-elevated); border-color: var(--border);"
    @click="emit('select')"
  >
    <!-- Top Image Section -->
    <div class="relative aspect-video w-full overflow-hidden bg-[#0C1017]">
      <!-- Snapshot Image -->
      <img
        v-if="!imageError"
        :src="snapshotUrl"
        :alt="`CCTV ${camera.name}`"
        loading="lazy"
        class="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
        @error="imageError = true"
      />

      <!-- Hover Play Overlay -->
      <div v-if="!imageError" class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-10 pointer-events-none">
        <div class="w-12 h-12 rounded-full bg-black/30 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="ml-1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        </div>
      </div>

      <!-- Fallback Signal Error -->
      <div v-else class="h-full w-full bg-[#070A10] font-mono flex flex-col items-center justify-center text-white/40 text-[10px] tracking-widest uppercase">
        <div class="absolute inset-0 opacity-[0.04]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
        <span>CAM {{ String(camera.id).padStart(3, '0') }}</span>
        <span class="mt-1 text-[9px] text-red-400/80">NO SIGNAL</span>
      </div>

      <!-- Subtle Bottom Gradient for Text Legibility -->
      <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none"></div>

      <!-- Live Indicator (Bottom Left) -->
      <div class="absolute bottom-3 left-3 flex items-center gap-1.5 z-10 pointer-events-none">
        <span class="w-1.5 h-1.5 rounded-full bg-[#F28C28] animate-pulse"></span>
        <span class="text-[10px] sm:text-[11px] font-semibold tracking-[0.08em] text-[#F28C28] uppercase font-['Plus_Jakarta_Sans']">LIVE</span>
      </div>

      <!-- Favorite Button (Bottom Right) -->
      <button
        v-if="showFavorite !== false"
        class="btn-fav absolute bottom-2 right-2 z-20 flex items-center justify-center w-8 h-8 rounded-full"
        :class="isFavorite(camera.id) ? 'text-[#F28C28]' : 'text-white/40'"
        :aria-label="isFavorite(camera.id) ? `Remove ${camera.name} from favorites` : `Add ${camera.name} to favorites`"
        @click="onFavoriteClick"
      >
        <Star
          :size="15"
          :stroke-width="isFavorite(camera.id) ? 2.5 : 2"
          :fill="isFavorite(camera.id) ? 'currentColor' : 'none'"
        />
      </button>

      <!-- Orange Interaction Line -->
      <div class="absolute bottom-0 left-0 h-[2px] bg-[#F28C28] w-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full z-20"></div>
    </div>

    <!-- Content Section -->
    <div class="flex flex-col flex-1 p-4 sm:p-[18px]">
      <h3 class="text-[16px] sm:text-[18px] font-semibold font-['Manrope'] transition-colors duration-500 group-hover:text-[var(--primary)] line-clamp-1 mb-[6px] flex items-center gap-2" style="color: var(--text);">
        <MapPin class="h-[14px] w-[14px] text-[var(--primary)] shrink-0" />
        {{ camera.name }}
      </h3>

      <div class="mt-auto">
        <div class="border-t w-full mb-[14px]" style="border-color: var(--border);"></div>
        <div class="flex items-center justify-between font-['Plus_Jakarta_Sans'] text-[11px] sm:text-[12px]">
          <span class="font-semibold uppercase tracking-wide" style="color: var(--primary);">CAM {{ String(camera.id).padStart(3, '0') }}</span>
          <span class="font-normal" style="color: var(--text-muted);">06°35′S 106°48′E</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.camera-card {
  transition: all 500ms cubic-bezier(0.16, 1, 0.3, 1);
}

.camera-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  border-color: rgba(20, 121, 166, 0.3); /* subtle primary border */
}

.dark .camera-card:hover {
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
  border-color: rgba(20, 121, 166, 0.5);
}

.camera-card:active {
  transform: translateY(-2px);
}

.btn-fav {
  transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-fav:hover {
  transform: scale(1.15);
  color: #F28C28;
}

.btn-fav:active {
  transform: scale(0.95);
}
</style>
