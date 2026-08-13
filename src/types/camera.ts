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
}

export interface CameraViewerState {
  open: boolean
  camera: Camera | null
}

export type FilterCategory = 'all' | CameraCategory
