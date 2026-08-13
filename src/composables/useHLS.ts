import { ref, onUnmounted } from 'vue'
import Hls from 'hls.js'

export function useHLS() {
  const hlsInstance = ref<Hls | null>(null)
  const loading = ref(true)
  const error = ref(false)

  function init(videoEl: HTMLVideoElement, streamUrl: string) {
    destroy()
    loading.value = true
    error.value = false

    if (Hls.isSupported()) {
      const hls = new Hls()
      hlsInstance.value = hls
      hls.loadSource(streamUrl)
      hls.attachMedia(videoEl)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        loading.value = false
        videoEl.play().catch(() => {})
      })

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          loading.value = false
          error.value = true
        }
      })
    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = streamUrl
      videoEl.addEventListener('loadedmetadata', () => {
        loading.value = false
        videoEl.play().catch(() => {})
      })
      videoEl.addEventListener('error', () => {
        loading.value = false
        error.value = true
      })
    } else {
      loading.value = false
      error.value = true
    }
  }

  function destroy() {
    if (hlsInstance.value) {
      hlsInstance.value.destroy()
      hlsInstance.value = null
    }
    loading.value = true
    error.value = false
  }

  onUnmounted(destroy)

  return { init, destroy, loading, error }
}
