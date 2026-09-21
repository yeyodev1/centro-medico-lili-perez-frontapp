import type { ApiError } from '@/types'

/** El backend manda el mensaje en español; si no hay, se usa el de respaldo. */
export function errorMessage(
  error: unknown,
  fallback = 'Algo salió mal. Inténtalo de nuevo.',
): string {
  const message = (error as ApiError | undefined)?.message
  return typeof message === 'string' && message ? message : fallback
}

export function errorStatus(error: unknown): number {
  const status = (error as ApiError | undefined)?.status
  return typeof status === 'number' ? status : 0
}
