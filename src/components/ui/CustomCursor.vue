<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)
const isHovering = ref(false)
const isVisible = ref(false)

function onMouseMove(e: MouseEvent) {
  x.value = e.clientX
  y.value = e.clientY
  if (!isVisible.value) isVisible.value = true
}

function onMouseOver(e: MouseEvent) {
  const target = (e.target as HTMLElement)
  if (target.closest('button, a, [data-hoverable], .cursor-pointer, .card-interactive')) {
    isHovering.value = true
  }
}

function onMouseOut() {
  isHovering.value = false
}

onMounted(() => {
  if (!window.matchMedia('(pointer: coarse)').matches) {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseover', onMouseOver)
  document.removeEventListener('mouseout', onMouseOut)
})
</script>

<template>
  <div
    v-if="isVisible"
    class="fixed pointer-events-none z-[9999] transition-all duration-[200ms]"
    :class="[
      isHovering ? 'w-12 h-12 -ml-6 -mt-6 border border-white/20 bg-white/5 rounded-full' : 'w-2 h-2 -ml-1 -mt-1 bg-accent rounded-full',
    ]"
    :style="{ left: `${x}px`, top: `${y}px` }"
  >
    <div
      v-if="isHovering"
      class="absolute inset-0 flex items-center justify-center text-[9px] text-white/60 tracking-widest uppercase font-medium"
    >
      View
    </div>
  </div>
</template>
