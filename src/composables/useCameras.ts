import { ref, computed, watch } from 'vue'
import { CAMERAS } from '@/data/cameras'
import type { Camera, FilterCategory } from '@/types/camera'
import { useCameraPreferences } from './useCameraPreferences'

const activeCategory = ref<FilterCategory>('all')
const searchQuery = ref('')
const selectedCamera = ref<Camera | null>(null)
const viewerOpen = ref(false)

const INITIAL_LIMIT = 24
const displayLimit = ref(INITIAL_LIMIT)
let isInitialized = false

export function useCameras() {
  const { addRecent } = useCameraPreferences()

  const allFiltered = computed(() => {
    return CAMERAS.filter((cam) => {
      if (activeCategory.value !== 'all' && cam.category !== activeCategory.value) return false
      if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        const matchesName = cam.name.toLowerCase().includes(q)
        const matchesCategory = cam.category.toLowerCase().includes(q)
        const matchesId = String(cam.id).includes(q)
        if (!matchesName && !matchesCategory && !matchesId) return false
      }
      return true
    })
  })

  const filteredCameras = computed(() => {
    return allFiltered.value.slice(0, displayLimit.value)
  })

  const totalResults = computed(() => allFiltered.value.length)
  
  const canLoadMore = computed(() => displayLimit.value < totalResults.value)

  function loadMore() {
    displayLimit.value += 24
  }

  // Reset limit when filters change
  watch([activeCategory, searchQuery], () => {
    displayLimit.value = INITIAL_LIMIT
  })

  const categoryCounts = computed(() => {
    const counts: Record<string, number> = { all: CAMERAS.length }
    for (const cat of [...new Set(CAMERAS.map((c) => c.category))]) {
      counts[cat] = CAMERAS.filter((c) => c.category === cat).length
    }
    return counts
  })

  function setCategory(cat: FilterCategory) {
    activeCategory.value = cat
  }

  function setSearch(q: string) {
    searchQuery.value = q
  }

  function openCamera(camera: Camera, pushState = true) {
    addRecent(camera.id)
    selectedCamera.value = camera
    viewerOpen.value = true
    
    // Sync to URL without reloading
    if (pushState) {
      const url = new URL(window.location.href)
      url.searchParams.set('cam', String(camera.id))
      window.history.pushState({ camId: camera.id }, '', url.toString())
    }
  }

  function closeViewer(pushState = true) {
    viewerOpen.value = false
    selectedCamera.value = null
    
    // Remove from URL
    if (pushState) {
      const url = new URL(window.location.href)
      url.searchParams.delete('cam')
      window.history.pushState({ camId: null }, '', url.toString())
    }
  }

  // Deep Linking: Check URL on initial load
  function initFromUrl() {
    if (isInitialized || typeof window === 'undefined') return
    isInitialized = true
    
    const params = new URLSearchParams(window.location.search)
    const camId = params.get('cam')
    
    if (camId) {
      const targetCam = CAMERAS.find(c => String(c.id) === camId)
      if (targetCam) {
        // Delay opening slightly to ensure DOM is ready, or just open directly
        openCamera(targetCam, false)
      }
    }
    
    // Listen for browser Back/Forward navigation
    window.addEventListener('popstate', (event) => {
      const currentCamId = new URLSearchParams(window.location.search).get('cam')
      if (currentCamId) {
        const targetCam = CAMERAS.find(c => String(c.id) === currentCamId)
        if (targetCam) openCamera(targetCam, false)
      } else {
        closeViewer(false)
      }
    })
  }

  // Only run initialization once
  initFromUrl()

  return {
    cameras: CAMERAS,
    allFiltered,
    filteredCameras,
    totalResults,
    canLoadMore,
    loadMore,
    activeCategory,
    searchQuery,
    categoryCounts,
    selectedCamera,
    viewerOpen,
    setCategory,
    setSearch,
    openCamera,
    closeViewer,
  }
}
