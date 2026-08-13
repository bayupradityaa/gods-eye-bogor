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
const activeSection = ref('')
let observer: IntersectionObserver | null = null

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
    const navItems = navRef.value.querySelectorAll('.nav-anim-item')
    gsap.fromTo(navItems,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: 'cubic-bezier(0.22, 1, 0.36, 1)', delay: 0.1 }
    )
  }

  // Setup Intersection Observer for active section
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, { rootMargin: '-20% 0px -60% 0px' })
  
  setTimeout(() => {
    ['cameras', 'map', 'watchlist'].forEach(id => {
      const el = document.getElementById(id)
      if (el) observer?.observe(el)
    })
  }, 500)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  if (observer) observer.disconnect()
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
      <a href="#" class="nav-anim-item group flex items-center gap-3 shrink-0" @click="closeMobileMenu">
        <img src="/Kujang.webp" alt="Bogor Live Logo" class="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
        <span class="nav-logo-text text-[13px] sm:text-[14px] font-[900] tracking-tighter uppercase transition-colors font-['Plus_Jakarta_Sans']">
          <span class="nav-logo-bogor" style="color: var(--primary);">BOGOR</span>
          <span class="nav-logo-live" style="color: var(--text);"> LIVE</span><span style="color: var(--accent);">.</span>
        </span>
      </a>

      <!-- Desktop Links -->
      <nav class="hidden md:flex items-center gap-8 lg:gap-10">
        <a href="#cameras" class="nav-anim-item nav-link text-[11px] tracking-[0.1em] font-medium uppercase relative group" :class="{ 'active-nav': activeSection === 'cameras' }">
          Kamera
          <span class="absolute -bottom-1 left-0 h-[2px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                :class="activeSection === 'cameras' ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'" 
                style="background: #1479A6;"></span>
        </a>
        <a href="#map" class="nav-anim-item nav-link text-[11px] tracking-[0.1em] font-medium uppercase relative group" :class="{ 'active-nav': activeSection === 'map' }">
          Peta
          <span class="absolute -bottom-1 h-[2px] left-1/2 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                :class="activeSection === 'map' ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'" 
                style="background: #1479A6;"></span>
        </a>
        <a href="#watchlist" class="nav-anim-item nav-link text-[11px] tracking-[0.1em] font-medium uppercase relative group" :class="{ 'active-nav': activeSection === 'watchlist' }">
          Pantauan Saya
          <span class="absolute -bottom-1 right-0 h-[2px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" 
                :class="activeSection === 'watchlist' ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'" 
                style="background: #1479A6;"></span>
        </a>
      </nav>

      <!-- Right Controls -->
      <div class="flex items-center gap-2 sm:gap-3 shrink-0">
        <!-- Search -->
        <button
          class="nav-anim-item search-btn group hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border bg-transparent transition-colors"
          style="border-color: var(--border);"
          @click="emit('openSearch')"
        >
          <span class="text-xs font-medium tracking-wide uppercase group-hover:text-[#1479A6] transition-colors" style="color: var(--text-secondary);">⌕ Search</span>
          <kbd class="text-[9px] tracking-widest font-mono px-1.5 py-0.5 rounded border opacity-50" style="color: var(--text-muted); border-color: var(--border);">⌘K</kbd>
        </button>

        <button
          class="nav-anim-item sm:hidden w-9 h-9 flex items-center justify-center rounded-full bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          style="color: #64748B;"
          @click="emit('openSearch')"
        >
          <span class="text-sm">⌕</span>
        </button>

        <div class="w-px h-3 bg-black/10 dark:bg-white/10 hidden sm:block"></div>

        <!-- Theme Toggle -->
        <button
          class="nav-anim-item theme-toggle w-9 h-9 flex items-center justify-center rounded-full bg-transparent transition-colors relative"
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
        <div class="nav-anim-item hidden sm:flex items-center gap-1.5 pl-1 pr-2">
          <span class="live-dot w-1.5 h-1.5 rounded-full" style="background: #F28C28;"></span>
          <span class="live-text text-[9px] tracking-[0.2em] font-bold uppercase pt-px" style="color: #F28C28;">Live</span>
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
        <a href="#cameras" class="text-xs tracking-[0.2em] font-semibold uppercase" :class="activeSection === 'cameras' ? 'text-[var(--primary)]' : 'text-[var(--text)]'" @click="closeMobileMenu">Kamera</a>
        <a href="#map" class="text-xs tracking-[0.2em] font-semibold uppercase" :class="activeSection === 'map' ? 'text-[var(--primary)]' : 'text-[var(--text)]'" @click="closeMobileMenu">Peta</a>
        <a href="#watchlist" class="text-xs tracking-[0.2em] font-semibold uppercase" :class="activeSection === 'watchlist' ? 'text-[var(--primary)]' : 'text-[var(--text)]'" @click="closeMobileMenu">Pantauan Saya</a>
      </nav>
      <div class="pt-6 border-t flex items-center justify-between" style="border-color: var(--border);">
        <div class="flex items-center h-full">
          <a href="#" class="flex items-center gap-3" aria-label="Beranda">
            <img src="/Kujang.webp" alt="Bogor Live Logo" class="w-7 h-7 object-contain" />
            <span class="text-[14px] font-[900] tracking-tighter uppercase font-['Plus_Jakarta_Sans']">
              <span style="color: var(--primary);">BOGOR</span>
              <span style="color: var(--text);"> LIVE</span><span style="color: var(--accent);">.</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.nav-container {
  width: 100%;
  max-width: 1440px;
}

.nav-top {
  height: 56px;
  background: transparent;
  border: 1px solid transparent;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
@media (min-width: 640px) {
  .nav-top {
    height: 64px;
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

.nav-scrolled {
  height: 56px;
  background: rgba(20, 121, 166, 0.95);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  box-shadow: 0 8px 32px -4px rgba(20, 121, 166, 0.35);
}
@media (min-width: 640px) {
  .nav-scrolled {
    height: 64px;
    padding-left: 1.5rem;
    padding-right: 1.25rem;
  }
}

:global([data-theme="dark"]) .nav-scrolled {
  background: rgba(16, 98, 136, 0.95);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.4);
}

.nav-scrolled .nav-logo-bogor {
  color: #FFFFFF !important;
}

.nav-scrolled .nav-logo-live {
  color: #FFFFFF !important;
}

.nav-scrolled .live-dot {
  background: #F28C28 !important;
}

.nav-scrolled .live-text {
  color: #F28C28 !important;
}

.nav-scrolled .nav-link {
  color: rgba(255, 255, 255, 0.88) !important;
}

.nav-scrolled .nav-link.active-nav {
  color: #FFFFFF !important;
  font-weight: 700;
}

.nav-scrolled .nav-link:hover {
  color: #FFFFFF !important;
}

.nav-scrolled .nav-link span {
  background: #FFFFFF !important;
}

.nav-scrolled .search-btn {
  border-color: rgba(255, 255, 255, 0.3) !important;
}

.nav-scrolled .search-btn span {
  color: #FFFFFF !important;
}

.nav-scrolled .search-btn kbd {
  color: rgba(255, 255, 255, 0.9) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
}

.nav-scrolled .theme-toggle {
  color: #FFFFFF !important;
}

.nav-scrolled .theme-toggle:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  color: #FFFFFF !important;
}

.nav-link {
  color: var(--text-secondary);
  transition: color 400ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-block;
}
.nav-link.active-nav {
  color: var(--text);
  font-weight: 700;
}
.nav-link:hover {
  color: var(--primary);
  opacity: 0.9;
}

.search-btn:hover span:first-child {
  color: var(--primary) !important;
}

.theme-toggle:hover {
  background: var(--surface-elevated);
  color: var(--primary) !important;
}

.search-btn:hover {
  border-color: var(--primary) !important;
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
