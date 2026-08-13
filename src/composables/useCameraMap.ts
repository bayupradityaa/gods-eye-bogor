import { ref, computed, shallowRef } from 'vue'
import type { Map as LeafletMap } from 'leaflet'
import type { Camera } from '@/types/camera'
import { useCameras } from '@/composables/useCameras'
import { CAMERAS } from '@/data/cameras'

const selectedMapCamera = ref<Camera | null>(null)
const mapInstance = shallowRef<LeafletMap | null>(null)

export function useCameraMap() {
  const { allFiltered, openCamera } = useCameras()

  // Only cameras that have valid coordinates
  const mapCameras = computed(() => {
    return allFiltered.value.filter(c => c.latitude !== undefined && c.longitude !== undefined)
  })

  function selectMapCamera(camera: Camera | null) {
    selectedMapCamera.value = camera
    if (camera && camera.latitude && camera.longitude && mapInstance.value) {
      mapInstance.value.setView([camera.latitude, camera.longitude], 15, {
        animate: true,
        duration: 0.8
      })
    }
  }

  function viewCameraInModal(camera: Camera) {
    // This connects to the existing system to open the video modal
    openCamera(camera)
  }

  function resetMapBounds() {
    if (!mapInstance.value) return
    const L = window.L // We'll assume Leaflet is available globally or we import it in the component
    if (!L) return

    const bounds = L.latLngBounds([])
    const hasValidCoords = CAMERAS.some(c => c.latitude && c.longitude)
    
    if (hasValidCoords) {
      CAMERAS.forEach(c => {
        if (c.latitude && c.longitude) {
          bounds.extend([c.latitude, c.longitude])
        }
      })
      mapInstance.value.fitBounds(bounds, { padding: [60, 60], animate: true, duration: 1 })
    } else {
      // Fallback Bogor Center
      mapInstance.value.setView([-6.5971, 106.7932], 13, { animate: true })
    }
  }

  return {
    mapInstance,
    selectedMapCamera,
    mapCameras,
    selectMapCamera,
    viewCameraInModal,
    resetMapBounds
  }
}
