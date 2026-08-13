<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { Camera } from '@/types/camera'
import { useHLS } from '@/composables/useHLS'
import { formatId, CATEGORY_COLORS } from '@/lib/utils'

const props = defineProps<{
  open: boolean
  camera: Camera | null
}>()

const emit = defineEmits<{
  close: []
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const { init, destroy, loading, error } = useHLS()
const fullscreen = ref(false)

watch(() => props.open, async (open) => {
  if (open && props.camera) {
    await nextTick()
    document.body.classList.add('no-scroll')
    if (videoRef.value) {
      init(videoRef.value, props.camera.stream)
    }
  } else {
    document.body.classList.remove('no-scroll')
    destroy()
    fullscreen.value = false
  }
})

function retry() {
  if (props.camera && videoRef.value) {
    init(videoRef.value, props.camera.stream)
  }
}

function reload() {
  retry()
}

function toggleFullscreen() {
  if (!containerRef.value) return
  if (!document.fullscreenElement) {
    containerRef.value.requestFullscreen()
    fullscreen.value = true
  } else {
    document.exitFullscreen()
    fullscreen.value = false
  }
}

function onBackdropClick(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('.viewer-panel')) return
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out-expo"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open && camera"
        class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-6"
        @click="onBackdropClick"
      >
        <div
          ref="containerRef"
          class="viewer-panel relative w-full max-w-6xl bg-[#0C1017] rounded-0 sm:rounded-2xl border border-white/[0.06] overflow-hidden flex flex-col max-h-full"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/[0.06]">
            <div class="flex items-center gap-3">
              <button
                class="text-text-secondary hover:text-white transition-colors text-sm cursor-pointer"
                @click="emit('close')"
              >
                ← Back
              </button>
              <div class="hidden sm:block h-4 w-px bg-white/[0.06]"></div>
              <div class="hidden sm:block">
                <h2 class="text-sm font-medium text-white">{{ camera.name }}</h2>
                <p class="text-[11px] text-text-muted">{{ formatId(camera.id) }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/40 border border-white/[0.04]">
                <span class="w-1.5 h-1.5 rounded-full bg-accent" :class="{ 'animate-pulse': !error }"></span>
                <span class="text-[10px] tracking-wider text-accent/80 uppercase font-medium">{{ error ? 'Offline' : 'Live' }}</span>
              </div>

              <span
                class="hidden sm:inline-flex px-2 py-1 rounded-md text-[10px] tracking-wider font-medium bg-black/40 border border-white/[0.04]"
                :style="{ color: CATEGORY_COLORS[camera.category] }"
              >
                {{ camera.category }}
              </span>

              <div class="ml-2 flex items-center gap-1.5">
                <button
                  class="px-2.5 py-1.5 rounded-lg text-xs text-text-secondary hover:text-white border border-white/[0.06] hover:border-white/15 transition-all cursor-pointer"
                  @click="reload"
                  title="Reload stream"
                >
                  ↻
                </button>
                <button
                  class="px-2.5 py-1.5 rounded-lg text-xs text-text-secondary hover:text-white border border-white/[0.06] hover:border-white/15 transition-all cursor-pointer"
                  @click="toggleFullscreen"
                  title="Fullscreen"
                >
                  ⛶
                </button>
              </div>
            </div>
          </div>

          <!-- Video -->
          <div class="relative bg-black flex-1 flex items-center justify-center">
            <video
              ref="videoRef"
              class="w-full h-full max-h-[80vh] object-contain"
              controls
              controlslist="nodownload"
              disablepictureinpicture
              :style="{ cursor: 'default' }"
            ></video>

            <!-- Loading -->
            <div
              v-if="loading"
              class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60"
            >
              <div class="w-6 h-6 border-2 border-white/10 border-t-accent rounded-full animate-spin"></div>
              <p class="text-xs text-text-muted tracking-wider">Loading stream...</p>
            </div>

            <!-- Error -->
            <div
              v-if="error"
              class="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60"
            >
              <div class="w-12 h-12 rounded-full border border-danger/20 bg-danger/5 flex items-center justify-center">
                <span class="text-danger text-xl">!</span>
              </div>
              <p class="text-sm text-text-secondary">Stream unavailable</p>
              <p class="text-xs text-text-muted">This camera is currently offline</p>
              <button
                class="px-4 py-2 rounded-lg border border-accent/30 text-accent text-xs hover:bg-accent/10 transition-all cursor-pointer"
                @click="retry"
              >
                Retry Stream
              </button>
            </div>
          </div>

          <!-- Info bar -->
          <div class="px-4 sm:px-6 py-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-text-muted">
            <div class="flex items-center gap-4">
              <span class="tracking-wider">BOGOR</span>
              <span class="w-3 h-px bg-white/[0.06]"></span>
              <span class="tracking-wider">KOTA BOGOR</span>
              <span class="w-3 h-px bg-white/[0.06]"></span>
              <span>{{ camera.category }}</span>
            </div>
            <span class="hidden sm:inline tracking-wider">Source: BSW Kota Bogor</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
