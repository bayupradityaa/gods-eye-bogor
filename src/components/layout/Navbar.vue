<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Sun, Moon } from '@lucide/vue'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme, theme } = useTheme()

const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 60
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="scrolled
      ? 'navbar-scrolled backdrop-blur-xl shadow-sm'
      : 'bg-transparent'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-18">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="w-7 h-7 rounded-lg border flex items-center justify-center"
            style="background: var(--accent-soft); border-color: var(--accent-dim);"
          >
            <span class="text-xs font-bold" style="color: var(--accent);">BL</span>
          </div>
          <div class="hidden sm:block">
            <span class="text-sm font-medium tracking-tight" style="color: var(--text);">Bogor Live</span>
            <span class="text-[10px] ml-2 tracking-wider uppercase" style="color: var(--text-muted);">CCTV</span>
          </div>
        </div>

        <!-- Nav Links -->
        <nav class="hidden md:flex items-center gap-8">
          <a href="#explorer" class="nav-link text-xs tracking-wider uppercase">Cameras</a>
          <a href="#map" class="nav-link text-xs tracking-wider uppercase">Map</a>
          <a href="#pulse" class="nav-link text-xs tracking-wider uppercase">City Pulse</a>
        </nav>

        <!-- Right -->
        <div class="flex items-center gap-3">
          <!-- Theme toggle -->
          <button
            class="theme-toggle"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleTheme"
          >
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 rotate-[-90deg] scale-75"
              enter-to-class="opacity-100 rotate-0 scale-100"
              leave-active-class="transition-all duration-150 ease-in absolute"
              leave-from-class="opacity-100 rotate-0 scale-100"
              leave-to-class="opacity-0 rotate-90 scale-75"
              mode="out-in"
            >
              <Moon v-if="isDark" :size="16" :stroke-width="1.8" />
              <Sun v-else :size="16" :stroke-width="1.8" />
            </Transition>
          </button>

          <!-- Search -->
          <button
            class="search-btn"
            @click="$emit('openSearch')"
          >
            <span class="text-sm leading-none">⌕</span>
            <span class="hidden sm:inline">Search</span>
            <kbd class="search-kbd hidden sm:inline-flex">
              ⌘K
            </kbd>
          </button>

          <!-- Live indicator -->
          <div class="live-indicator">
            <span class="w-1.5 h-1.5 rounded-full animate-pulse" style="background: var(--accent);"></span>
            <span class="live-text hidden sm:inline">Live</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar-scrolled {
  background: var(--navbar-bg);
  border-bottom: 1px solid var(--navbar-border);
}

.nav-link {
  color: var(--text-secondary);
  transition: color 200ms ease;
}
.nav-link:hover {
  color: var(--text);
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--filter-bg);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 200ms ease;
  position: relative;
}
.theme-toggle:hover {
  color: var(--text);
  border-color: var(--border-hover);
  background: var(--filter-hover-bg);
}
.theme-toggle:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background: var(--filter-bg);
  font-size: 0.75rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 200ms ease;
}
.search-btn:hover {
  color: var(--text);
  border-color: var(--border-hover);
}

.search-kbd {
  font-size: 10px;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  background: var(--search-kbd-bg);
  border: 1px solid var(--search-kbd-border);
  color: var(--text-muted);
}

.live-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-left: 0.75rem;
  border-left: 1px solid var(--border);
}

.live-text {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--accent);
}
</style>
