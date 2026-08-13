<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Sun, Moon, Menu, X } from '@lucide/vue'
import { useTheme } from '@/composables/useTheme'
import gsap from 'gsap'

const emit = defineEmits<{
  openSearch: []
}>()

const { isDark, toggleTheme } = useTheme()

const scrolled = ref(false)
const mobileMenuOpen = ref(false)
const navRef = ref<HTMLElement | null>(null)

function onScroll() {
  scrolled.value = window.scrollY > 40
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && mobileMenuOpen.value) {
    closeMobileMenu()
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!prefersReducedMotion && navRef.value) {
    gsap.fromTo(navRef.value, 
      { opacity: 0, y: -12 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 }
    )
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none transition-all duration-300 pt-3 sm:pt-4">
    <!-- Floating Pill Container -->
    <div 
      ref="navRef"
      class="nav-container mx-auto pointer-events-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      :class="scrolled ? 'nav-scrolled' : 'nav-top'"
    >
      <!-- Logo -->
      <a href="#" class="group flex items-center gap-3 shrink-0" @click="closeMobileMenu">
        <div class="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg" style="background: var(--text); color: var(--bg);">
          <span class="text-[10px] sm:text-xs font-bold tracking-wider">BL</span>
        </div>
        <span class="text-[13px] sm:text-[14px] font-semibold tracking-wide uppercase transition-colors" style="color: var(--text);">
          Bogor Live
        </span>
      </a>

      <!-- Desktop Links -->
      <nav class="hidden md:flex items-center gap-8 lg:gap-10">
        <a href="#explorer" class="nav-link text-[11px] tracking-[0.1em] font-medium uppercase relative group">
          Kamera
          <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></span>
        </a>
        <a href="#map" class="nav-link text-[11px] tracking-[0.1em] font-medium uppercase relative group">
          Peta
          <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></span>
        </a>
        <a href="#monitoring" class="nav-link text-[11px] tracking-[0.1em] font-medium uppercase relative group">
          Pantauan Saya
          <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></span>
        </a>
      </nav>

      <!-- Right Controls -->
      <div class="flex items-center gap-2 sm:gap-3 shrink-0">
        <!-- Search -->
        <button
          class="search-btn group hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          style="border-color: var(--border);"
          @click="emit('openSearch')"
        >
          <span class="text-xs font-medium tracking-wide uppercase" style="color: var(--text-secondary);">⌕ Search</span>
          <kbd class="text-[9px] tracking-widest font-mono px-1.5 py-0.5 rounded border opacity-50" style="color: var(--text-muted); border-color: var(--border);">⌘K</kbd>
        </button>

        <button
          class="sm:hidden w-9 h-9 flex items-center justify-center rounded-full bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          style="color: var(--text-secondary);"
          @click="emit('openSearch')"
        >
          <span class="text-sm">⌕</span>
        </button>

        <div class="w-px h-3 bg-black/10 dark:bg-white/10 hidden sm:block"></div>

        <!-- Theme Toggle -->
        <button
          class="theme-toggle w-9 h-9 flex items-center justify-center rounded-full bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative"
          style="color: var(--text-secondary);"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleTheme"
        >
          <Transition
            enter-active-class="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            enter-from-class="opacity-0 -rotate-90 scale-50"
            enter-to-class="opacity-100 rotate-0 scale-100"
            leave-active-class="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] absolute"
            leave-from-class="opacity-100 rotate-0 scale-100"
            leave-to-class="opacity-0 rotate-90 scale-50"
          >
            <Moon v-if="isDark" :size="15" :stroke-width="2" />
            <Sun v-else :size="15" :stroke-width="2" />
          </Transition>
        </button>

        <div class="w-px h-3 bg-black/10 dark:bg-white/10 hidden sm:block"></div>

        <!-- Live Status -->
        <div class="hidden sm:flex items-center gap-1.5 pl-1 pr-2">
          <span class="live-dot w-1.5 h-1.5 bg-[#16A34A] rounded-full"></span>
          <span class="text-[9px] tracking-[0.2em] font-bold uppercase text-[#16A34A] pt-px">Live</span>
        </div>

        <!-- Mobile Menu Toggle -->
        <button 
          class="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          style="color: var(--text);"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <Menu v-if="!mobileMenuOpen" :size="16" />
          <X v-else :size="16" />
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Menu Overlay -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-4"
  >
    <div 
      v-if="mobileMenuOpen" 
      class="fixed inset-x-0 top-[72px] z-40 mx-4 p-6 rounded-3xl border shadow-xl flex flex-col gap-6 md:hidden"
      style="background: var(--surface); border-color: var(--border);"
    >
      <nav class="flex flex-col gap-6">
        <a href="#explorer" class="text-xs tracking-[0.2em] font-semibold uppercase" style="color: var(--text);" @click="closeMobileMenu">Kamera</a>
        <a href="#map" class="text-xs tracking-[0.2em] font-semibold uppercase" style="color: var(--text);" @click="closeMobileMenu">Peta</a>
        <a href="#monitoring" class="text-xs tracking-[0.2em] font-semibold uppercase" style="color: var(--text);" @click="closeMobileMenu">Pantauan Saya</a>
      </nav>
      <div class="pt-6 border-t flex items-center justify-between" style="border-color: var(--border);">
        <div class="flex items-center gap-2">
          <span class="live-dot w-2 h-2 bg-[#16A34A] rounded-full"></span>
          <span class="text-[10px] tracking-[0.2em] font-bold uppercase text-[#16A34A] pt-px">System Live</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.nav-container {
  width: 100%;
  max-width: 1240px;
}

.nav-top {
  height: 64px;
  background: transparent;
  border: 1px solid transparent;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
@media (min-width: 640px) {
  .nav-top {
    height: 72px;
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

.nav-scrolled {
  height: 56px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 9999px;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  box-shadow: 0 4px 24px -6px rgba(0, 0, 0, 0.04);
}
@media (min-width: 640px) {
  .nav-scrolled {
    height: 64px;
    padding-left: 1.5rem;
    padding-right: 1.25rem;
  }
}

:global([data-theme="dark"]) .nav-scrolled {
  background: rgba(15, 17, 21, 0.78);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.3);
}

.nav-link {
  color: var(--text-secondary);
  transition: color 200ms ease, transform 200ms ease;
  display: inline-block;
}
.nav-link:hover {
  color: var(--text);
  transform: translateY(-1px);
}

.search-btn:hover span:first-child {
  color: var(--text) !important;
}

.theme-toggle:focus-visible, .search-btn:focus-visible, .nav-link:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

@keyframes slowPulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}

.live-dot {
  animation: slowPulse 2.5s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .nav-container {
    transition: background-color 300ms ease, border-color 300ms ease;
  }
  .live-dot {
    animation: none;
  }
  .nav-link:hover {
    transform: none;
  }
}
</style>
