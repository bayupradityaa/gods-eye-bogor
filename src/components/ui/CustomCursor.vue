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
      isHovering ? 'cursor-hover' : 'cursor-dot',
    ]"
    :style="{ left: `${x}px`, top: `${y}px` }"
  >
    <div
      v-if="isHovering"
      class="absolute inset-0 flex items-center justify-center text-[9px] tracking-widest uppercase font-medium"
      :style="{ color: 'var(--cursor-hover-text)' }"
    >
      View
    </div>
  </div>
</template>

<style scoped>
.cursor-dot {
  width: 8px;
  height: 8px;
  margin-left: -4px;
  margin-top: -4px;
  background: var(--accent);
  border-radius: 50%;
}

.cursor-hover {
  width: 48px;
  height: 48px;
  margin-left: -24px;
  margin-top: -24px;
  border: 1px solid var(--cursor-hover-border);
  background: var(--cursor-hover-bg);
  border-radius: 50%;
}
</style>
