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
  Jalan: '#64748B',
  Simpang: '#64748B',
  Taman: '#64748B',
  Pasar: '#64748B',
  Lapangan: '#64748B',
  Gerbang: '#64748B',
  Kantor: '#64748B',
  Lainnya: '#64748B',
}