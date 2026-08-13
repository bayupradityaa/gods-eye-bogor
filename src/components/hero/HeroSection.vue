<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { MapPin, Map, Droplets, Wind } from '@lucide/vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hls from 'hls.js'
import { CAMERAS } from '@/data/cameras'
import { useWeather } from '@/composables/useWeather'
import { getWeatherIconComponent, isNightTime } from '@/lib/weather'
import * as LucideIcons from '@lucide/vue'
import type { Camera } from '@/types/camera'

gsap.registerPlugin(ScrollTrigger)

const emit = defineEmits<{
  select: [camera: Camera]
}>()

// ─── Weather ───
const { weather, loading: weatherLoading, error: weatherError, fetchWeather } = useWeather()

function formatUpdatedAt(dateStr: string | undefined): string {
  if (!dateStr) return '';
  if (dateStr.includes(' ')) {
    const timePart = dateStr.split(' ')[1];
    if (timePart) {
      const [h, m] = timePart.split(':');
      return `${h}:${m} WIB`;
    }
  }
  try {
    const d = new Date(dateStr);
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    return `${h}:${m} WIB`;
  } catch {
    return '';
  }
}

// ─── Live Timestamp ───
const liveTime = ref('')
let timeInterval: ReturnType<typeof setInterval> | null = null

function updateTime() {
  const now = new Date()
  liveTime.value = now.toLocaleTimeString('id-ID', { 
    timeZone: 'Asia/Jakarta', 
    hour12: false 
  }) + ' WIB'
}

// ─── Featured Cameras ───
const FEATURED_IDS = [79, 80, 81, 82]
const featuredCameras = computed(() =>
  FEATURED_IDS
    .map(id => CAMERAS.find(c => c.id === id))
    .filter((c): c is Camera => c !== undefined)
)

const activeCameraIndex = ref(0)
const activeCamera = computed(() => featuredCameras.value[activeCameraIndex.value])
let rotationInterval: ReturnType<typeof setInterval> | null = null
const isHovering = ref(false)
const transitioning = ref(false)

function shortName(name: string) {
  // Simplifies names for the control strip
  if (name.includes('DJUANDA')) return 'DJUANDA'
  if (name.includes('ALUN ALUN')) return 'ALUN-ALUN'
  if (name.includes('CORAT CORET')) return 'CORAT-CORET'
  return name.length > 12 ? name.substring(0, 12) + '…' : name
}

function startRotation() {
  stopRotation()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return
  rotationInterval = setInterval(() => {
    if (!isHovering.value) {
      switchCamera((activeCameraIndex.value + 1) % featuredCameras.value.length)
    }
  }, 7000)
}

function stopRotation() {
  if (rotationInterval) {
    clearInterval(rotationInterval)
    rotationInterval = null
  }
}

function switchCamera(index: number) {
  if (index === activeCameraIndex.value || transitioning.value) return
  transitioning.value = true
  activeCameraIndex.value = index
  // Transition completes via CSS (600ms)
  setTimeout(() => { transitioning.value = false }, 700)
}

function selectCamera(index: number) {
  switchCamera(index)
  startRotation() // reset timer
}

function onCardHover() {
  isHovering.value = true
}
function onCardLeave() {
  isHovering.value = false
}

function onCardClick() {
  if (activeCamera.value) {
    emit('select', activeCamera.value)
  }
}

// ─── HLS Video Management ───
const heroRef = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
let hlsInstance: Hls | null = null

function initStream(streamUrl: string) {
  destroyStream()
  if (!videoRef.value) return

  if (Hls.isSupported()) {
    hlsInstance = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90,
    })
    hlsInstance.loadSource(streamUrl)
    hlsInstance.attachMedia(videoRef.value)
    hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
      videoRef.value?.play().catch(() => {})
    })
  } else if (videoRef.value.canPlayType('application/vnd.apple.mpegurl')) {
    videoRef.value.src = streamUrl
    videoRef.value.addEventListener('loadedmetadata', () => {
      videoRef.value?.play().catch(() => {})
    })
  }
}

function destroyStream() {
  if (hlsInstance) {
    hlsInstance.destroy()
    hlsInstance = null
  }
}

// Watch camera change → switch stream and fetch location weather
watch(activeCamera, (cam) => {
  if (cam) {
    initStream(cam.stream)
    fetchWeather(cam.weatherLocation?.adm4)
  }
}, { immediate: true })

// ─── Mouse Parallax ───
function handleMouseMove(e: MouseEvent) {
  if (window.matchMedia('(pointer: coarse)').matches || !heroRef.value) return
  const rect = heroRef.value.getBoundingClientRect()
  const mouseX = (e.clientX - rect.left) / rect.width - 0.5
  const mouseY = (e.clientY - rect.top) / rect.height - 0.5

  gsap.to('.hero-visual-card', {
    x: mouseX * 4,
    y: mouseY * 4,
    duration: 0.6,
    ease: 'power2.out',
    overwrite: 'auto',
  })
  gsap.to('.hero-title-group', {
    x: mouseX * 2,
    y: mouseY * 2,
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

// ─── Lifecycle ───
onMounted(() => {
  // Init timestamp
  updateTime()
  timeInterval = setInterval(updateTime, 1000)

  // Init first camera stream
  if (activeCamera.value) {
    initStream(activeCamera.value.stream)
  }

  // Start rotation
  startRotation()

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const ctx = gsap.context(() => {
    if (!prefersReducedMotion) {
      // Set initial hidden states
      gsap.set('.hero-meta-top', { opacity: 0, x: -12 })
      gsap.set('.hero-title-bogor', { opacity: 0, yPercent: 115 })
      gsap.set('.hero-title-live', { opacity: 0, yPercent: 115 })
      gsap.set('.hero-title-dot', { opacity: 0, scale: 0.6, y: 8 })
      gsap.set('.hero-desc-title', { opacity: 0, yPercent: 100 })
      gsap.set('.hero-desc-para', { opacity: 0, y: 12 })
      gsap.set('.hero-visual-card', { opacity: 0, clipPath: 'inset(0% 0% 100% 0%)', y: 20 })
      gsap.set('.hero-cta-primary', { opacity: 0, y: 15 })
      gsap.set('.hero-cta-secondary', { opacity: 0, y: 15 })
      gsap.set('.hero-video-overlay', { opacity: 0 })
      gsap.set('.hero-weather-meta', { opacity: 0, y: 10 })
      gsap.set('.hero-cam-selector', { opacity: 0 })

      const tl = gsap.timeline({ 
        delay: 0.05,
        defaults: { ease: 'cubic-bezier(0.16, 1, 0.3, 1)' } 
      })

      tl
        // 1. Location Eyebrow
        .to('.hero-meta-top', { opacity: 1, x: 0, duration: 0.45 })

        // 2. "BOGOR"
        .to('.hero-title-bogor', { yPercent: 0, opacity: 1, duration: 0.75 }, '-=0.2')

        // 3. "LIVE"
        .to('.hero-title-live', { yPercent: 0, opacity: 1, duration: 0.75 }, '-=0.63')

        // 4. Orange "."
        .to('.hero-title-dot', { scale: 1, opacity: 1, y: 0, duration: 0.40, ease: 'cubic-bezier(0.16, 1, 0.3, 1)' }, '-=0.2')

        // 5. Supporting headline
        .to('.hero-desc-title', { yPercent: 0, opacity: 1, duration: 0.50 }, '-=0.1')

        // 6. Body description
        .to('.hero-desc-para', { y: 0, opacity: 1, duration: 0.45 }, '-=0.3')

        // 7. Viewport Panel reveal
        .to('.hero-visual-card', { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, y: 0, duration: 0.9 }, '-=0.5')

        // 8. CTA buttons
        .to('.hero-cta-primary', { y: 0, opacity: 1, duration: 0.45 }, '-=0.5')
        .to('.hero-cta-secondary', { y: 0, opacity: 1, duration: 0.45 }, '-=0.37')

        // 9. CCTV Overlay (Live & Cam ID)
        .to('.hero-video-overlay', { opacity: 1, duration: 0.40 }, '-=0.4')

        // 10. Weather & Broadcast Strip
        .to('.hero-weather-meta', { y: 0, opacity: 1, duration: 0.40 }, '-=0.2')
        .to('.hero-cam-selector', { opacity: 1, duration: 0.40 }, '-=0.2')

      // Scroll Parallax
      gsap.to('.hero-meta-top', {
        y: -30, ease: 'none',
        scrollTrigger: { trigger: heroRef.value, start: 'top top', end: 'bottom top', scrub: true }
      })
      gsap.to('.hero-title-group', {
        y: -50, ease: 'none',
        scrollTrigger: { trigger: heroRef.value, start: 'top top', end: 'bottom top', scrub: true }
      })
      gsap.to('.hero-desc', {
        y: -40, ease: 'none',
        scrollTrigger: { trigger: heroRef.value, start: 'top top', end: 'bottom top', scrub: true }
      })
      gsap.to('.hero-visual-card', {
        y: -15, ease: 'none',
        scrollTrigger: { trigger: heroRef.value, start: 'top top', end: 'bottom top', scrub: true }
      })
      gsap.to(heroRef.value, {
        opacity: 0.85, ease: 'none',
        scrollTrigger: { trigger: heroRef.value, start: 'top top', end: 'bottom top', scrub: true }
      })
    } else {
      gsap.set('.hero-meta-top, .hero-title-bogor, .hero-title-live, .hero-title-dot, .hero-desc-title, .hero-desc-para, .hero-cta-primary, .hero-cta-secondary, .hero-visual-card, .hero-video-overlay, .hero-title-group, .hero-weather-meta, .hero-cam-selector', { clearProps: 'all' })
    }
  }, heroRef.value!)

  return () => ctx.revert()
})

onUnmounted(() => {
  destroyStream()
  stopRotation()
  if (timeInterval) clearInterval(timeInterval)
})
</script>

<template>
  <section 
    ref="heroRef" 
    class="relative overflow-hidden pt-24 pb-8 sm:pt-28 sm:pb-12 lg:pt-28 lg:pb-14"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <!-- Background -->
    <div class="hero-bg absolute inset-0 z-0 pointer-events-none bg-[var(--bg)]"></div>

    <div class="relative z-10 layout-container w-full h-full flex flex-col justify-center">
      <div class="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        
        <!-- Left: Text content -->
        <div class="lg:col-span-5 space-y-6 flex flex-col justify-center">
          
          <!-- Geographic Eyebrow (Editorial Style) -->
          <div>
            <div class="hero-meta-top inline-flex items-center gap-2 px-3 py-1 border-l-2 border-[var(--accent)] text-xs font-bold tracking-[0.15em] uppercase text-[var(--text-secondary)]">
              KOTA BOGOR · JAWA BARAT
            </div>
          </div>

          <!-- Title / Headline -->
          <div class="hero-title-group hero-title-line space-y-1">
            <div class="overflow-hidden leading-[0.90] py-0.5">
              <span class="hero-title-bogor inline-block text-5xl sm:text-6xl lg:text-7xl xl:text-[88px] font-[900] tracking-[-0.04em] text-[var(--text)] font-['Plus_Jakarta_Sans']">
                BOGOR
              </span>
            </div>
            <div class="overflow-hidden leading-[0.90] py-0.5">
              <span class="hero-title-live inline-block text-5xl sm:text-6xl lg:text-7xl xl:text-[88px] font-[900] tracking-[-0.04em] text-[var(--text)] font-['Plus_Jakarta_Sans']">
                LIVE<span class="hero-title-dot inline-block text-[var(--accent)]">.</span>
              </span>
            </div>
          </div>

          <!-- Supporting Copy (Editorial) -->
          <div class="hero-desc space-y-3 pt-2">
            <div class="overflow-hidden py-0.5">
              <p class="hero-desc-title inline-block text-xl sm:text-2xl font-semibold tracking-tight text-[var(--text)]">
                See Bogor as it happens.
              </p>
            </div>
            <p class="hero-desc-para text-base font-medium tracking-wide text-[var(--text-secondary)] uppercase text-xs">
              85 public cameras · live feeds · Bogor
            </p>
          </div>

          <!-- CTA Buttons (Software Tool Style) -->
          <div class="hero-cta-group pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
            <a 
              href="#cameras" 
              class="hero-cta-primary inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg text-white text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#106288] hover:-translate-y-0.5 group shadow-sm border border-transparent"
              style="background: #1479A6;"
            >
              Jelajahi Kamera
              <span class="text-lg leading-none transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--accent)]">→</span>
            </a>

            <a 
              href="#map" 
              class="hero-cta-secondary btn-secondary-peta relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[var(--accent)] hover:-translate-y-0.5 group z-0 shadow-sm"
            >
              <div class="absolute inset-0 bg-[var(--accent)] scale-x-0 origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 z-[-1]"></div>
              <Map :size="16" class="text-[var(--accent)] transition-all duration-300 group-hover:text-white" />
              <span class="transition-colors duration-300 group-hover:text-white">Lihat Peta</span>
            </a>
          </div>
        </div>

        <!-- Right: Viewport Instrument -->
        <div class="lg:col-span-6 lg:col-start-7 w-full min-w-0">
          <div 
            class="hero-visual-card group/card w-full flex flex-col bg-[#0F293E] border border-[var(--border-strong)] rounded-lg overflow-hidden shadow-lg transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 min-w-0"
            @mouseenter="onCardHover"
            @mouseleave="onCardLeave"
            @click="onCardClick"
          >
            <!-- 1. Video Feed Area -->
            <div class="relative w-full aspect-video bg-black cursor-pointer overflow-hidden flex-shrink-0">
              <video
                ref="videoRef"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                playsinline
                muted
                autoplay
                loop
                :alt="`CCTV Live ${activeCamera?.name || ''}`"
              ></video>

              <!-- Subtle Gradient for text legibility -->
              <div class="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none"></div>

              <!-- Top Text Overlay (No Pills) -->
              <div class="hero-video-overlay absolute inset-x-0 top-0 p-4 flex justify-between items-start z-10 pointer-events-none">
                <div class="flex items-center gap-2.5 text-white">
                  <span class="live-dot w-2 h-2 rounded-sm bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]"></span>
                  <span class="text-[10px] sm:text-xs font-bold tracking-widest uppercase font-mono drop-shadow-md">LIVE · {{ liveTime }}</span>
                </div>
                <div class="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-white/80 font-mono drop-shadow-md">
                  CAM {{ activeCamera ? String(activeCamera.id).padStart(3, '0') : '079' }}
                </div>
              </div>

            </div>

            <!-- 2. Control Panel Area -->
            <div class="flex flex-col border-t border-white/10 bg-[#0F293E] text-white">
              
              <!-- Location & Telemetry Data -->
              <div class="hero-weather-meta flex flex-col sm:flex-row justify-between items-start sm:items-end px-4 py-3 gap-2">
                <div>
                  <p class="text-[9px] font-bold text-[var(--accent)] mb-1 uppercase">Live Preview</p>
                  <h3 class="text-lg sm:text-xl font-bold tracking-tight uppercase leading-none transition-all duration-300">{{ activeCamera?.name || 'TUGU KUJANG' }}</h3>
                  <p class="text-[10px] font-medium text-white/50 mt-1 uppercase tracking-wider transition-all duration-300">
                    {{ activeCamera?.weatherLocation ? `${activeCamera.weatherLocation.village} · ${activeCamera.weatherLocation.district}` : 'Bogor Tengah · Kota Bogor' }}
                  </p>
                </div>
                
                <!-- Weather Telemetry (Terminal Style) -->
                <div class="flex flex-col items-start sm:items-end gap-1.5 shrink-0 transition-all duration-300">
                  <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-medium text-white/70 font-mono bg-white/5 px-2.5 py-1.5 border border-white/10 rounded-md min-h-[34px]">
                    <template v-if="weatherLoading">
                      <span class="text-white/40 italic">--° Memuat cuaca...</span>
                    </template>
                    <template v-else-if="weatherError && !weather">
                      <span class="text-[var(--danger,red)] italic uppercase">Cuaca Tidak Tersedia</span>
                    </template>
                    <template v-else-if="weather">
                      <span class="text-[var(--accent)] font-bold text-sm leading-none">{{ weather.temperature }}°</span>
                      <span class="uppercase">{{ weather.weatherDescription }}</span>
                      <span class="text-white/20 hidden sm:inline">/</span>
                      <span class="hidden sm:inline">HUM {{ weather.humidity }}%</span>
                      <span class="text-white/20 hidden sm:inline">/</span>
                      <span class="hidden sm:inline">WND {{ weather.windSpeed }}</span>
                    </template>
                    <template v-else>
                      <span class="text-white/40 italic uppercase">Lokasi tidak diketahui</span>
                    </template>
                  </div>
                  
                  <!-- Weather Metadata / Timestamp -->
                  <div 
                    v-if="weather || weatherError" 
                    class="text-[9px] text-white/40 font-mono tracking-wider uppercase cursor-help hover:text-white/70 transition-colors px-1"
                    title="Prakiraan cuaca dari BMKG. Data diperbarui secara berkala dan dapat berbeda dari kondisi aktual di kamera."
                  >
                    <span v-if="weatherError && weather">BMKG · Data terakhir tersedia</span>
                    <span v-else-if="weather">BMKG · {{ formatUpdatedAt(weather.updatedAt) || 'Data prakiraan' }}</span>
                  </div>
                </div>
              </div>

              <!-- Broadcast Control Strip -->
              <div class="hero-cam-selector flex items-stretch overflow-x-auto border-t border-white/10 hide-scrollbar bg-black/20">
                <button
                  v-for="(cam, index) in featuredCameras"
                  :key="cam.id"
                  class="relative flex items-center gap-2.5 px-4 py-2.5 border-r border-white/10 transition-colors duration-300 shrink-0 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest group/tab hover:bg-white/5"
                  :class="activeCameraIndex === index ? 'text-white bg-white/5' : 'text-white/40'"
                  @click.stop="selectCamera(index)"
                  :aria-label="`Lihat ${cam.name}`"
                >
                  <span class="opacity-40">0{{ index + 1 }}</span>
                  <span class="font-bold">{{ shortName(cam.name) }}</span>
                  <span 
                    class="w-1.5 h-1.5 rounded-full ml-1 transition-all duration-300"
                    :class="activeCameraIndex === index ? 'bg-[var(--accent)] opacity-100 scale-100 shadow-[0_0_6px_var(--accent)]' : 'bg-transparent opacity-0 scale-50'"
                  ></span>
                  
                  <!-- Active Bottom Indicator Line -->
                  <div class="absolute bottom-0 left-0 h-[2px] w-full transition-all duration-300"
                    :class="activeCameraIndex === index ? 'bg-[var(--accent)]' : 'bg-transparent group-hover/tab:bg-white/10'">
                  </div>
                </button>
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
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}

.live-dot {
  animation: livePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Hide scrollbar for the control strip */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@media (prefers-reduced-motion: reduce) {
  .live-dot {
    animation: none;
  }
}
</style>
