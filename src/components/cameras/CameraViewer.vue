<script setup lang="ts">
import { ref, watch, onUnmounted, nextTick } from 'vue'
import Hls from 'hls.js'
import type { Camera } from '@/types/camera'

const props = defineProps<{
  camera: Camera | null
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const hls = ref<Hls | null>(null)
const isPlaying = ref(false)
const isLoading = ref(true)
const hasError = ref(false)

function initStream() {
  if (!props.camera?.stream || !videoRef.value) return

  isLoading.value = true
  hasError.value = false

  if (Hls.isSupported()) {
    if (hls.value) {
      hls.value.destroy()
    }
    const newHls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90,
    })
    
    newHls.loadSource(props.camera.stream)
    newHls.attachMedia(videoRef.value)
    
    newHls.on(Hls.Events.MANIFEST_PARSED, () => {
      videoRef.value?.play().catch(() => {
        isPlaying.value = false
      })
    })

    newHls.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) {
        hasError.value = true
        isLoading.value = false
      }
    })

    hls.value = newHls
  } else if (videoRef.value.canPlayType('application/vnd.apple.mpegurl')) {
    videoRef.value.src = props.camera.stream
    videoRef.value.addEventListener('loadedmetadata', () => {
      videoRef.value?.play().catch(() => {
        isPlaying.value = false
      })
    })
  }
}

function cleanup() {
  if (hls.value) {
    hls.value.destroy()
    hls.value = null
  }
  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.removeAttribute('src')
    videoRef.value.load()
  }
  isPlaying.value = false
  isLoading.value = true
  hasError.value = false
}

function closeViewer() {
  emit('close')
}

// Fullscreen logic
function toggleFullscreen() {
  if (!videoRef.value) return
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    videoRef.value.requestFullscreen().catch((err) => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`)
    })
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      document.body.classList.add('no-scroll')
      await nextTick()
      initStream()
    } else {
      document.body.classList.remove('no-scroll')
      cleanup()
    }
  }
)

onUnmounted(() => {
  document.body.classList.remove('no-scroll')
  cleanup()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="viewer">
      <div
        v-if="open && camera"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-12"
      >
        <!-- Cinematic Backdrop -->
        <div class="absolute inset-0 bg-[#07090D]/95 backdrop-blur-xl" @click="closeViewer"></div>

        <!-- Viewer Container -->
        <div 
          class="relative w-full max-w-6xl flex flex-col bg-black rounded-2xl sm:rounded-[24px] overflow-hidden shadow-2xl border border-white/10"
          style="max-height: calc(100vh - 48px);"
        >
          
          <!-- Top Bar (Minimal) -->
          <div class="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-md backdrop-blur-md bg-black/40 border border-white/10">
                <span class="w-2 h-2 rounded-full animate-pulse bg-green-500"></span>
                <span class="text-[10px] tracking-[0.2em] uppercase font-bold text-white">LIVE</span>
              </div>
              <p class="text-[10px] tracking-widest text-white/50 uppercase tabular-nums hidden sm:block">
                CAM {{ String(camera.id).padStart(3, '0') }}
              </p>
            </div>
            
            <button
              class="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 border border-white/10 text-white/70 hover:text-white transition-all pointer-events-auto backdrop-blur-md"
              @click="closeViewer"
            >
              <span class="text-xl leading-none">✕</span>
            </button>
          </div>

          <!-- Video Area -->
          <div class="relative w-full aspect-video bg-[#0C1017]">
            <video
              ref="videoRef"
              class="w-full h-full object-contain"
              playsinline
              muted
              @playing="isLoading = false; isPlaying = true"
              @waiting="isLoading = true"
              @error="hasError = true"
            ></video>

            <!-- Loading State -->
            <div
              v-if="isLoading && !hasError"
              class="absolute inset-0 flex flex-col items-center justify-center bg-[#0C1017]"
            >
              <div class="w-8 h-8 border-2 border-white/20 border-t-green-500 rounded-full animate-spin mb-4"></div>
              <p class="text-[10px] tracking-[0.2em] uppercase text-white/50">Connecting to stream...</p>
            </div>

            <!-- Error State -->
            <div
              v-if="hasError"
              class="absolute inset-0 flex flex-col items-center justify-center bg-[#0C1017]"
            >
              <span class="text-3xl mb-3 opacity-30 text-red-500">⚠</span>
              <p class="text-xs tracking-wider text-white">Stream unavailable</p>
              <button
                class="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] tracking-widest uppercase text-white transition-colors border border-white/10"
                @click="initStream"
              >
                Retry Connection
              </button>
            </div>
          </div>

          <!-- Bottom Bar (Minimal) -->
          <div class="absolute bottom-0 inset-x-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
            <h2 class="text-lg sm:text-2xl font-medium text-white tracking-tight drop-shadow-md">
              {{ camera.name }}
            </h2>

            <div class="flex items-center gap-2 pointer-events-auto">
              <button
                class="p-2.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-white/70 hover:text-white transition-all backdrop-blur-md"
                title="Reload Stream"
                @click="initStream"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path></svg>
              </button>
              <button
                class="p-2.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-white/70 hover:text-white transition-all backdrop-blur-md"
                title="Fullscreen"
                @click="toggleFullscreen"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.viewer-enter-active,
.viewer-leave-active {
  transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
}

.viewer-enter-from,
.viewer-leave-to {
  opacity: 0;
}

.viewer-enter-from > div:last-child {
  transform: scale(0.96) translateY(10px);
}
.viewer-leave-to > div:last-child {
  transform: scale(0.96) translateY(10px);
}
</style>
