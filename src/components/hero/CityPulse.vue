<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'

const dots = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  delay: Math.random() * 3,
  size: Math.random() > 0.7 ? 3 : 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
}))

onMounted(() => {
  gsap.from('.pulse-section .pulse-content', {
    scrollTrigger: { trigger: '.pulse-section', start: 'top 85%' },
    opacity: 0,
    y: 30,
    duration: 0.6,
    ease: 'power3.out',
  })
})
</script>

<template>
  <section id="pulse" class="pulse-section relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-[#07090D] via-[#0C1017]/50 to-[#07090D]">
      <!-- Dots grid -->
      <div class="absolute inset-0 opacity-[0.04]">
        <div
          v-for="dot in dots"
          :key="dot.id"
          class="absolute rounded-full bg-accent animate-pulse"
          :style="{
            left: dot.x + '%',
            top: dot.y + '%',
            width: dot.size + 'px',
            height: dot.size + 'px',
            animationDelay: dot.delay + 's',
            animationDuration: (2 + dot.delay) + 's',
          }"
        ></div>
      </div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto pulse-content">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <p class="text-xs tracking-[0.2em] uppercase text-accent mb-3 font-medium">City Pulse</p>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight">
          Denyut Kota Bogor
        </h2>
        <p class="mt-4 text-text-secondary text-sm sm:text-base leading-relaxed">
          Jelajahi denyut Kota Bogor secara real-time. Jaringan kamera publik yang tersebar di seluruh penjuru kota.
        </p>
      </div>

      <!-- Visual grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
        <div v-for="cat in ['Jalan', 'Simpang', 'Taman', 'Pasar', 'Lapangan', 'Gerbang', 'Kantor', 'Lainnya']" :key="cat"
          class="pulse-item rounded-xl border border-white/[0.06] bg-surface/50 backdrop-blur-sm p-5 text-center transition-all duration-300 hover:border-white/10 hover:bg-surface">
          <div class="w-2 h-2 rounded-full mx-auto mb-3 animate-pulse" :class="{
            'bg-[#22D3EE]': cat === 'Jalan',
            'bg-[#4ADE80]': cat === 'Simpang',
            'bg-[#FBBF24]': cat === 'Taman',
            'bg-[#FB923C]': cat === 'Pasar',
            'bg-[#A78BFA]': cat === 'Lapangan',
            'bg-[#F472B6]': cat === 'Gerbang',
            'bg-[#60A5FA]': cat === 'Kantor',
            'bg-[#9AA4B2]': cat === 'Lainnya',
          }"></div>
          <p class="text-xs font-medium text-white mb-0.5 tracking-wide">{{ cat }}</p>
          <p class="text-[10px] text-text-muted tracking-wider uppercase">Category</p>
        </div>
      </div>
    </div>
  </section>
</template>
