<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCameras } from '@/composables/useCameras'
import Navbar from '@/components/layout/Navbar.vue'
import HeroSection from '@/components/hero/HeroSection.vue'
import CameraFilters from '@/components/cameras/CameraFilters.vue'
import CameraSearch from '@/components/cameras/CameraSearch.vue'
import CameraGrid from '@/components/cameras/CameraGrid.vue'
import CameraViewer from '@/components/cameras/CameraViewer.vue'
import CommandPalette from '@/components/ui/CommandPalette.vue'
import CameraMap from '@/components/map/CameraMap.vue'
import CityStats from '@/components/hero/CityStats.vue'
import MyMonitoring from '@/components/monitoring/MyMonitoring.vue'
import Footer from '@/components/layout/Footer.vue'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const {
  filteredCameras, activeCategory, searchQuery,
  viewerOpen, selectedCamera, categoryCounts,
  totalResults, canLoadMore, loadMore,
  setCategory, setSearch, openCamera, closeViewer,
} = useCameras()

const showCommandPalette = ref(false)

function onKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    showCommandPalette.value = true
  }
  if (e.key === 'Escape') showCommandPalette.value = false
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!prefersReducedMotion) {
    // Add generic staggered entrance for main sections if needed
  }
})
onUnmounted(() => document.removeEventListener('keydown', onKeydown))

function handleClearSearch() {
  setSearch('')
  setCategory('all')
}
</script>

<template>
  <div class="min-h-screen" style="background: var(--bg);">
    <Navbar @open-search="showCommandPalette = true" />
    <main>
      <HeroSection @select="openCamera" />
      
      <div class="mb-8">
        <CityStats />
      </div>

      <!-- CCTV Explorer -->
      <section id="cameras" class="relative z-10 layout-container py-16 sm:py-24">
        <div class="mb-12">
          <p class="text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2 font-medium" style="color: var(--text-muted);">Live Cameras</p>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight" style="color: var(--text);">Jelajahi Kamera Publik</h2>
          <p class="mt-3 max-w-xl text-[15px] sm:text-base leading-relaxed" style="color: var(--text-secondary);">Pantau kondisi Kota Bogor secara langsung dari kamera publik yang tersedia.</p>
        </div>
        
        <CameraSearch :query="searchQuery" @update:query="setSearch" @open-palette="showCommandPalette = true" />
        <CameraFilters :active="activeCategory" :counts="categoryCounts" @change="setCategory" />
        
        <div class="mt-8">
          <CameraGrid 
            :cameras="filteredCameras" 
            :total="totalResults"
            :canLoadMore="canLoadMore"
            @select="(cam) => cam ? openCamera(cam) : handleClearSearch()" 
            @loadMore="loadMore"
          />
        </div>
      </section>

      <!-- Editorial Divider -->
      <div class="layout-container">
        <div class="flex w-full h-[1px] opacity-70">
          <div class="w-16 h-full" style="background: var(--accent);"></div>
          <div class="flex-1 h-full" style="background: var(--border);"></div>
        </div>
      </div>

      <!-- My Monitoring: favorites + recently viewed -->
      <div class="py-12 sm:py-20">
        <MyMonitoring @select="openCamera" />
      </div>

      <!-- Editorial Divider -->
      <div class="layout-container">
        <div class="flex w-full h-[1px] opacity-70">
          <div class="w-16 h-full" style="background: var(--accent);"></div>
          <div class="flex-1 h-full" style="background: var(--border);"></div>
        </div>
      </div>

      <!-- Interactive Map — Premium Map Experience -->
      <div class="pt-16 pb-24 sm:pt-24 sm:pb-32">
        <CameraMap />
      </div>

      <CameraViewer :open="viewerOpen" :camera="selectedCamera" @close="closeViewer" />
      <CommandPalette :open="showCommandPalette" @close="showCommandPalette = false" @select="(cam) => { showCommandPalette = false; openCamera(cam) }" />
    </main>
    <Footer />
  </div>
</template>
