<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const heroRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.from('.hero-bg', { opacity: 0, duration: 1 })
      .from('.hero-label', { opacity: 0, y: 12, duration: 0.6 }, '-=0.4')
      .from('.hero-title-line', { opacity: 0, y: 30, duration: 0.7, stagger: 0.12 }, '-=0.3')
      .from('.hero-desc', { opacity: 0, y: 20, duration: 0.5 }, '-=0.4')
      .from('.hero-cta', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
      .from('.hero-stat', { opacity: 0, y: 15, stagger: 0.1, duration: 0.4 }, '-=0.2')
      .from('.hero-visual', { opacity: 0, scale: 0.96, duration: 0.8 }, '-=0.6')
  }, heroRef)

  return () => ctx.revert()
})
</script>

<template>
  <section ref="heroRef" class="relative min-h-screen flex items-center overflow-hidden">
    <!-- Background -->
    <div class="hero-bg absolute inset-0 bg-gradient-to-b from-[#0C1017] via-[#07090D] to-[#07090D]">
      <!-- Grid pattern -->
      <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 60px 60px;"></div>
      <!-- Scanline subtle effect -->
      <div class="absolute inset-0 opacity-[0.015]" style="background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(74,222,128,0.08) 2px, rgba(74,222,128,0.08) 4px);"></div>
      <!-- Glow -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[100px]"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16 sm:pt-32 sm:pb-24">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <!-- Left: Text -->
        <div class="space-y-6 sm:space-y-8">
          <!-- Label -->
          <div class="hero-label flex items-center gap-3">
            <span class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
            <span class="text-[11px] tracking-[0.2em] uppercase text-accent/80 font-medium">Live Monitoring</span>
          </div>

          <!-- Title -->
          <div ref="titleRef" class="space-y-1">
            <h1 class="hero-title-line text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tight text-white leading-[0.95]">
              Bogor
            </h1>
            <h1 class="hero-title-line text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tight text-white leading-[0.95]">
              LIVE
            </h1>
          </div>

          <p class="hero-desc text-text-secondary text-base sm:text-lg max-w-md leading-relaxed">
            Pantau kondisi Kota Bogor secara langsung melalui jaringan kamera publik yang tersebar di seluruh titik kota.
          </p>

          <!-- CTA -->
          <div class="hero-cta flex flex-wrap gap-4">
            <a
              href="#explorer"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-black text-sm font-semibold hover:bg-accent/90 transition-all hover:shadow-lg hover:shadow-accent/20 cursor-pointer"
            >
              Explore Cameras
              <span class="text-base">→</span>
            </a>
            <a
              href="#map"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-text-secondary text-sm hover:text-white hover:border-white/20 transition-all cursor-pointer"
            >
              View Map
            </a>
          </div>

          <!-- Stats -->
          <div class="hero-stat flex gap-8 sm:gap-12 pt-4">
            <div>
              <p class="text-2xl sm:text-3xl font-medium text-white tracking-tight">85</p>
              <p class="text-[11px] tracking-wider uppercase text-text-muted mt-1">Cameras</p>
            </div>
            <div>
              <p class="text-2xl sm:text-3xl font-medium text-white tracking-tight">8</p>
              <p class="text-[11px] tracking-wider uppercase text-text-muted mt-1">Categories</p>
            </div>
            <div>
              <p class="text-2xl sm:text-3xl font-medium text-white tracking-tight">24/7</p>
              <p class="text-[11px] tracking-wider uppercase text-text-muted mt-1">Access</p>
            </div>
          </div>
        </div>

        <!-- Right: Visual -->
        <div class="hero-visual hidden lg:block">
          <div class="relative aspect-[4/3] rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#11161F] to-[#0C1017] overflow-hidden">
            <!-- Camera grid visualization -->
            <div class="absolute inset-0 p-8">
              <div class="grid grid-cols-4 gap-3 h-full">
                <div v-for="i in 8" :key="i" class="rounded-lg border border-white/[0.04] bg-white/[0.02] overflow-hidden relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-[8px] tracking-wider text-text-muted/40 uppercase">CAM</span>
                  </div>
                  <div class="absolute bottom-1.5 left-1.5 flex items-center gap-1">
                    <span class="w-1 h-1 rounded-full bg-accent/60 animate-pulse"></span>
                    <span class="text-[6px] text-accent/40 tracking-wider uppercase">Live</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Overlay text -->
            <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between px-3 py-2 rounded-lg bg-black/40 backdrop-blur-sm border border-white/[0.04]">
              <span class="text-[10px] text-text-muted tracking-wider">85 ACTIVE CAMERAS</span>
              <span class="text-[10px] text-accent/60 tracking-wider">● BOGOR • WEST JAVA</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted">
      <span class="text-[10px] tracking-widest uppercase animate-bounce">Scroll</span>
      <span class="text-sm">↓</span>
    </div>
  </section>
</template>
