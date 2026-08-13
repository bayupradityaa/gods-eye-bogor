<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 60
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="scrolled ? 'bg-[#07090D]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20' : 'bg-transparent'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-18">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <span class="text-accent text-xs font-bold">BL</span>
          </div>
          <div class="hidden sm:block">
            <span class="text-sm font-medium text-white tracking-tight">Bogor Live</span>
            <span class="text-[10px] text-text-muted ml-2 tracking-wider uppercase">CCTV</span>
          </div>
        </div>

        <!-- Nav Links -->
        <nav class="hidden md:flex items-center gap-8">
          <a href="#explorer" class="text-xs tracking-wider text-text-secondary hover:text-white transition-colors uppercase">Cameras</a>
          <a href="#map" class="text-xs tracking-wider text-text-secondary hover:text-white transition-colors uppercase">Map</a>
          <a href="#pulse" class="text-xs tracking-wider text-text-secondary hover:text-white transition-colors uppercase">City Pulse</a>
        </nav>

        <!-- Right -->
        <div class="flex items-center gap-3">
          <button
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-xs text-text-secondary hover:text-white hover:border-white/20 transition-all cursor-pointer"
            @click="$emit('openSearch')"
          >
            <span class="text-sm leading-none">⌕</span>
            <span class="hidden sm:inline">Search</span>
            <kbd class="hidden sm:inline-flex text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-text-muted">
              ⌘K
            </kbd>
          </button>
          <div class="flex items-center gap-2 pl-3 border-l border-white/10">
            <span class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
            <span class="text-[11px] text-accent font-medium tracking-wider uppercase hidden sm:inline">Live</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
