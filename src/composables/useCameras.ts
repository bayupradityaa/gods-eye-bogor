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

  function openCamera(camera: Camera) {
    addRecent(camera.id)
    selectedCamera.value = camera
    viewerOpen.value = true
  }

  function closeViewer() {
    viewerOpen.value = false
    selectedCamera.value = null
  }

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
