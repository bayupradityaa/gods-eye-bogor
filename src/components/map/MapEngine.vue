<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Supercluster from 'supercluster'
import { useCameraMap } from '@/composables/useCameraMap'
import { useTheme } from '@/composables/useTheme'
import type { Camera } from '@/types/camera'

const props = defineProps<{
  cameras: Camera[]
}>()

const mapContainer = ref<HTMLElement | null>(null)
const { mapInstance, selectedMapCamera, selectMapCamera } = useCameraMap()
const { theme } = useTheme()

const TILE_URLS = {
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
}

let cluster: Supercluster | null = null
let markersLayer = L.layerGroup()
let tileLayer: L.TileLayer | null = null

function updateClusters() {
  if (!mapInstance.value || !cluster) return
  
  const bounds = mapInstance.value.getBounds()
  const zoom = mapInstance.value.getZoom()
  
  const bbox: [number, number, number, number] = [
    bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()
  ]
  
  const clusters = cluster.getClusters(bbox, zoom)
  
  markersLayer.clearLayers()
  
  clusters.forEach(c => {
    const [lng, lat] = c.geometry.coordinates
    const isCluster = c.properties?.cluster
    
    if (isCluster) {
      const count = c.properties.point_count
      const icon = L.divIcon({
        html: `<div class="camera-cluster"><span>${count}</span></div>`,
        className: 'custom-cluster-icon',
        iconSize: [36, 36]
      })
      
      const marker = L.marker([lat, lng], { 
        icon,
        title: `Grup ${count} Kamera`,
        alt: `Grup ${count} Kamera`
      })
      marker.on('click', () => {
        const expansionZoom = cluster!.getClusterExpansionZoom(c.properties.cluster_id)
        mapInstance.value?.setView([lat, lng], expansionZoom, { animate: true })
      })
      markersLayer.addLayer(marker)
      
    } else {
      const cam = c.properties as Camera
      const isSelected = selectedMapCamera.value?.id === cam.id
      
      // Create custom marker
      const markerHtml = `
        <div class="camera-marker ${isSelected ? 'is-selected' : ''}">
          <div class="marker-core"></div>
          <div class="marker-ring"></div>
          <div class="marker-live-dot"></div>
        </div>
      `
      
      const icon = L.divIcon({
        html: markerHtml,
        className: 'custom-marker-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
      
      const marker = L.marker([lat, lng], { 
        icon,
        title: cam.name,
        alt: cam.name
      })
      marker.on('click', () => {
        selectMapCamera(cam)
      })
      markersLayer.addLayer(marker)
    }
  })
}

function initMap() {
  if (!mapContainer.value) return
  
  // Define Bogor bounds
  const bogorBounds = L.latLngBounds(
    [-6.75, 106.65], // Southwest
    [-6.45, 106.95]  // Northeast
  );

  // Initialize Map
  const m = L.map(mapContainer.value, {
    zoomControl: false, // We'll build custom controls
    attributionControl: false,
    maxBounds: bogorBounds,
    maxBoundsViscosity: 1.0,
    minZoom: 11
  }).setView([-6.5971, 106.7932], 13)
  
  tileLayer = L.tileLayer(TILE_URLS[theme.value], {
    maxZoom: 19
  }).addTo(m)
  
  markersLayer.addTo(m)
  mapInstance.value = m
  
  // Initialize Supercluster
  cluster = new Supercluster({
    radius: 50,
    maxZoom: 16
  })
  
  // Load data
  loadData(props.cameras)
  
  // Events
  m.on('moveend', updateClusters)
  m.on('zoomend', updateClusters)
}

function loadData(cams: Camera[]) {
  if (!cluster || !mapInstance.value) return
  
  const points = cams
    .filter(c => c.latitude !== undefined && c.longitude !== undefined)
    .map(c => ({
      type: 'Feature' as const,
      properties: c,
      geometry: {
        type: 'Point' as const,
        coordinates: [c.longitude!, c.latitude!]
      }
    }))
    
  cluster.load(points)
  updateClusters()
}

watch(() => props.cameras, (newCams) => {
  loadData(newCams)
}, { deep: true })

watch(theme, (newTheme) => {
  if (tileLayer) {
    tileLayer.setUrl(TILE_URLS[newTheme])
  }
})

// Update clusters when selection changes (to update the active marker styling)
watch(selectedMapCamera, () => {
  updateClusters()
})

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (mapInstance.value) {
    mapInstance.value.remove()
    mapInstance.value = null
  }
})
</script>

<template>
  <div ref="mapContainer" class="w-full h-full bg-[#F7F9FB] dark:bg-[#0B1120] rounded-[24px] overflow-hidden"></div>
</template>

<style>
/* Leaflet Overrides */
.leaflet-container {
  font-family: 'Manrope', sans-serif;
  background: transparent !important;
}

/* Custom Marker */
.custom-marker-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-marker {
  position: relative;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #FFFFFF;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.camera-marker .marker-core {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1687B8; /* Bogor Blue */
  transition: all 300ms ease;
}

.camera-marker .marker-ring {
  position: absolute;
  inset: -4px;
  border: 1px solid rgba(22, 135, 184, 0.4);
  border-radius: 50%;
  opacity: 0;
  transform: scale(0.8);
  transition: all 300ms ease;
}

.camera-marker:hover {
  transform: scale(1.15);
}

.camera-marker.is-selected {
  width: 20px;
  height: 20px;
  box-shadow: 0 4px 12px rgba(245, 154, 35, 0.3);
}

.camera-marker.is-selected .marker-core {
  background: #F59A23; /* Bogor Orange */
  width: 12px;
  height: 12px;
}

.camera-marker.is-selected .marker-ring {
  opacity: 1;
  transform: scale(1);
  border-color: rgba(245, 154, 35, 0.6);
  animation: pulse-ring 2s infinite cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

.marker-live-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 5px;
  height: 5px;
  background: #F28C28; /* System Green */
  border-radius: 50%;
  border: 1px solid #FFFFFF;
  animation: pulse-live 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
  pointer-events: none;
}

.dark .marker-live-dot {
  border-color: #0B1120;
}

@keyframes pulse-live {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}

/* Custom Cluster */
.custom-cluster-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-cluster {
  width: 32px;
  height: 32px;
  background: #FFFFFF;
  border: 2px solid #1687B8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1687B8;
  font-weight: 700;
  font-size: 13px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1);
  transition: transform 200ms ease;
  cursor: pointer;
}

.dark .camera-cluster {
  background: #111827;
  border-color: #38A3D1;
  color: #38A3D1;
}

.camera-cluster:hover {
  transform: scale(1.1);
}
</style>
