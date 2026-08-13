export type CameraCategory =
  | 'Jalan'
  | 'Simpang'
  | 'Taman'
  | 'Pasar'
  | 'Lapangan'
  | 'Gerbang'
  | 'Kantor'
  | 'Lainnya'

export interface Camera {
  id: number
  name: string
  stream: string
  category: CameraCategory
  latitude?: number
  longitude?: number
  weatherLocation?: {
    adm4: string
    village: string
    district: string
  }
}

export interface CameraViewerState {
  open: boolean
  camera: Camera | null
}

export type FilterCategory = 'all' | CameraCategory
