<script setup lang="ts">
import { computed } from 'vue'
import { X, PlayCircle } from '@lucide/vue'
import { useCameraMap } from '@/composables/useCameraMap'

const { selectedMapCamera, selectMapCamera, viewCameraInModal } = useCameraMap()

const snapshotUrl = computed(() => {
  if (!selectedMapCamera.value) return ''
  return selectedMapCamera.value.stream.replace('.m3u8', '.jpg')
})

const isOpen = computed(() => !!selectedMapCamera.value)

function close() {
  selectMapCamera(null)
}

function openViewer() {
  if (selectedMapCamera.value) {
    viewCameraInModal(selectedMapCamera.value)
  }
}
</script>

<template>
  <!-- Desktop Floating Panel -->
  <div 
    v-if="isOpen"
    class="hidden md:flex absolute bottom-6 right-6 w-[280px] rounded-2xl shadow-2xl border flex-col overflow-hidden z-[400] transition-all duration-300 bg-[var(--surface-elevated)] border-[var(--border)]"
  >
    <div class="relative w-full aspect-video bg-[#0C1017]">
      <img :src="snapshotUrl" class="w-full h-full object-cover" />
      <button @click="close" class="absolute top-2 right-2 w-7 h-7 bg-black/50 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
        <X class="w-4 h-4" />
      </button>
      <div class="absolute bottom-2 left-2 flex items-center gap-1.5 z-10 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md">
        <span class="w-1.5 h-1.5 rounded-full bg-[#F28C28] animate-pulse"></span>
        <span class="text-[9px] font-bold tracking-[0.08em] text-[#F28C28] uppercase">LIVE</span>
      </div>
    </div>
    <div class="p-4">
      <h4 class="font-bold text-sm line-clamp-1 mb-1 text-[var(--text)]">{{ selectedMapCamera?.name }}</h4>
      <p class="text-[10px] uppercase tracking-wider font-medium mb-4 text-[var(--text-muted)]">CAM {{ String(selectedMapCamera?.id).padStart(3, '0') }}</p>
      
      <button @click="openViewer" class="w-full bg-[#1687B8] hover:bg-[#126f96] text-white text-xs font-bold uppercase tracking-wide py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
        Lihat Kamera <span class="font-serif ml-1">→</span>
      </button>
    </div>
  </div>

  <!-- Mobile Bottom Sheet Overlay (Dim) -->
  <div 
    v-if="isOpen"
    class="md:hidden fixed inset-0 bg-black/20 z-[490] transition-opacity"
    @click="close"
  ></div>

  <!-- Mobile Bottom Sheet -->
  <div 
    class="md:hidden fixed inset-x-0 bottom-0 z-[500] transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
    :class="isOpen ? 'translate-y-0' : 'translate-y-full'"
  >
    <div class="rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t flex flex-col overflow-hidden pb-safe bg-[var(--surface-elevated)] border-[var(--border)]">
      <div class="w-full flex justify-center pt-4 pb-3" @click="close">
        <div class="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      </div>
      
      <div class="px-5 pb-5">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h4 class="font-bold text-base line-clamp-1 text-[var(--text)]">{{ selectedMapCamera?.name }}</h4>
            <div class="flex items-center gap-2 mt-1.5">
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-[#F28C28] animate-pulse"></span>
                <span class="text-[10px] font-bold tracking-[0.08em] text-[#F28C28] uppercase">LIVE</span>
              </div>
              <span class="text-gray-400 text-[10px]">•</span>
              <span class="text-[10px] uppercase tracking-wider text-gray-500 font-medium">CAM {{ String(selectedMapCamera?.id).padStart(3, '0') }}</span>
            </div>
          </div>
        </div>

        <button @click="openViewer" class="w-full bg-[#1687B8] hover:bg-[#126f96] text-white text-sm font-bold uppercase tracking-wide py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
          Lihat Kamera <span class="font-serif ml-1">→</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pb-safe {
  padding-bottom: max(16px, env(safe-area-inset-bottom, 16px));
}
</style>
