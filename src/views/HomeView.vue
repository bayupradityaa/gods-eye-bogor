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

const {
  filteredCameras, activeCategory, searchQuery,
  viewerOpen, selectedCamera,
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

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="min-h-screen" style="background: var(--bg);">
    <Navbar @open-search="showCommandPalette = true" />
    <main>
      <HeroSection />
      <CityStats />

      <!-- My Monitoring: favorites + recently viewed -->
      <MyMonitoring @select="openCamera" />

      <!-- CCTV Explorer -->
      <section id="explorer" class="relative z-10 layout-container py-16 sm:py-24">
        <div class="mb-12">
          <p class="text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2 font-medium" style="color: var(--text-muted);">Camera Explorer</p>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight" style="color: var(--text);">Jelajahi Kamera Publik</h2>
          <p class="mt-3 max-w-xl text-[15px] sm:text-base leading-relaxed" style="color: var(--text-secondary);">Temukan dan pantau kamera publik di berbagai titik Kota Bogor.</p>
        </div>
        
        <CameraSearch :query="searchQuery" @update:query="setSearch" @open-palette="showCommandPalette = true" />
        <CameraFilters :active="activeCategory" @change="setCategory" />
        
        <div class="mt-8">
          <CameraGrid :cameras="filteredCameras" @select="openCamera" />
        </div>
      </section>

      <!-- Interactive Map — synced with category filter -->
      <CameraMap :active-category="activeCategory" @select="openCamera" />

      <CameraViewer :open="viewerOpen" :camera="selectedCamera" @close="closeViewer" />
      <CommandPalette :open="showCommandPalette" @close="showCommandPalette = false" @select="(cam) => { showCommandPalette = false; openCamera(cam) }" />
    </main>
    <Footer />
  </div>
</template>
