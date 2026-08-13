<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useWeather } from '@/composables/useWeather'
import { getWeatherIconComponent, formatWeatherTime, isNightTime } from '@/lib/weather'
import WeatherSkeleton from './WeatherSkeleton.vue'
import * as LucideIcons from '@lucide/vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { weather, loading, error, isUsingCache, fetchWeather } = useWeather()
const sectionRef = ref<HTMLElement | null>(null)

onMounted(() => {
  fetchWeather()
  
  // Setup entrance animation with GSAP stagger
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!prefersReducedMotion && sectionRef.value) {
    triggerAnimation()
  }
})

function triggerAnimation() {
  setTimeout(() => {
    if (sectionRef.value) {
      const elements = sectionRef.value.querySelectorAll('.bogor-now-anim')
      if (elements.length > 0) {
        gsap.fromTo(elements, 
          { opacity: 0, y: 16 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.7, 
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.value,
              start: 'top 85%'
            }
          }
        )
      }
    }
  }, 100)
}

function resolveIcon(name: string) {
  return (LucideIcons as any)[name] || LucideIcons.Sun
}

function formatUpdatedAt(dateStr: string) {
  try {
    const date = new Date(dateStr)
    const hours = date.getHours().toString().padStart(2, '0')
    const mins = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${mins} WIB`
  } catch (e) {
    return ''
  }
}

// Find closest forecast item index (it's already the first one or we can just highlight index 0)
const getForecastHighlightClass = (index: number) => {
  if (index === 0) {
    return 'border-[var(--primary)] bg-[var(--primary)]/5 dark:bg-[var(--primary)]/10 shadow-sm'
  }
  return 'border-transparent bg-transparent hover:bg-[var(--surface-muted)]'
}

</script>

<template>
  <section ref="sectionRef" class="relative z-10 layout-container py-12 sm:py-20">
    <div class="max-w-7xl mx-auto">
      
      <!-- Section Intro -->
      <div class="mb-10 bogor-now-anim">
        <p class="text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-3 font-semibold" style="color: var(--primary);">Bogor Now</p>
        <h2 class="text-3xl sm:text-4xl lg:text-4xl font-semibold tracking-tight" style="color: var(--text);">
          Kondisi Kota Bogor Saat Ini
        </h2>
        <p class="mt-3 text-[14px] sm:text-[15px] leading-relaxed max-w-lg" style="color: var(--text-secondary);">
          Lengkapi pantauan visual dengan kondisi cuaca terkini.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !weather" class="w-full bogor-now-anim">
        <WeatherSkeleton />
      </div>

      <!-- Error State -->
      <div v-else-if="error && !weather" class="w-full max-w-lg rounded-2xl p-8 bg-[var(--surface-muted)] border border-[var(--border)] text-center bogor-now-anim">
        <LucideIcons.CloudOff :size="32" class="mx-auto mb-4 text-[var(--text-muted)]" />
        <p class="text-[15px] font-medium text-[var(--text)] mb-3">{{ error }}</p>
        <button 
          @click="() => fetchWeather()" 
          class="inline-flex items-center gap-2 px-5 py-2.5 mt-2 rounded-lg text-sm font-semibold transition-colors"
          style="background: var(--surface-elevated); color: var(--text); border: 1px solid var(--border);"
        >
          <LucideIcons.RefreshCw :size="14" /> Coba Lagi
        </button>
      </div>

      <!-- Weather Data -->
      <div v-else-if="weather" class="bogor-now-anim w-full max-w-2xl rounded-3xl p-6 sm:p-10 bg-[var(--surface)] border shadow-sm transition-all duration-300 hover:shadow-md hover:border-[var(--primary)] group relative" style="border-color: var(--border);">
        
        <div class="flex flex-col sm:flex-row gap-8 sm:gap-10">
          
          <!-- Primary Info: Temperature & Condition -->
          <div class="flex items-center gap-6 sm:w-1/2">
            <div class="w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center text-[var(--primary)] group-hover:-translate-y-1 transition-transform duration-300">
              <component 
                :is="resolveIcon(getWeatherIconComponent(weather.weatherCode, isNightTime(weather.updatedAt)))" 
                :size="72" 
                :stroke-width="1.25" 
                class="w-full h-full weather-icon-float"
                aria-hidden="true"
              />
            </div>
            <div>
              <div class="flex items-start leading-none mb-1">
                <span class="text-6xl sm:text-7xl font-bold tracking-tighter" style="color: var(--accent);">{{ weather.temperature }}</span>
                <span class="text-3xl sm:text-4xl font-medium mt-1 sm:mt-1.5" style="color: var(--text-secondary);">°</span>
              </div>
              <h3 class="text-xl sm:text-2xl font-semibold" style="color: var(--text);">{{ weather.weatherDescription }}</h3>
            </div>
          </div>

          <!-- Divider (Mobile only) -->
          <div class="h-[1px] w-full sm:hidden opacity-50" style="background: var(--border);"></div>
          <!-- Divider (Desktop only) -->
          <div class="hidden sm:block w-[1px] opacity-50" style="background: var(--border);"></div>

          <!-- Secondary & Tertiary Info: Location & Stats -->
          <div class="flex flex-col justify-center sm:w-1/2 pt-1 sm:pt-0">
            <div class="mb-5">
              <p class="text-base sm:text-lg font-semibold tracking-tight leading-tight mb-0.5" style="color: var(--text);">
                {{ weather.location }}
              </p>
              <p class="text-[13px] sm:text-[14px] font-medium" style="color: var(--text-secondary);">
                {{ weather.city }}
              </p>
              <p class="text-[10px] sm:text-[11px] font-medium mt-2" style="color: var(--text-muted);">
                {{ weather.sourceArea }}
              </p>
            </div>
            
            <div class="grid grid-cols-2 gap-y-3 gap-x-4">
              <div>
                <p class="text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold mb-1" style="color: var(--text-muted);">Kelembapan</p>
                <p class="text-[13px] sm:text-sm font-semibold" style="color: var(--text);">{{ weather.humidity }}%</p>
              </div>
              <div>
                <p class="text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold mb-1" style="color: var(--text-muted);">Angin</p>
                <p class="text-[13px] sm:text-sm font-semibold" style="color: var(--text);">{{ weather.windSpeed }} km/h</p>
              </div>
            </div>
          </div>

        </div>

        <div class="h-[1px] w-full my-8 opacity-50" style="background: var(--border);"></div>

        <!-- Forecast Timeline -->
        <div class="bogor-now-anim">
          <h4 class="text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold mb-4" style="color: var(--text-muted);">Prakiraan Berikutnya</h4>
          
          <div class="forecast-scroll flex gap-2 overflow-x-auto pb-4 -mx-6 px-6 sm:-mx-10 sm:px-10 custom-scrollbar">
            <div 
              v-for="(item, index) in weather.forecast" 
              :key="index"
              class="shrink-0 flex flex-col items-center min-w-[76px] sm:min-w-[84px] p-3 rounded-2xl border border-transparent transition-all duration-200 bogor-now-anim"
              :class="getForecastHighlightClass(index)"
            >
              <span class="text-xs font-semibold mb-3" style="color: var(--text-secondary);">{{ formatWeatherTime(item.localDatetime) }}</span>
              <component 
                :is="resolveIcon(getWeatherIconComponent(item.weatherCode, isNightTime(item.localDatetime)))" 
                :size="24" 
                :stroke-width="1.5"
                class="mb-3 text-[var(--primary)] weather-icon-pulse transition-transform duration-300"
                aria-label="Ikon cuaca"
              />
              <span class="text-base sm:text-lg font-bold mb-1" style="color: var(--text);">{{ item.temperature }}°</span>
              <span class="text-[10px] sm:text-[11px] font-medium text-center leading-tight line-clamp-1 w-full" style="color: var(--text-muted);">
                {{ item.weatherDescription }}
              </span>
            </div>
          </div>
        </div>

        <!-- Footer / Attribution & Update Time -->
        <div class="mt-4 pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3" style="border-color: var(--border);">
          <p class="text-[10px] sm:text-[11px] font-medium flex items-center gap-2" style="color: var(--text-muted);">
            Data cuaca: BMKG
            <span class="hidden sm:inline opacity-30">•</span>
            <span class="hidden sm:inline">Diperbarui {{ formatUpdatedAt(weather.updatedAt) }}</span>
          </p>
          <!-- Mobile Update Time -->
          <p class="text-[10px] font-medium sm:hidden" style="color: var(--text-muted);">
            Diperbarui {{ formatUpdatedAt(weather.updatedAt) }}
          </p>
        </div>

      </div>

    </div>
  </section>
</template>

<style scoped>
.custom-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}

@keyframes weatherFloat {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0px); }
}

@keyframes weatherPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.12); }
  100% { transform: scale(1); }
}

.weather-icon-float {
  animation: weatherFloat 4s ease-in-out infinite;
  transform-origin: center;
}

.forecast-scroll > div:hover .weather-icon-pulse {
  animation: weatherPulse 2s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .weather-icon-float, .weather-icon-pulse {
    animation: none !important;
  }
}
</style>
