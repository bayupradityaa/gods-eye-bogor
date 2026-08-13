<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { CAMERAS } from '@/data/cameras'
import type { Camera } from '@/types/camera'
import { CATEGORY_COLORS, formatId } from '@/lib/utils'

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<maplibregl.Map | null>(null)

// Kota Bogor center coordinates
const BOGOR_CENTER: [number, number] = [106.7934, -6.5971]

onMounted(() => {
  if (!mapContainer.value) return

  const m = new maplibregl.Map({
    container: mapContainer.value,
    style: {
      version: 8,
      sources: {
        'dark-matter': {
          type: 'raster',
          tiles: ['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'],
          tileSize: 256,
        },
      },
      layers: [{
        id: 'dark-matter-layer',
        type: 'raster',
        source: 'dark-matter',
        minzoom: 0,
        maxzoom: 22,
      }],
    },
    center: BOGOR_CENTER,
    zoom: 12,
    attributionControl: false,
  })

  m.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')

  m.on('load', () => {
    // Add markers for cameras
    // We don't have real coordinates, so we distribute them in a grid pattern around Bogor
    // This creates a visualization placeholder - coordinates can be added later
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
      el.style.boxShadow = `0 0 12px ${CATEGORY_COLORS[cam.category]}40`
      el.style.transition = 'transform 0.2s, box-shadow 0.2s'
      el.style.border = '2px solid rgba(0,0,0,0.5)'

      const popup = new maplibregl.Popup({
        offset: 8,
        className: 'camera-popup',
        closeButton: false,
        maxWidth: '220px',
      }).setHTML(`
        <div style="background:#11161F;border-radius:8px;padding:10px;border:1px solid rgba(255,255,255,0.08);min-width:160px;">
          <p style="color:#F5F7FA;font-size:13px;font-weight:500;margin:0 0 2px;">${cam.name}</p>
          <p style="color:#6B7485;font-size:10px;margin:0 0 4px;letter-spacing:0.5px;">${formatId(cam.id)} · <span style="color:${CATEGORY_COLORS[cam.category]}">${cam.category}</span></p>
          <div style="display:flex;align-items:center;gap:4px;">
            <span style="width:6px;height:6px;border-radius:50%;background:#4ADE80;"></span>
            <span style="color:#4ADE80;font-size:9px;letter-spacing:1px;text-transform:uppercase;">Live</span>
          </div>
        </div>
      `)

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.5)'
        el.style.boxShadow = `0 0 20px ${CATEGORY_COLORS[cam.category]}60`
      })
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)'
        el.style.boxShadow = `0 0 12px ${CATEGORY_COLORS[cam.category]}40`
      })

      new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(m)
    })
  })

  map.value = m
})
</script>

<template>
  <section id="map" class="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
    <div class="max-w-7xl mx-auto">
      <div class="mb-10">
        <p class="text-xs tracking-[0.2em] uppercase text-accent-cyan mb-3 font-medium">Bogor From Above</p>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white">
          Peta Kamera
        </h2>
        <p class="mt-3 text-text-secondary max-w-xl text-sm sm:text-base">
          Jelajahi lokasi kamera publik di seluruh Kota Bogor.
        </p>
      </div>

      <div
        ref="mapContainer"
        class="w-full rounded-2xl border border-white/[0.06] overflow-hidden"
        :style="{ height: '500px', background: '#07090D' }"
      ></div>

      <p class="text-[11px] text-text-muted mt-3 text-center tracking-wider">
        Marker menunjukkan perkiraan sebaran kamera. Koordinat aktual dapat ditambahkan kemudian.
      </p>
    </div>
  </section>
</template>

<style>
.camera-popup .maplibregl-popup-content {
  background: transparent !important;
  padding: 0 !important;
  border-radius: 8px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
}

.camera-popup .maplibregl-popup-tip {
  border-top-color: #11161F !important;
}

.maplibregl-ctrl-attrib {
  display: none !important;
}

.maplibregl-ctrl button {
  background-color: #11161F !important;
  border: 1px solid rgba(255,255,255,0.08) !important;
  color: #9AA4B2 !important;
  border-radius: 6px !important;
  width: 32px !important;
  height: 32px !important;
}

.maplibregl-ctrl button:hover {
  background-color: #161D27 !important;
}
</style>
