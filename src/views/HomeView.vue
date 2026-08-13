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
    gsap.utils.toArray('.motion-divider-container').forEach((divider: any) => {
      gsap.to(divider, {
        scrollTrigger: {
          trigger: divider,
          start: 'top 85%',
        },
        opacity: 1,
        duration: 0.2
      })
      
      const line = divider.querySelector('.motion-line')
      const arrow = divider.querySelector('.motion-arrow')
      
      if (line) {
        gsap.to(line, {
          scrollTrigger: {
            trigger: divider,
            start: 'top 85%',
          },
          maxWidth: '100%',
          duration: 1.5,
          ease: 'power3.out'
        })
      }
      
      if (arrow) {
        gsap.to(arrow, {
          scrollTrigger: {
            trigger: divider,
            start: 'top 85%',
          },
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.5
        })
      }
    })
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
      <HeroSection />
      <CityStats />

      <div class="layout-container motion-divider-container py-4">
        <div class="motion-line"></div>
        <span class="motion-arrow">→</span>
      </div>

      <!-- My Monitoring: favorites + recently viewed -->
      <MyMonitoring @select="openCamera" />

      <div class="layout-container motion-divider-container py-4">
        <div class="motion-line"></div>
        <span class="motion-arrow">→</span>
      </div>

      <!-- CCTV Explorer -->
      <section id="explorer" class="relative z-10 layout-container py-16 sm:py-24">
        <div class="mb-12">
          <p class="text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2 font-medium" style="color: var(--text-muted);">Camera Explorer</p>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight" style="color: var(--text);">Jelajahi Kamera Publik</h2>
          <p class="mt-3 max-w-xl text-[15px] sm:text-base leading-relaxed" style="color: var(--text-secondary);">Temukan dan pantau kamera publik di berbagai titik Kota Bogor.</p>
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

      <div class="layout-container motion-divider-container py-4">
        <div class="motion-line"></div>
        <span class="motion-arrow">→</span>
      </div>

      <!-- Interactive Map — Premium Map Experience -->
      <CameraMap />

      <CameraViewer :open="viewerOpen" :camera="selectedCamera" @close="closeViewer" />
      <CommandPalette :open="showCommandPalette" @close="showCommandPalette = false" @select="(cam) => { showCommandPalette = false; openCamera(cam) }" />
    </main>
    <Footer />
  </div>
</template>
