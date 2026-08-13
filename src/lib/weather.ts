import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  CloudFog, 
  Wind,
  Moon,
  CloudMoon
} from '@lucide/vue';

// BMKG Weather Codes based on standard mapping
// 0 : Cerah / Clear Skies
// 1, 2 : Cerah Berawan / Partly Cloudy
// 3 : Berawan / Mostly Cloudy
// 4 : Berawan Tebal / Overcast
// 5 : Udara Kabur / Haze
// 10 : Asap / Smoke
// 45 : Kabut / Fog
// 60 : Hujan Ringan / Light Rain
// 61 : Hujan Sedang / Rain
// 63 : Hujan Lebat / Heavy Rain
// 80 : Hujan Lokal / Isolated Shower
// 95, 97 : Hujan Petir / Severe Thunderstorm

export function getWeatherIconComponent(code: number, isNight: boolean = false) {
  switch (code) {
    case 0:
      return isNight ? 'Moon' : 'Sun';
    case 1:
    case 2:
      return isNight ? 'CloudMoon' : 'CloudSun';
    case 3:
    case 4:
      return 'Cloud';
    case 5:
    case 10:
    case 45:
      return 'CloudFog';
    case 60:
    case 61:
    case 63:
    case 80:
      return 'CloudRain';
    case 95:
    case 97:
      return 'CloudLightning';
    default:
      return isNight ? 'Moon' : 'Sun'; // Fallback
  }
}

export function formatWeatherTime(localDatetimeStr: string): string {
  // input format: "2026-08-13 13:00:00"
  try {
    // We can just extract the time part directly for simplicity and accuracy
    const timePart = localDatetimeStr.split(' ')[1]; // "13:00:00"
    if (timePart) {
      const [hours, minutes] = timePart.split(':');
      return `${hours}.${minutes}`; // e.g. "13.00"
    }
  } catch (e) {
    console.error('Error formatting weather time', e);
  }
  return '';
}

export function isNightTime(localDatetimeStr: string): boolean {
  try {
    const timePart = localDatetimeStr.split(' ')[1];
    if (timePart) {
      const hours = parseInt(timePart.split(':')[0], 10);
      return hours < 6 || hours >= 18;
    }
  } catch (e) {}
  return false;
}
