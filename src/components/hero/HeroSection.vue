<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const heroRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const ctx = gsap.context(() => {
    // Entrance Animation
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    if (!prefersReducedMotion) {
      tl.from('.hero-bg-glow', { opacity: 0, duration: 1.5 })
        .from('.hero-meta-top', { opacity: 0, y: 10, duration: 0.8 }, '-=1.0')
        .from('.hero-title-line', { opacity: 0, y: 40, duration: 0.8, stagger: 0.15 }, '-=0.6')
        .from('.hero-desc', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
        .from('.hero-cta-group', { opacity: 0, y: 20, duration: 0.6 }, '-=0.5')
        .from('.hero-visual-wrapper', { opacity: 0, scale: 0.97, duration: 1 }, '-=0.8')
        .from('.hero-visual-meta', { opacity: 0, duration: 0.6 }, '-=0.4')
        
      // Scroll Parallax
      gsap.to('.hero-visual-wrapper', {
        y: 40,
        scale: 1.02,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      })
      gsap.to('.hero-bg-grid', {
        y: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      })
    } else {
      gsap.set('.hero-bg-glow, .hero-meta-top, .hero-title-line, .hero-desc, .hero-cta-group, .hero-visual-wrapper, .hero-visual-meta', { clearProps: 'all' })
    }
  }, heroRef)

  return () => ctx.revert()
})
</script>

<template>
  <section ref="heroRef" class="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16 sm:pb-24">
    <!-- Background System -->
    <div class="hero-bg absolute inset-0 z-0 bg-transparent pointer-events-none">
      <!-- Extremely subtle geographic grid -->
      <div class="hero-bg-grid absolute inset-0 opacity-[0.04]" :style="{ backgroundImage: `linear-gradient(var(--text) 1px, transparent 1px), linear-gradient(90deg, var(--text) 1px, transparent 1px)`, backgroundSize: '80px 80px' }"></div>
      
      <!-- Subtle radial green light -->
      <div class="hero-bg-glow absolute top-1/4 right-[10%] w-[800px] h-[800px] rounded-full blur-[120px] opacity-[0.04] pointer-events-none" style="background: var(--accent);"></div>
    </div>

    <div class="relative z-10 layout-container w-full h-full flex flex-col justify-center">
      <div class="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
        
        <!-- Left: Text content -->
        <div class="space-y-8 sm:space-y-10">
          
          <!-- Geographic Micro-metadata -->
          <div class="hero-meta-top flex items-center gap-4 text-[10px] sm:text-xs tracking-[0.25em] uppercase font-medium" style="color: var(--text-secondary);">
            <span>BOGOR</span>
            <span class="w-1 h-1 rounded-full bg-current opacity-40"></span>
            <span>06°35′S · 106°48′E</span>
          </div>

          <!-- Massive Title -->
          <div class="space-y-2">
            <h1 class="hero-title-line text-6xl sm:text-7xl lg:text-[96px] font-semibold tracking-tighter leading-[0.9]" style="color: var(--text);">
              BOGOR
            </h1>
            <h1 class="hero-title-line text-7xl sm:text-8xl lg:text-[128px] font-bold tracking-tighter leading-[0.9]" style="color: var(--text);">
              LIVE<span style="color: var(--accent);">.</span>
            </h1>
          </div>

          <!-- Description -->
          <p class="hero-desc text-base sm:text-lg lg:text-xl max-w-md leading-relaxed font-light" style="color: var(--text-secondary);">
            Pantau kondisi Kota Bogor secara langsung melalui jendela digital yang terintegrasi.
          </p>

          <!-- CTA -->
          <div class="hero-cta-group flex flex-wrap items-center gap-4 pt-2">
            <a href="#explorer" class="cta-primary inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold tracking-wide uppercase transition-all duration-300">
              Jelajahi Kamera
              <span class="text-lg leading-none">→</span>
            </a>
          </div>
        </div>

        <!-- Right: Editorial Featured Camera -->
        <div class="hero-visual-wrapper relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
          <!-- Frame border -->
          <div class="absolute inset-0 z-20 rounded-2xl border border-white/10 dark:border-white/5 pointer-events-none"></div>
          
          <!-- Image Placeholder (Cinematic) -->
          <div class="absolute inset-0 z-0 bg-[#0C1017]">
            <img 
              src="https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=2000&auto=format&fit=crop" 
              alt="Tugu Kujang Bogor" 
              class="w-full h-full object-cover opacity-60 mix-blend-luminosity"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <!-- Technical crosshairs -->
            <div class="absolute top-1/2 left-0 w-full h-[1px] bg-white/10"></div>
            <div class="absolute left-1/2 top-0 w-[1px] h-full bg-white/10"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/20 rounded-full"></div>
          </div>

          <!-- Camera Metadata Overlay -->
          <div class="hero-visual-meta absolute inset-x-0 top-0 p-5 sm:p-6 flex justify-between items-start z-10">
            <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-md backdrop-blur-md bg-black/40 border border-white/10">
              <span class="w-1.5 h-1.5 rounded-full animate-pulse" style="background: var(--accent);"></span>
              <span class="text-[9px] tracking-[0.2em] uppercase font-bold text-white">LIVE</span>
            </div>
            <div class="text-right">
              <p class="text-[10px] tracking-widest text-white/70 uppercase mb-0.5">Jawa Barat</p>
              <p class="text-[10px] tracking-widest text-white/50 tabular-nums">06°35′S 106°48′E</p>
            </div>
          </div>

          <!-- Bottom Metadata -->
          <div class="hero-visual-meta absolute inset-x-0 bottom-0 p-5 sm:p-6 z-10 flex flex-col justify-end">
            <p class="text-[10px] tracking-[0.25em] text-accent font-semibold uppercase mb-1">CAM 079</p>
            <h3 class="text-2xl sm:text-3xl font-medium tracking-tight text-white leading-none">TUGU KUJANG</h3>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-primary {
  background: var(--text);
  color: var(--bg);
}
.cta-primary:hover {
  background: var(--accent);
  color: #000;
  box-shadow: 0 8px 32px var(--accent-dim);
  transform: translateY(-2px);
}
</style>
