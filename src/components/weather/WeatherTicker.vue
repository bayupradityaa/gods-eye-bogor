<script setup lang="ts">
import { ref } from 'vue'

const isPaused = ref(false)
</script>

<template>
  <div 
    class="w-full border-y overflow-hidden relative flex items-center h-8 sm:h-9"
    style="background-color: #0F293E; border-color: rgba(255,255,255,0.05); color: white;"
    @mouseenter="isPaused = true"
    @mouseleave="isPaused = false"
  >
    <!-- Muted background gradient at edges to make marquee look like it fades in/out -->
    <div class="absolute inset-y-0 left-0 w-8 sm:w-16 z-10 pointer-events-none" style="background: linear-gradient(to right, #0F293E, transparent);"></div>
    <div class="absolute inset-y-0 right-0 w-8 sm:w-16 z-10 pointer-events-none" style="background: linear-gradient(to left, #0F293E, transparent);"></div>
    
    <div 
      class="marquee-container flex whitespace-nowrap items-center text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-medium font-mono"
      :class="{ 'paused': isPaused }"
    >
      <div v-for="i in 4" :key="i" class="flex items-center px-4 sm:px-8">
        <span class="w-1.5 h-1.5 rounded-full mr-3 shrink-0" style="background-color: var(--accent); box-shadow: 0 0 4px var(--accent);"></span>
        <span class="font-bold opacity-90 mr-2">INFO CUACA:</span>
        <span class="opacity-60 font-sans tracking-wide">DATA CUACA BERSUMBER DARI BMKG DAN DIPERBARUI SECARA BERKALA. KONDISI AKTUAL DI LOKASI KAMERA DAPAT BERBEDA DARI PRAKIRAAN.</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee-container {
  display: flex;
  width: max-content;
  animation: marquee 40s linear infinite;
}
.marquee-container.paused {
  animation-play-state: paused;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); } 
}

@media (prefers-reduced-motion: reduce) {
  .marquee-container {
    animation: none;
    transform: none;
    width: 100%;
    justify-content: center;
  }
  /* Hide the extra duplicates if reduced motion is preferred */
  .marquee-container > div:not(:first-child) {
    display: none;
  }
}
</style>
