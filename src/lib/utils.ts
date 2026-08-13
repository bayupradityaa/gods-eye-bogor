import { type CameraCategory } from '@/types/camera'

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatId(id: number): string {
  return `CAM ${String(id).padStart(3, '0')}`
}

export const CATEGORIES: { label: string; value: CameraCategory | 'all' }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Jalan', value: 'Jalan' },
  { label: 'Simpang', value: 'Simpang' },
  { label: 'Taman', value: 'Taman' },
  { label: 'Pasar', value: 'Pasar' },
  { label: 'Lapangan', value: 'Lapangan' },
  { label: 'Gerbang', value: 'Gerbang' },
  { label: 'Kantor', value: 'Kantor' },
  { label: 'Lainnya', value: 'Lainnya' },
]

export const CATEGORY_COLORS: Record<CameraCategory, string> = {
  Jalan: '#22D3EE',
  Simpang: '#4ADE80',
  Taman: '#FBBF24',
  Pasar: '#FB923C',
  Lapangan: '#A78BFA',
  Gerbang: '#F472B6',
  Kantor: '#60A5FA',
  Lainnya: '#9AA4B2',
}
