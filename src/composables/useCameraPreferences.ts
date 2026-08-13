import { ref, computed } from 'vue'
import { CAMERAS } from '@/data/cameras'
import type { Camera } from '@/types/camera'

const FAVORITES_KEY = 'bogor-live-favorites'
const RECENT_KEY = 'bogor-live-recent'
const MAX_RECENT = 5

function loadIds(key: string): number[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.filter((id): id is number => typeof id === 'number')
    return []
  } catch {
    return []
  }
}

function saveIds(key: string, ids: number[]) {
  localStorage.setItem(key, JSON.stringify(ids))
}

const favorites = ref<number[]>(loadIds(FAVORITES_KEY))
const recentIds = ref<number[]>(loadIds(RECENT_KEY))

export function useCameraPreferences() {
  function isFavorite(id: number): boolean {
    return favorites.value.includes(id)
  }

  function toggleFavorite(id: number) {
    const idx = favorites.value.indexOf(id)
    if (idx >= 0) {
      favorites.value.splice(idx, 1)
    } else {
      favorites.value.push(id)
    }
    saveIds(FAVORITES_KEY, favorites.value)
  }

  function addRecent(id: number) {
    const filtered = recentIds.value.filter((rid) => rid !== id)
    filtered.unshift(id)
    recentIds.value = filtered.slice(0, MAX_RECENT)
    saveIds(RECENT_KEY, recentIds.value)
  }

  function clearRecent() {
    recentIds.value = []
    saveIds(RECENT_KEY, [])
  }

  const favoriteCameraList = computed<Camera[]>(() => {
    return favorites.value
      .map((id) => CAMERAS.find((c) => c.id === id))
      .filter((c): c is Camera => c !== undefined)
  })

  const recentCameraList = computed<Camera[]>(() => {
    return recentIds.value
      .map((id) => CAMERAS.find((c) => c.id === id))
      .filter((c): c is Camera => c !== undefined)
  })

  const hasPreferences = computed(() => {
    return favorites.value.length > 0 || recentIds.value.length > 0
  })

  return {
    favorites,
    recentCameras: recentIds,
    isFavorite,
    toggleFavorite,
    addRecent,
    clearRecent,
    favoriteCameraList,
    recentCameraList,
    hasPreferences,
  }
}
