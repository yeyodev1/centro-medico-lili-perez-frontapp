import type { AxiosResponse } from 'axios'
import APIBase from './httpBase'
import type { ApiError, DownloadLink, PortalSession, PortalStudy } from '@/types'

export interface PortalConfig {
  requireBirthDate: boolean
}

/**
 * Portal público de pacientes.
 *
 * Dos cuidados para no mezclar esta sesión con la del personal:
 * 1. Los headers SIEMPRE son explícitos. Si se omiten, APIBase pone el Bearer de
 *    `localStorage.access_token`, que es el token del personal.
 * 2. `validateStatus` deja pasar los 4xx como respuesta normal. Así un 401 del paciente
 *    no dispara el evento global `auth:token-expired`, que cerraría la sesión del personal
 *    abierta en el mismo navegador. El error se arma acá con la misma forma (`ApiError`).
 */
const PASS_THROUGH = { validateStatus: () => true }

function publicHeaders(): Record<string, string> {
  return { 'Content-Type': 'application/json' }
}

function patientHeaders(token: string): Record<string, string> {
  return { ...publicHeaders(), Authorization: `Bearer ${token}` }
}

function unwrap<T>(response: AxiosResponse<T>): T {
  if (response.status >= 200 && response.status < 300) return response.data

  const body = response.data as { message?: string } | null
  const error: ApiError = {
    status: response.status,
    message: body?.message || 'No se pudo completar la consulta. Inténtalo de nuevo.',
    data: response.data,
  }
  throw error
}

class PortalService extends APIBase {
  async config(): Promise<PortalConfig> {
    return unwrap(await this.get<PortalConfig>('portal/config', publicHeaders(), PASS_THROUGH))
  }

  async lookup(cedula: string, birthDate?: string): Promise<PortalSession> {
    const body = birthDate ? { cedula, birthDate } : { cedula }
    return unwrap(
      await this.post<PortalSession>('portal/lookup', body, publicHeaders(), PASS_THROUGH),
    )
  }

  async studies(token: string): Promise<PortalStudy[]> {
    return unwrap(
      await this.get<PortalStudy[]>('portal/studies', patientHeaders(token), PASS_THROUGH),
    )
  }

  async downloadLink(token: string, studyId: string): Promise<DownloadLink> {
    return unwrap(
      await this.get<DownloadLink>(
        `portal/studies/${encodeURIComponent(studyId)}/download`,
        patientHeaders(token),
        PASS_THROUGH,
      ),
    )
  }
}

export const portalService = new PortalService()
