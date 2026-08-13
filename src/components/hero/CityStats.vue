<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  gsap.from('.stats-section .stat-item', {
    scrollTrigger: { trigger: '.stats-section', start: 'top 90%' },
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power3.out',
  })
})
</script>

<template>
  <section class="stats-section relative z-10 layout-container py-10 sm:py-16">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
      <!-- Stat 1 -->
      <div class="stat-item flex flex-col group cursor-default">
        <p class="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tighter tabular-nums mb-3 transition-colors group-hover:text-motion" style="color: var(--primary);">85</p>
        <div class="h-px w-full max-w-[40px] mb-3 transition-colors group-hover:bg-motion" style="background: var(--border-strong);"></div>
        <p class="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium transition-colors" style="color: var(--text-secondary);">Kamera Publik</p>
      </div>
      
      <!-- Stat 2 -->
      <div class="stat-item flex flex-col group cursor-default">
        <p class="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tighter tabular-nums mb-3 transition-colors group-hover:text-motion" style="color: var(--primary);">08</p>
        <div class="h-px w-full max-w-[40px] mb-3 transition-colors group-hover:bg-motion" style="background: var(--border-strong);"></div>
        <p class="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium transition-colors" style="color: var(--text-secondary);">Titik Lokasi</p>
      </div>

      <!-- Stat 3 -->
      <div class="stat-item flex flex-col group cursor-default">
        <p class="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tighter tabular-nums mb-3 transition-colors" style="color: var(--accent);">24/7</p>
        <div class="h-px w-full max-w-[40px] mb-3 transition-colors" style="background: var(--border-strong);"></div>
        <p class="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium transition-colors" style="color: var(--text-secondary);">Akses Langsung</p>
      </div>

      <!-- Stat 4 -->
      <div class="stat-item flex flex-col group cursor-default">
        <p class="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tighter tabular-nums mb-3 transition-colors group-hover:text-motion" style="color: var(--primary);">06</p>
        <div class="h-px w-full max-w-[40px] mb-3 transition-colors group-hover:bg-motion" style="background: var(--border-strong);"></div>
        <p class="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium transition-colors" style="color: var(--text-secondary);">Kategori</p>
      </div>
    </div>
  </section>
</template>
