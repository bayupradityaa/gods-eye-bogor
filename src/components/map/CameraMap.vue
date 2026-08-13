<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Compass } from '@lucide/vue'
import MapEngine from './MapEngine.vue'
import MapSidebar from './MapSidebar.vue'
import CameraPreview from './CameraPreview.vue'
import { useCameraMap } from '@/composables/useCameraMap'
import { useCameras } from '@/composables/useCameras'

const { resetMapBounds, mapCameras } = useCameraMap()
const { activeCategory, setCategory } = useCameras()

const categories = ['all', 'Jalan', 'Simpang', 'Taman', 'Pasar', 'Lapangan', 'Gerbang', 'Kantor', 'Lainnya']
</script>

<template>
  <section id="map" class="relative border-t bg-[var(--bg)] border-[var(--border)]">
    
    <!-- Header / Mini Hero -->
    <div class="layout-container pt-12 pb-6 sm:pt-16 sm:pb-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p class="text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2 font-medium text-[var(--primary)]">Explore Bogor</p>
          <h2 class="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--text)]">
            Peta Kamera
          </h2>
          <p class="mt-2 max-w-lg text-[14px] sm:text-[15px] leading-relaxed text-[var(--text-secondary)]">
            Jelajahi Kota Bogor melalui jendela digital. Menampilkan {{ mapCameras.length }} kamera publik secara real-time.
          </p>
        </div>
        
      </div>
    </div>

    <!-- Mobile Horizontal Filter -->
    <div class="md:hidden w-full overflow-x-auto pb-4 px-4 sm:px-6 custom-scrollbar flex gap-2">
      <button
        v-for="cat in categories"
        :key="cat"
        class="shrink-0 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all"
        :class="activeCategory === cat ? 'bg-[#1687B8] text-white' : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] border border-[var(--border)] shadow-sm'"
        @click="setCategory(cat as any)"
      >
        {{ cat === 'all' ? 'Semua' : cat }}
      </button>
    </div>

    <!-- Map Layout Container -->
    <div class="layout-container pb-12 sm:pb-24">
      <div class="relative z-10 w-full h-[75vh] min-h-[500px] max-h-[800px] rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col md:flex-row border shadow-xl bg-[var(--surface)] border-[var(--border)]">
        
        <!-- Desktop Sidebar -->
        <div class="hidden md:block w-[300px] lg:w-[320px] shrink-0 h-full">
          <MapSidebar />
        </div>

        <!-- Map Area -->
        <div class="relative flex-1 h-full w-full bg-[var(--bg-secondary)]">
          <MapEngine :cameras="mapCameras" />

          <!-- Custom Map Controls (Top Right) -->
          <div class="absolute top-4 right-4 z-[400] flex flex-col gap-2">
            <button @click="resetMapBounds" class="w-10 h-10 border rounded-xl shadow-md flex items-center justify-center transition-colors bg-[var(--surface-elevated)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)]" aria-label="Reset Map">
              <Compass class="w-5 h-5" />
            </button>
          </div>

          <!-- Camera Previews -->
          <CameraPreview />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
