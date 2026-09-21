import axios from 'axios'
import { resolveApiBaseUrl } from './httpBase'
import type { ApiError } from '@/types'

/**
 * Cambio de contraseña SIN pasar por APIBase, a propósito: el back responde 401 cuando la
 * contraseña ACTUAL es incorrecta, y el interceptor de APIBase trata todo 401 como sesión
 * vencida (main.ts cierra la sesión). Equivocarse de contraseña no debe sacar al usuario.
 */
class AccountService {
  async changePassword(current: string, next: string): Promise<void> {
    try {
      await axios.put(
        `${resolveApiBaseUrl()}/auth/password`,
        { current, next },
        {
          timeout: 15000,
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token') || ''}` },
        },
      )
    } catch (error) {
      const failure: ApiError =
        axios.isAxiosError(error) && error.response
          ? {
              status: error.response.status,
              message: error.response.data?.message || 'No se pudo cambiar la contraseña.',
            }
          : { status: 500, message: 'No se pudo conectar con el servidor' }
      throw failure
    }
  }
}

export const accountService = new AccountService()
