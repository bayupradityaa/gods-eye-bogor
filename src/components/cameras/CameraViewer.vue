<script setup lang="ts">
import { ref, watch, onUnmounted, nextTick } from 'vue'
import Hls from 'hls.js'
import type { Camera } from '@/types/camera'
import { X, Play, Pause, Volume2, VolumeX, Maximize, RotateCw, Star, MapPin } from '@lucide/vue'
import { useCameraPreferences } from '@/composables/useCameraPreferences'

const props = defineProps<{
  camera: Camera | null
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { isFavorite, toggleFavorite } = useCameraPreferences()

const videoRef = ref<HTMLVideoElement | null>(null)
const hls = ref<Hls | null>(null)
const isPlaying = ref(false)
const isMuted = ref(true)
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

function togglePlay() {
  if (!videoRef.value) return
  if (isPlaying.value) {
    videoRef.value.pause()
  } else {
    videoRef.value.play().catch(() => {})
  }
}

function toggleMute() {
  if (!videoRef.value) return
  videoRef.value.muted = !videoRef.value.muted
  isMuted.value = videoRef.value.muted
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
        class="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 lg:p-8"
      >
        <!-- Cinematic Backdrop -->
        <div class="absolute inset-0 bg-[#05080C]/70 backdrop-blur-[8px]" @click="closeViewer"></div>

        <!-- Viewer Dialog Container -->
        <div 
          class="relative w-full max-w-7xl flex flex-col bg-[#0F1117] rounded-[20px] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] border border-[rgba(255,255,255,0.08)] text-white z-10"
          style="max-height: calc(100vh - 32px);"
        >
          <!-- Header -->
          <div class="px-5 sm:px-6 py-4 flex items-start justify-between gap-4 shrink-0">
            <div class="flex flex-col gap-1.5 min-w-0 pt-1">
              <div class="flex items-center gap-3">
                <h3 class="text-[18px] sm:text-[22px] font-semibold text-[#F9FAFB] font-['Manrope'] truncate leading-tight">
                  {{ camera.name }}
                </h3>
                <div class="flex items-center gap-1.5 shrink-0">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#F28C28] animate-pulse"></span>
                  <span class="text-[10px] sm:text-[11px] font-semibold tracking-[0.08em] text-[#F28C28] uppercase font-['Plus_Jakarta_Sans']">LIVE</span>
                </div>
              </div>

            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button
                class="btn-icon flex items-center justify-center w-[44px] h-[44px] rounded-full border border-[rgba(255,255,255,0.08)] text-[#98A2B3]"
                :class="isFavorite(camera.id) ? 'text-[#F28C28] bg-[rgba(255,255,255,0.05)]' : 'bg-transparent'"
                :title="isFavorite(camera.id) ? 'Hapus dari Favorit' : 'Tambah ke Favorit'"
                :aria-label="isFavorite(camera.id) ? 'Hapus dari Favorit' : 'Tambah ke Favorit'"
                @click="toggleFavorite(camera.id)"
              >
                <Star :size="18" :stroke-width="isFavorite(camera.id) ? 2.5 : 2" :fill="isFavorite(camera.id) ? 'currentColor' : 'none'" />
              </button>
              <button 
                class="btn-icon flex items-center justify-center w-[44px] h-[44px] rounded-full bg-transparent text-[#98A2B3]"
                title="Tutup"
                aria-label="Tutup"
                @click="closeViewer"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Video Screen Area -->
          <div class="relative w-full flex-1 min-h-[200px] bg-[#080B11] flex items-center justify-center overflow-hidden">
            <video
              ref="videoRef"
              class="w-full h-full max-h-[65vh] object-contain"
              playsinline
              :muted="isMuted"
              @playing="isLoading = false; isPlaying = true"
              @pause="isPlaying = false"
              @waiting="isLoading = true"
              @error="hasError = true"
            ></video>

            <!-- Loading State -->
            <div
              v-if="isLoading && !hasError"
              class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#080B11]/90"
            >
              <div class="w-8 h-8 border-2 border-[#1479A6]/20 border-t-[#1479A6] rounded-full animate-spin mb-3"></div>
              <p class="text-[11px] tracking-widest font-['Plus_Jakarta_Sans'] uppercase text-[#98A2B3]">Menghubungkan...</p>
            </div>

            <!-- Error State -->
            <div
              v-if="hasError"
              class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#080B11]/95"
            >
              <span class="text-3xl mb-2 text-[#98A2B3]/50">⚠</span>
              <p class="text-[13px] font-semibold tracking-wide font-['Plus_Jakarta_Sans'] text-[#F9FAFB]">Sinyal Kamera Tidak Tersedia</p>
              <p class="text-[11px] text-[#98A2B3] font-['Plus_Jakarta_Sans'] mt-1 mb-4">Pastikan koneksi internet stabil atau coba muat ulang stream.</p>
              <button
                class="flex items-center gap-2 h-10 px-4 rounded-lg bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.10)] text-[#D0D5DD] hover:text-white transition-colors text-[11px] font-semibold tracking-wider uppercase font-['Plus_Jakarta_Sans']"
                @click="initStream"
              >
                <RotateCw class="w-3.5 h-3.5" />
                Muat Ulang
              </button>
            </div>
          </div>

          <!-- Dedicated Bottom Toolbar & Metadata Panel -->
          <div class="px-5 sm:px-6 py-4 bg-[#0F1117] border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between gap-4 shrink-0">
            <!-- Group A - Playback -->
            <div class="flex items-center gap-2">
              <button
                class="btn-control flex items-center justify-center w-[40px] h-[40px] rounded-lg bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[#D0D5DD]"
                :title="isPlaying ? 'Pause' : 'Play'"
                :aria-label="isPlaying ? 'Pause' : 'Play'"
                @click="togglePlay"
              >
                <Pause v-if="isPlaying" class="w-4 h-4 fill-current" />
                <Play v-else class="w-4 h-4 fill-current ml-0.5" />
              </button>
              <button
                class="btn-control flex items-center justify-center w-[40px] h-[40px] rounded-lg bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[#D0D5DD]"
                :title="isMuted ? 'Unmute' : 'Mute'"
                :aria-label="isMuted ? 'Unmute' : 'Mute'"
                @click="toggleMute"
              >
                <VolumeX v-if="isMuted" class="w-4 h-4" />
                <Volume2 v-else class="w-4 h-4" />
              </button>
              <button
                class="btn-control flex items-center justify-center w-[40px] h-[40px] rounded-lg bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[#D0D5DD]"
                title="Muat Ulang Stream"
                aria-label="Muat Ulang Stream"
                @click="initStream"
              >
                <RotateCw class="w-4 h-4" />
              </button>
            </div>

            <!-- Group B - Information -->
            <div class="hidden sm:flex flex-col items-center gap-1 font-['Plus_Jakarta_Sans']">
              <div class="flex items-center gap-1.5 text-[11px] text-[#98A2B3]">
                <MapPin class="w-3.5 h-3.5 text-[#1479A6]" />
                <span>06°35′S 106°48′E</span>
              </div>
              <div class="text-[11px] text-[#98A2B3] font-medium tracking-wide">
                1080p · LIVE FEED
              </div>
            </div>

            <!-- Group C - Action -->
            <div class="flex items-center gap-2">
              <button
                class="btn-control flex items-center justify-center w-[40px] h-[40px] rounded-lg bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[#D0D5DD]"
                title="Layar Penuh"
                aria-label="Layar Penuh"
                @click="toggleFullscreen"
              >
                <Maximize class="w-4 h-4" />
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
  transition: all 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

.viewer-enter-from,
.viewer-leave-to {
  opacity: 0;
}

.viewer-enter-from > div:last-child {
  transform: scale(0.98);
}
.viewer-leave-to > div:last-child {
  transform: scale(0.98);
}

.btn-icon {
  transition: all 200ms cubic-bezier(0.22, 1, 0.36, 1);
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #FFFFFF;
  transform: scale(1.05);
}

.btn-icon:active {
  transform: scale(0.95);
}

.btn-control {
  transition: all 200ms cubic-bezier(0.22, 1, 0.36, 1);
}

.btn-control:hover {
  background: rgba(255, 255, 255, 0.10);
  color: #FFFFFF;
  transform: scale(1.08);
}

.btn-control:active {
  transform: scale(0.95);
}
</style>
