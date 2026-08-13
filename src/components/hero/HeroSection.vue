<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { MapPin } from '@lucide/vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hls from 'hls.js'

gsap.registerPlugin(ScrollTrigger)

const heroRef = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const hls = ref<Hls | null>(null)

function initStream() {
  const streamUrl = 'https://restreamer2.kotabogor.go.id/memfs/5a5cf878-9d9b-4400-a73a-27a5b24a6ec4.m3u8'
  if (!videoRef.value) return

  if (Hls.isSupported()) {
    const newHls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90,
    })
    
    newHls.loadSource(streamUrl)
    newHls.attachMedia(videoRef.value)
    
    newHls.on(Hls.Events.MANIFEST_PARSED, () => {
      videoRef.value?.play().catch(() => {})
    })

    hls.value = newHls
  } else if (videoRef.value.canPlayType('application/vnd.apple.mpegurl')) {
    videoRef.value.src = streamUrl
    videoRef.value.addEventListener('loadedmetadata', () => {
      videoRef.value?.play().catch(() => {})
    })
  }
}

function handleMouseMove(e: MouseEvent) {
  if (window.matchMedia('(pointer: coarse)').matches || !heroRef.value) return
  const rect = heroRef.value.getBoundingClientRect()
  const mouseX = (e.clientX - rect.left) / rect.width - 0.5
  const mouseY = (e.clientY - rect.top) / rect.height - 0.5

  gsap.to('.hero-visual-card', {
    x: mouseX * 6,
    y: mouseY * 6,
    duration: 0.6,
    ease: 'power2.out',
    overwrite: 'auto',
  })
  gsap.to('.hero-title-group', {
    x: mouseX * 3,
    y: mouseY * 3,
    duration: 0.6,
    ease: 'power2.out',
    overwrite: 'auto',
  })
}

function handleMouseLeave() {
  if (window.matchMedia('(pointer: coarse)').matches) return
  gsap.to('.hero-visual-card, .hero-title-group', {
    x: 0,
    y: 0,
    duration: 0.8,
    ease: 'power2.out',
    overwrite: 'auto',
  })
}

onMounted(() => {
  initStream()
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const ctx = gsap.context(() => {
    if (!prefersReducedMotion) {
      // Set initial hidden states immediately to prevent FOUC
      gsap.set('.hero-meta-top', { opacity: 0, x: -12 })
      gsap.set('.hero-meta-dot', { scale: 0.5 })
      gsap.set('.hero-title-bogor', { opacity: 0, yPercent: 115 })
      gsap.set('.hero-title-live', { opacity: 0, yPercent: 115 })
      gsap.set('.hero-title-dot', { opacity: 0, scale: 0.6, y: 8 })
      gsap.set('.hero-desc-title', { opacity: 0, yPercent: 100 })
      gsap.set('.hero-desc-para', { opacity: 0, y: 12 })
      gsap.set('.hero-visual-wrapper', { opacity: 0, clipPath: 'inset(0% 0% 100% 0%)', scale: 1.04 })
      gsap.set('.hero-cta-primary', { opacity: 0, y: 15 })
      gsap.set('.hero-cta-secondary', { opacity: 0, y: 15 })
      gsap.set('.hero-meta-badge', { opacity: 0, y: 8 })

      const tl = gsap.timeline({ 
        delay: 0.05,
        defaults: { ease: 'cubic-bezier(0.16, 1, 0.3, 1)' } 
      })

      // Timeline Sequence according to Typographic Masked Reveal Specification
      tl
        // 1. Location Eyebrow reveal
        .to('.hero-meta-top', { opacity: 1, x: 0, duration: 0.45 })
        .to('.hero-meta-dot', { scale: 1, duration: 0.3 }, '-=0.2')

        // 2. "BOGOR" masked typography reveal from behind invisible mask
        .to('.hero-title-bogor', { yPercent: 0, opacity: 1, duration: 0.75 }, '-=0.1')

        // 3. "LIVE" masked typography reveal (120ms stagger after BOGOR)
        .to('.hero-title-live', { yPercent: 0, opacity: 1, duration: 0.75 }, '-=0.63')

        // 4. Orange period "." micro-animation (appears after LIVE finishes)
        .to('.hero-title-dot', { scale: 1, opacity: 1, y: 0, duration: 0.30, ease: 'back.out(1.7)' }, '-=0.2')

        // 5. Supporting headline reveal (~150ms after LIVE finishes)
        .to('.hero-desc-title', { yPercent: 0, opacity: 1, duration: 0.50 }, '-=0.1')

        // 6. Body description line reveal
        .to('.hero-desc-para', { y: 0, opacity: 1, duration: 0.45 }, '-=0.3')

        // 7. CCTV Window reveal (clip-path reveal like opening a window into Bogor)
        .to('.hero-visual-wrapper', { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, scale: 1.0, duration: 0.9 }, '-=0.5')

        // 8. Primary CTA button reveal
        .to('.hero-cta-primary', { y: 0, opacity: 1, duration: 0.45 }, '-=0.5')

        // 9. Secondary CTA button reveal (80ms after Primary CTA)
        .to('.hero-cta-secondary', { y: 0, opacity: 1, duration: 0.45 }, '-=0.37')

        // 10. CCTV Overlay Badges stagger reveal
        .to('.hero-meta-badge', { y: 0, opacity: 1, duration: 0.35, stagger: 0.06 }, '-=0.4')

      // Scroll Parallax (GSAP ScrollTrigger)
      gsap.to('.hero-meta-top', {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      })
      gsap.to('.hero-title-group', {
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      })
      gsap.to('.hero-desc', {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      })
      gsap.to('.hero-visual-card', {
        y: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      })
      gsap.to(heroRef.value, {
        opacity: 0.85,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      })
    } else {
      gsap.set('.hero-meta-top, .hero-title-bogor, .hero-title-live, .hero-title-dot, .hero-desc-title, .hero-desc-para, .hero-cta-primary, .hero-cta-secondary, .hero-visual-wrapper, .hero-meta-badge, .hero-visual-card, .hero-title-group', { clearProps: 'all' })
    }
  }, heroRef.value!)

  return () => ctx.revert()
})

onUnmounted(() => {
  if (hls.value) {
    hls.value.destroy()
  }
})
</script>

<template>
  <section 
    ref="heroRef" 
    class="relative overflow-hidden pt-24 pb-8 sm:pt-28 sm:pb-12 lg:pt-28 lg:pb-14"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- Background Grid System -->
    <div class="hero-bg absolute inset-0 z-0 pointer-events-none" style="background: var(--bg);">
      <div 
        class="hero-bg-grid absolute inset-0 opacity-[0.4] dark:opacity-[0.25]" 
        :style="{ 
          backgroundImage: `linear-gradient(#DCE6EC 1px, transparent 1px), linear-gradient(90deg, #DCE6EC 1px, transparent 1px)`, 
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 40%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 40%, #000 40%, transparent 100%)'
        }"
      ></div>
    </div>

    <div class="relative z-10 layout-container w-full h-full flex flex-col justify-center">
      <div class="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        <!-- Left: Text content -->
        <div class="lg:col-span-6 space-y-6 sm:space-y-7 flex flex-col justify-center">
          
          <!-- Geographic Micro-metadata Eyebrow -->
          <div>
            <div class="hero-meta-top inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-[0.14em] uppercase border bg-[var(--surface-muted)] text-[var(--text-secondary)] border-[var(--border)]">
              <span class="hero-meta-dot w-1.5 h-1.5 rounded-full inline-block bg-[#1479A6]"></span>
              KOTA BOGOR · JAWA BARAT
            </div>
          </div>

          <!-- Title / Headline (Masked Typography Reveal) -->
          <div class="hero-title-group hero-title-line space-y-1">
            <div class="overflow-hidden leading-[0.90] py-0.5">
              <span class="hero-title-bogor inline-block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-[900] tracking-[-0.04em] text-[var(--text)] font-['Plus_Jakarta_Sans']">
                BOGOR
              </span>
            </div>
            <div class="overflow-hidden leading-[0.90] py-0.5">
              <span class="hero-title-live inline-block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-[900] tracking-[-0.04em] text-[var(--text)] font-['Plus_Jakarta_Sans']">
                LIVE<span class="hero-title-dot inline-block text-[#F28C28]">.</span>
              </span>
            </div>
          </div>

          <!-- Supporting Copy (Masked Reveal) -->
          <div class="hero-desc space-y-2">
            <div class="overflow-hidden py-0.5">
              <p class="hero-desc-title inline-block text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text)]">
                A live window into Bogor.
              </p>
            </div>
            <p class="hero-desc-para text-base sm:text-lg max-w-[460px] leading-relaxed font-medium text-[var(--text-secondary)]">
              Pantau kamera publik Kota Bogor secara langsung dari satu tempat.
            </p>
          </div>

          <!-- CTA Buttons -->
          <div class="hero-cta-group pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <!-- Primary CTA -->
            <a 
              href="#explorer" 
              class="hero-cta-primary inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-white text-sm sm:text-base font-semibold transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#106288] hover:shadow-lg hover:-translate-y-1 group"
              style="background: #1479A6;"
            >
              Jelajahi Kamera
              <span class="text-lg leading-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1.5 group-hover:text-[#F28C28]">→</span>
            </a>

            <!-- Secondary CTA -->
            <a 
              href="#map" 
              class="hero-cta-secondary btn-secondary-peta inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#F28C28] hover:border-[#F28C28] hover:text-white hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] group"
            >
              <MapPin :size="18" class="text-[#F28C28] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-white group-hover:scale-110" />
              <span class="transition-colors duration-500">Lihat Peta</span>
            </a>
          </div>
        </div>

        <!-- Right: Editorial Featured Camera Player -->
        <div class="lg:col-span-6 w-full">
          <div class="hero-visual-card group/card relative w-full aspect-[16/10] max-h-[460px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-2xl">
            <div class="hero-visual-wrapper relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border shadow-xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-[var(--surface)] border-[var(--border)]">
              
              <video
                ref="videoRef"
                class="w-full h-full object-cover brightness-[0.98] contrast-[1.02] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.025]"
                playsinline
                muted
                autoplay
                loop
              ></video>
              
              <!-- Transparent Black Gradient Overlay for readability -->
              <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none"></div>

              <!-- Top Camera Overlay Badges -->
              <div class="hero-visual-meta absolute inset-x-0 top-0 p-4 sm:p-5 flex justify-between items-start z-10">
                <div class="hero-meta-badge flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <span class="live-dot w-2 h-2 rounded-full inline-block bg-[#16A34A]"></span>
                  <span class="text-[10px] sm:text-[11px] tracking-widest font-bold text-white uppercase">LIVE</span>
                </div>
                <div class="hero-meta-badge bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <span class="text-[10px] sm:text-[11px] tracking-widest font-mono font-bold uppercase tabular-nums text-[#1479A6]">CAM 079</span>
                </div>
              </div>

              <!-- Bottom Location Overlay -->
              <div class="hero-visual-meta absolute inset-x-0 bottom-0 p-4 sm:p-5 z-10 flex flex-col justify-end">
                <p class="hero-meta-badge text-[11px] tracking-wider font-semibold uppercase mb-0.5 text-[#F28C28]">STREAMING UTAMA</p>
                <h3 class="hero-meta-badge text-lg sm:text-2xl font-bold tracking-tight text-white leading-tight">TUGU KUJANG</h3>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes livePulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.75; }
  100% { transform: scale(1); opacity: 1; }
}

.live-dot {
  animation: livePulse 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .live-dot {
    animation: none;
  }
}
</style>
