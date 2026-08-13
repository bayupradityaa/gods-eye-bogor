<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'

onMounted(() => {
  gsap.from('.stats-section .stat-item', {
    scrollTrigger: { trigger: '.stats-section', start: 'top 85%' },
    opacity: 0,
    y: 30,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power3.out',
  })
})
</script>

<template>
  <section class="stats-section relative z-10 px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
        <div class="stat-item">
          <p class="text-5xl sm:text-6xl lg:text-7xl font-medium text-white tracking-tight">85</p>
          <div class="mt-2">
            <p class="text-xs tracking-[0.15em] uppercase text-text-muted">Cameras Active</p>
            <div class="mt-2 h-px w-12 bg-accent/30"></div>
          </div>
        </div>
        <div class="stat-item">
          <p class="text-5xl sm:text-6xl lg:text-7xl font-medium text-white tracking-tight">8</p>
          <div class="mt-2">
            <p class="text-xs tracking-[0.15em] uppercase text-text-muted">Categories</p>
            <div class="mt-2 h-px w-12 bg-accent-cyan/30"></div>
          </div>
        </div>
        <div class="stat-item">
          <p class="text-5xl sm:text-6xl lg:text-7xl font-medium text-white tracking-tight">24/7</p>
          <div class="mt-2">
            <p class="text-xs tracking-[0.15em] uppercase text-text-muted">Live Feed</p>
            <div class="mt-2 h-px w-12 bg-accent/30"></div>
          </div>
        </div>
        <div class="stat-item">
          <p class="text-5xl sm:text-6xl lg:text-7xl font-medium text-white tracking-tight">6</p>
          <div class="mt-2">
            <p class="text-xs tracking-[0.15em] uppercase text-text-muted">Stream Servers</p>
            <div class="mt-2 h-px w-12 bg-accent-cyan/30"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
