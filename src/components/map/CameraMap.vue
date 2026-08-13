<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { Map as MapLibreMap, Marker, Popup, NavigationControl, type RasterTileSource, type Map as MapType, type Marker as MarkerType } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { CAMERAS } from '@/data/cameras'
import type { Camera } from '@/types/camera'
import type { FilterCategory } from '@/types/camera'
import { CATEGORY_COLORS, formatId } from '@/lib/utils'
import { useTheme } from '@/composables/useTheme'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps<{
  activeCategory?: FilterCategory
}>()

const emit = defineEmits<{
  select: [cam: Camera]
}>()

const mapContainer = ref<HTMLElement | null>(null)
const mapSection = ref<HTMLElement | null>(null)
const map = ref<MapType | null>(null)
const { theme } = useTheme()

// Kota Bogor center coordinates
const BOGOR_CENTER: [number, number] = [106.7934, -6.5971]

const TILE_URLS = {
  light: 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  dark: 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
}

// Track markers for filtering
const markers = ref<{ marker: MarkerType; camera: Camera; el: HTMLElement }[]>([])

function getPopupHTML(cam: Camera): string {
  const currentTheme = theme.value
  const bg = currentTheme === 'dark' ? '#11161F' : '#FFFFFF'
  const border = currentTheme === 'dark' ? 'rgba(255,255,255,0.08)' : '#E4E7EC'
  const textColor = currentTheme === 'dark' ? '#F5F7FA' : '#111827'
  const mutedColor = currentTheme === 'dark' ? '#6B7485' : '#667085'
  const accent = currentTheme === 'dark' ? '#4ADE80' : '#16A34A'
  const btnBg = currentTheme === 'dark' ? '#F5F7FA' : '#111827'
  const btnText = currentTheme === 'dark' ? '#000' : '#FFF'

  return `
    <div style="background:${bg};border-radius:12px;padding:16px;border:1px solid ${border};min-width:200px;max-width:240px;box-shadow:0 8px 32px rgba(0,0,0,0.12);">
      <p style="color:${textColor};font-size:14px;font-weight:500;margin:0 0 4px;line-height:1.3;letter-spacing:-0.01em;">${cam.name}</p>
      <p style="color:${mutedColor};font-size:10px;margin:0 0 12px;letter-spacing:0.05em;text-transform:uppercase;font-weight:500;">CAM ${String(cam.id).padStart(3, '0')} · <span style="color:${CATEGORY_COLORS[cam.category]}">${cam.category}</span></p>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="width:6px;height:6px;border-radius:50%;background:${accent};"></span>
          <span style="color:${accent};font-size:9px;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;">Live</span>
        </div>
        <button data-cam-id="${cam.id}" class="map-view-btn" style="background:${btnBg};color:${btnText};border:none;padding:6px 14px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;letter-spacing:0.02em;transition:transform 0.15s, opacity 0.15s;">
          Lihat
        </button>
      </div>
    </div>
  `
}

function filterMarkers(category: FilterCategory | undefined) {
  const cat = category || 'all'
  markers.value.forEach(({ marker, camera, el }) => {
    const show = cat === 'all' || camera.category === cat
    el.style.display = show ? 'block' : 'none'
    // Close popup if hidden
    if (!show) {
      const popup = marker.getPopup()
      if (popup && popup.isOpen()) popup.remove()
    }
  })
}

onMounted(() => {
  if (!mapContainer.value) return

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // GSAP entrance animation
  if (mapSection.value && !prefersReducedMotion) {
    gsap.from(mapSection.value.querySelectorAll('.map-header > *'), {
      scrollTrigger: { trigger: mapSection.value, start: 'top 85%' },
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
    })
    gsap.from(mapContainer.value.parentElement, {
      scrollTrigger: { trigger: mapContainer.value.parentElement, start: 'top 90%' },
      opacity: 0,
      scale: 0.98,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.2,
    })
  }

  const m = new MapLibreMap({
    container: mapContainer.value,
    style: {
      version: 8,
      sources: {
        'carto-tiles': {
          type: 'raster',
          tiles: [TILE_URLS[theme.value]],
          tileSize: 256,
        },
      },
      layers: [{
        id: 'carto-layer',
        type: 'raster',
        source: 'carto-tiles',
        minzoom: 0,
        maxzoom: 22,
      }],
    },
    center: BOGOR_CENTER,
    zoom: 12.5,
    attributionControl: false,
  })

  m.addControl(new NavigationControl({ showCompass: false }), 'bottom-right')

  // Delegate click on "View Camera" buttons inside popups
  m.on('click', () => {
    // Delegate handled below
  })

  // Listen for popup View button clicks via event delegation on the map container
  const containerEl = mapContainer.value
  if (containerEl) {
    containerEl.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('.map-view-btn') as HTMLElement | null
      if (target) {
        const camId = Number(target.getAttribute('data-cam-id'))
        const cam = CAMERAS.find((c) => c.id === camId)
        if (cam) {
          emit('select', cam)
        }
      }
    })
  }

  m.on('load', () => {
    const cols = 10
    const spread = 0.045

    CAMERAS.forEach((cam, i) => {
      const row = Math.floor(i / cols)
      const col = i % cols
      const lng = BOGOR_CENTER[0] + (col - cols / 2) * (spread / cols * 2)
      const lat = BOGOR_CENTER[1] + (row - CAMERAS.length / cols / 2) * (spread / cols * 2)

      const el = document.createElement('div')
      el.style.width = '10px'
      el.style.height = '10px'
      el.style.borderRadius = '50%'
      el.style.background = CATEGORY_COLORS[cam.category]
      el.style.cursor = 'pointer'
      el.style.boxShadow = `0 0 0 2px var(--bg), 0 0 10px ${CATEGORY_COLORS[cam.category]}40`
      el.style.transition = 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'

      const popup = new Popup({
        offset: 12,
        className: 'camera-popup',
        closeButton: false,
        maxWidth: '260px',
      })

      // Update popup HTML on open (so theme colors are current)
      popup.on('open', () => {
        popup.setHTML(getPopupHTML(cam))
      })

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.5)'
      })
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)'
      })

      const marker = new Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(m)

      markers.value.push({ marker, camera: cam, el })
    })

    // Apply initial category filter
    filterMarkers(props.activeCategory)
  })

  map.value = m
})

// Watch category filter changes
watch(() => props.activeCategory, (newCat) => {
  filterMarkers(newCat)
})

// Watch for theme changes and swap tile layer
watch(theme, (newTheme) => {
  const m = map.value
  if (!m) return

  const source = m.getSource('carto-tiles')
  if (source) {
    m.removeLayer('carto-layer')
    m.removeSource('carto-tiles')
    m.addSource('carto-tiles', {
      type: 'raster',
      tiles: [TILE_URLS[newTheme]],
      tileSize: 256,
    })
    m.addLayer({
      id: 'carto-layer',
      type: 'raster',
      source: 'carto-tiles',
      minzoom: 0,
      maxzoom: 22,
    })
  }
})

onUnmounted(() => {
  map.value?.remove()
})
</script>

<template>
  <section id="map" ref="mapSection" class="relative layout-container py-16 sm:py-24">
    <div class="map-header mb-12">
      <p class="text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2 font-medium" style="color: var(--text-muted);">Jelajahi Bogor</p>
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight" style="color: var(--text);">
        Peta Kamera
      </h2>
      <p class="mt-3 max-w-xl text-[15px] sm:text-base leading-relaxed" style="color: var(--text-secondary);">
        Lihat persebaran kamera publik di seluruh Kota Bogor melalui peta interaktif.
      </p>
    </div>

    <div class="map-wrapper rounded-[24px] overflow-hidden shadow-sm" style="border: 1px solid var(--border); padding: 6px; background: var(--surface);">
      <div
        ref="mapContainer"
        class="map-container w-full rounded-[18px] overflow-hidden"
        data-no-theme-transition
        :style="{ height: 'clamp(400px, 60vh, 600px)', background: 'var(--map-bg)' }"
      ></div>
    </div>

    <p class="text-[10px] mt-4 text-center tracking-widest uppercase font-medium" style="color: var(--text-muted);">
      Marker menunjukkan perkiraan sebaran kamera
    </p>
  </section>
</template>

<style>
.camera-popup .maplibregl-popup-content {
  background: transparent !important;
  padding: 0 !important;
  border-radius: 12px !important;
  box-shadow: none !important;
}

.camera-popup .maplibregl-popup-tip {
  border-top-color: var(--map-popup-tip) !important;
}

.maplibregl-ctrl-attrib {
  display: none !important;
}

.maplibregl-ctrl button {
  background-color: var(--map-ctrl-bg) !important;
  border: 1px solid var(--map-ctrl-border) !important;
  color: var(--map-ctrl-color) !important;
  border-radius: 8px !important;
  width: 36px !important;
  height: 36px !important;
  margin-bottom: 6px !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
}

.maplibregl-ctrl button:hover {
  background-color: var(--map-ctrl-hover) !important;
}

.map-view-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
.map-view-btn:active {
  transform: scale(0.96);
}
</style>
