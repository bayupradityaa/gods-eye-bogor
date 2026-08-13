import { ref, computed, watch } from 'vue'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'bogor-live-theme'
const DEFAULT_THEME: Theme = 'light'

const theme = ref<Theme>(getStoredTheme())

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  return DEFAULT_THEME
}

function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t)

  // Update meta theme-color for mobile browsers
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', t === 'dark' ? '#07090D' : '#F7F8FA')
  }
}

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark')

  function setTheme(t: Theme) {
    theme.value = t
    localStorage.setItem(STORAGE_KEY, t)
    applyTheme(t)
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  function initTheme() {
    applyTheme(theme.value)
  }

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
    initTheme,
  }
}
