const date = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  // Las fechas de estudio y nacimiento son "de calendario": sin UTC se corren un día.
  timeZone: 'UTC',
})

const dateTime = new Intl.DateTimeFormat('es-EC', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—'
  return date.format(typeof value === 'string' ? new Date(value) : value)
}

/** Para marcas de tiempo reales (subido el, última descarga), en hora local. */
export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return '—'
  return dateTime.format(typeof value === 'string' ? new Date(value) : value)
}

/** ISO → "YYYY-MM-DD" para un <input type="date">. */
export function toDateInput(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : ''
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Edad legible: bebés en meses, el resto en años. */
export function formatAge(birthDate: string | null | undefined): string {
  if (!birthDate) return '—'
  const birth = new Date(birthDate)
  const now = new Date()
  let months =
    (now.getUTCFullYear() - birth.getUTCFullYear()) * 12 + (now.getUTCMonth() - birth.getUTCMonth())
  if (now.getUTCDate() < birth.getUTCDate()) months -= 1
  if (months < 0) return '—'
  if (months < 24) return `${months} ${months === 1 ? 'mes' : 'meses'}`
  const years = Math.floor(months / 12)
  return `${years} años`
}
