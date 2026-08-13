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
import CityPulse from '@/components/hero/CityPulse.vue'
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
  <div class="min-h-screen">
    <Navbar @open-search="showCommandPalette = true" />
    <main>
      <HeroSection />
      <CityStats />
      <section id="explorer" class="relative z-10 px-4 sm:px-6 lg:px-8 pb-20">
        <div class="max-w-7xl mx-auto">
          <div class="mb-10">
            <p class="text-xs tracking-[0.2em] uppercase text-accent mb-3 font-medium">Explore Bogor</p>
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white">Jelajahi Kamera Publik</h2>
            <p class="mt-3 text-text-secondary max-w-xl text-sm sm:text-base">Temukan kamera publik di berbagai titik Kota Bogor.</p>
          </div>
          <CameraSearch :query="searchQuery" @update:query="setSearch" @open-palette="showCommandPalette = true" />
          <CameraFilters :active="activeCategory" @change="setCategory" />
          <CameraGrid :cameras="filteredCameras" @select="openCamera" />
        </div>
      </section>
      <CameraMap />
      <CityPulse />
      <CameraViewer :open="viewerOpen" :camera="selectedCamera" @close="closeViewer" />
      <CommandPalette :open="showCommandPalette" @close="showCommandPalette = false" @select="(cam) => { showCommandPalette = false; openCamera(cam) }" />
    </main>
    <Footer />
  </div>
</template>
