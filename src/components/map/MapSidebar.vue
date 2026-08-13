<script setup lang="ts">
import { computed } from 'vue'
import { Search, MapPin } from '@lucide/vue'
import { useCameraMap } from '@/composables/useCameraMap'
import { useCameras } from '@/composables/useCameras'
import type { Camera, FilterCategory } from '@/types/camera'

const { mapCameras, selectedMapCamera, selectMapCamera } = useCameraMap()
const { activeCategory, searchQuery, setCategory, setSearch, categoryCounts } = useCameras()

const categories: FilterCategory[] = ['all', 'Jalan', 'Simpang', 'Taman', 'Pasar', 'Lapangan', 'Gerbang', 'Kantor', 'Lainnya']

// Only show cameras that have valid map coordinates in the sidebar
const visibleCameras = computed(() => {
  return mapCameras.value.filter((cam: Camera) => {
    if (activeCategory.value !== 'all' && cam.category !== activeCategory.value) return false
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      return cam.name.toLowerCase().includes(q) || String(cam.id).includes(q)
    }
    return true
  })
})

function handleSelect(cam: Camera) {
  selectMapCamera(cam)
}
</script>

<template>
  <div class="map-sidebar flex flex-col h-full border-r z-10 w-full shrink-0" style="background: var(--surface); border-color: var(--border);">
    
    <!-- Header, Search & Filter -->
    <div class="p-5 flex flex-col gap-3.5 border-b border-gray-100 dark:border-white/5 shrink-0">
      <h3 class="text-[11px] font-bold tracking-widest uppercase text-[var(--text-muted)]">
        {{ visibleCameras.length }} Kamera Tersedia
      </h3>
      
      <!-- Search -->
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input 
          :value="searchQuery"
          @input="e => setSearch((e.target as HTMLInputElement).value)"
          type="text" 
          placeholder="Cari lokasi atau ID..."
          aria-label="Cari lokasi atau ID kamera"
          class="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none transition-colors"
          style="background: var(--bg-secondary); border: 1px solid var(--border); color: var(--text);"
        />
      </div>

      <!-- Filter Dropdown -->
      <div class="relative">
        <select
          :value="activeCategory"
          @change="e => setCategory((e.target as HTMLSelectElement).value as FilterCategory)"
          aria-label="Kategori Kamera"
          class="w-full appearance-none rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none transition-colors cursor-pointer"
          style="background: var(--bg-secondary); border: 1px solid var(--border); color: var(--text);"
        >
          <option v-for="cat in categories" :key="cat" :value="cat" style="background: var(--surface); color: var(--text);">
            {{ cat === 'all' ? 'Semua Kategori' : cat }}
          </option>
        </select>
        <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
    </div>

    <!-- List -->
    <div class="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
      <div v-if="visibleCameras.length === 0" class="text-center py-10 px-4">
        <p class="text-sm font-semibold" style="color: var(--text);">Tidak ada kamera ditemukan.</p>
        <p class="text-xs mt-1" style="color: var(--text-muted);">Coba ubah kategori atau kata pencarian.</p>
        <button @click="setSearch(''); setCategory('all')" class="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--border)] transition-colors">
          Reset Filter
        </button>
      </div>

      <button
        v-for="cam in visibleCameras"
        :key="cam.id"
        class="w-full text-left p-3 rounded-xl transition-all duration-200 group flex items-start gap-3"
        :class="selectedMapCamera?.id === cam.id ? 'bg-[#F1F7FA] dark:bg-[#1687B8]/10 shadow-sm border border-[#1687B8]/20' : 'hover:bg-[var(--surface-elevated)] border border-transparent'"
        @click="handleSelect(cam)"
      >
        <img src="/cctv.svg" alt="CCTV Icon" class="mt-0.5 shrink-0 w-4 h-4 transition-all" :class="selectedMapCamera?.id === cam.id ? 'opacity-100 scale-110 drop-shadow-sm' : 'opacity-50 grayscale'" />
        <div class="min-w-0 flex-1">
          <p class="text-[13px] font-semibold text-[var(--text)] truncate group-hover:text-[#1687B8] transition-colors" :class="selectedMapCamera?.id === cam.id ? 'text-[#1687B8]!' : ''">
            {{ cam.name }}
          </p>
          <p class="text-[10px] tracking-wider uppercase text-[var(--text-muted)] mt-1 font-medium">
            CAM {{ String(cam.id).padStart(3, '0') }}
          </p>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 4px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
}
</style>
