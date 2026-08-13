<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const count1 = ref({ val: 0 })
const count2 = ref({ val: 0 })
const count4 = ref({ val: 0 })

const display1 = ref('0')
const display2 = ref('00')
const display4 = ref('00')

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  if (!prefersReducedMotion) {
    gsap.from('.stats-section .stat-item', {
      scrollTrigger: { 
        trigger: '.stats-section', 
        start: 'top 90%',
        once: true,
        onEnter: () => {
          gsap.to(count1.value, { 
            val: 85, 
            duration: 2, 
            ease: 'power2.out', 
            onUpdate: () => display1.value = Math.floor(count1.value.val).toString() 
          })
          gsap.to(count2.value, { 
            val: 8, 
            duration: 2, 
            ease: 'power2.out', 
            onUpdate: () => display2.value = Math.floor(count2.value.val).toString().padStart(2, '0') 
          })
          gsap.to(count4.value, { 
            val: 6, 
            duration: 2, 
            ease: 'power2.out', 
            onUpdate: () => display4.value = Math.floor(count4.value.val).toString().padStart(2, '0') 
          })
        }
      },
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
    })
  } else {
    display1.value = '85'
    display2.value = '08'
    display4.value = '06'
  }
})
</script>

<template>
  <section class="stats-section relative z-10 layout-container py-10 sm:py-16">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
      <!-- Stat 1 -->
      <div class="stat-item flex flex-col items-center text-center cursor-default">
        <p class="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter tabular-nums mb-3" style="color: var(--primary);">{{ display1 }}</p>
        <div class="h-px w-full max-w-[40px] mb-3" style="background: var(--border-strong);"></div>
        <p class="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium" style="color: var(--text-secondary);">Kamera Publik</p>
      </div>
      
      <!-- Stat 2 -->
      <div class="stat-item flex flex-col items-center text-center cursor-default">
        <p class="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter tabular-nums mb-3" style="color: var(--primary);">{{ display2 }}</p>
        <div class="h-px w-full max-w-[40px] mb-3" style="background: var(--border-strong);"></div>
        <p class="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium" style="color: var(--text-secondary);">Titik Lokasi</p>
      </div>

      <!-- Stat 3 -->
      <div class="stat-item flex flex-col items-center text-center cursor-default">
        <p class="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter tabular-nums mb-3" style="color: #F28C28;">24/7</p>
        <div class="h-px w-full max-w-[40px] mb-3" style="background: var(--border-strong);"></div>
        <p class="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium" style="color: var(--text-secondary);">Akses Langsung</p>
      </div>

      <!-- Stat 4 -->
      <div class="stat-item flex flex-col items-center text-center cursor-default">
        <p class="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter tabular-nums mb-3" style="color: var(--accent);">{{ display4 }}</p>
        <div class="h-px w-full max-w-[40px] mb-3" style="background: var(--border-strong);"></div>
        <p class="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium" style="color: var(--text-secondary);">Kategori</p>
      </div>
    </div>
  </section>
</template>
