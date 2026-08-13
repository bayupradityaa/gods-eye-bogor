<script setup lang="ts">
import type { Camera } from '@/types/camera'
import { formatId, CATEGORY_COLORS } from '@/lib/utils'

defineProps<{
  camera: Camera
}>()

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <div
    class="group relative rounded-xl border border-white/[0.06] bg-surface overflow-hidden transition-all duration-300 hover:border-white/15 hover:bg-surface-elevated hover:-translate-y-0.5 card-interactive cursor-pointer"
    @click="emit('select')"
  >
    <!-- Preview Area -->
    <div class="relative aspect-video bg-gradient-to-br from-[#0C1017] to-[#07090D] overflow-hidden">
      <!-- Camera icon background -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-12 h-12 rounded-full border border-white/[0.04] bg-white/[0.02] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
          <svg class="w-5 h-5 text-white/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <!-- Top: Status -->
      <div class="absolute top-3 left-3 right-3 flex items-center justify-between">
        <div class="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm border border-white/[0.04]">
          <span class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
          <span class="text-[9px] tracking-wider text-accent/80 font-medium uppercase">Live</span>
        </div>

        <!-- Category tag -->
        <span
          class="px-2 py-1 rounded-md text-[9px] tracking-wider font-medium uppercase bg-black/40 backdrop-blur-sm border border-white/[0.04]"
          :style="{ color: CATEGORY_COLORS[camera.category] }"
        >
          {{ camera.category }}
        </span>
      </div>

      <!-- Hover arrow -->
      <div class="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-accent/90 text-black flex items-center justify-center opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
        <span class="text-sm leading-none">→</span>
      </div>

      <!-- Hover overlay gradient -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
    </div>

    <!-- Info -->
    <div class="p-3.5">
      <div class="flex items-start justify-between gap-2">
        <div>
          <h3 class="text-sm font-medium text-white transition-colors group-hover:text-accent leading-snug">
            {{ camera.name }}
          </h3>
          <p class="text-[11px] text-text-muted mt-0.5 tracking-wider">
            {{ formatId(camera.id) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
