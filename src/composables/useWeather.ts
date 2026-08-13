import { ref } from 'vue'
import type { WeatherData, BMKGResponse, BMKGCuaca, WeatherForecast } from '@/types/weather'
import { formatWeatherTime } from '@/lib/weather'

const CACHE_TTL_MS = 3 * 60 * 60 * 1000 // 3 hours

interface CacheData {
  data: WeatherData
  timestamp: number
  analysisDate: string
}

// Global state to persist between component mount/unmount if needed
const weather = ref<WeatherData | null>(null)
const loading = ref<boolean>(false)
const error = ref<string | null>(null)
const isUsingCache = ref<boolean>(false)
let currentRequestId = 0

export function useWeather() {
  
  async function fetchWeather(adm4?: string) {
    if (!adm4) {
      weather.value = null
      error.value = "Weather unavailable"
      loading.value = false
      return
    }

    const requestId = ++currentRequestId
    loading.value = true
    error.value = null
    isUsingCache.value = false
    
    const cacheKey = `weather-cache:${adm4}`

    try {
      // 1. Check Cache First
      const cachedStr = localStorage.getItem(cacheKey)
      if (cachedStr) {
        try {
          const cached: CacheData = JSON.parse(cachedStr)
          const now = Date.now()
          
          if (now - cached.timestamp < CACHE_TTL_MS) {
            weather.value = cached.data
            isUsingCache.value = true
            loading.value = false
            return // Cache is still valid
          }
        } catch (e) {
          console.warn('Invalid cache data', e)
          localStorage.removeItem(cacheKey)
        }
      }

      // 2. Fetch fresh data
      const res = await fetch(`https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${adm4}`)
      
      // Stale request protection
      if (requestId !== currentRequestId) return
      
      if (!res.ok) {
        throw new Error(`Failed to fetch weather: ${res.statusText}`)
      }
      
      const rawData: BMKGResponse = await res.json()
      
      // Stale request protection again after parsing
      if (requestId !== currentRequestId) return
      
      // 3. Normalize Data
      if (rawData.data && rawData.data.length > 0 && rawData.data[0].cuaca) {
        const locationData = rawData.data[0].lokasi
        
        // Flatten all cuaca arrays
        const allCuaca: BMKGCuaca[] = []
        rawData.data[0].cuaca.forEach(day => {
          allCuaca.push(...day)
        })
        
        // Sort by datetime just to be safe
        allCuaca.sort((a, b) => new Date(a.utc_datetime).getTime() - new Date(b.utc_datetime).getTime())
        
        // Find the current or next forecast based on current time
        const nowUtc = new Date().getTime()
        let currentIndex = 0
        
        for (let i = 0; i < allCuaca.length; i++) {
          const itemTime = new Date(allCuaca[i].utc_datetime).getTime()
          // find the first item that is in the future or very recently past (within 3 hours)
          if (itemTime > nowUtc - (3 * 60 * 60 * 1000)) {
            currentIndex = i
            break
          }
        }
        
        const currentData = allCuaca[currentIndex]
        if (!currentData) throw new Error("No current weather data found")

        // Prepare forecasts (next 5 items)
        const forecastItems = allCuaca.slice(currentIndex + 1, currentIndex + 6)
        const forecast: WeatherForecast[] = forecastItems.map(item => ({
          datetime: item.utc_datetime,
          localDatetime: item.local_datetime,
          temperature: item.t,
          weatherCode: item.weather,
          weatherDescription: item.weather_desc
        }))
        
        const normalized: WeatherData = {
          location: locationData?.desa || locationData?.kecamatan || "Bogor",
          city: locationData?.kotkab || "Kota Bogor, Jawa Barat",
          sourceArea: `Data BMKG`,
          temperature: currentData.t,
          weatherCode: currentData.weather,
          weatherDescription: currentData.weather_desc,
          humidity: currentData.hu,
          windSpeed: currentData.ws,
          visibility: currentData.vs_text,
          forecast: forecast,
          updatedAt: new Date().toISOString()
        }
        
        // 4. Update State and Cache
        weather.value = normalized
        isUsingCache.value = false // Fresh data
        
        localStorage.setItem(cacheKey, JSON.stringify({
          data: normalized,
          timestamp: Date.now(),
          analysisDate: currentData.analysis_date
        } as CacheData))
        
      } else {
        throw new Error("Invalid response format from BMKG")
      }
      
    } catch (e: any) {
      if (requestId !== currentRequestId) return
      console.error('Weather fetch error:', e)
      weather.value = null // clear stale data on error
      error.value = e.message || 'Cuaca tidak tersedia.'
    } finally {
      if (requestId === currentRequestId) {
        loading.value = false
      }
    }
  }

  return {
    weather,
    loading,
    error,
    isUsingCache,
    fetchWeather
  }
}
