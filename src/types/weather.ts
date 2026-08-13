export interface BMKGLokasi {
  adm1: string;
  adm2: string;
  adm3: string;
  adm4: string;
  provinsi: string;
  kotkab: string;
  kecamatan: string;
  desa: string;
  lon: number;
  lat: number;
  timezone: string;
}

export interface BMKGCuaca {
  datetime: string; // "2026-08-13T13:00:00Z"
  t: number; // temperature
  tcc: number; // cloud cover
  tp: number; // total precipitation
  weather: number; // weather code
  weather_desc: string; // "Cerah"
  weather_desc_en: string; // "Sunny"
  wd_deg: number; // wind direction degree
  wd: string; // wind direction
  wd_to: string; // wind direction to
  ws: number; // wind speed
  hu: number; // humidity
  vs: number; // visibility
  vs_text: string; // visibility text
  time_index: string;
  analysis_date: string;
  image: string;
  utc_datetime: string;
  local_datetime: string;
}

export interface BMKGResponse {
  lokasi: BMKGLokasi;
  data: Array<{
    lokasi: BMKGLokasi & { type?: string };
    cuaca: Array<Array<BMKGCuaca>>; // Array of days, which are array of 3-hour forecasts
  }>;
}

export interface WeatherForecast {
  datetime: string;
  localDatetime: string;
  temperature: number;
  weatherCode: number;
  weatherDescription: string;
}

export interface WeatherData {
  location: string;
  city: string;
  sourceArea: string;
  temperature: number;
  weatherCode: number;
  weatherDescription: string;
  humidity: number;
  windSpeed: number; // in km/h
  visibility: string;
  forecast: WeatherForecast[];
  updatedAt: string;
}
