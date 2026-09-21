import APIBase from './httpBase'
import type { Paginated, Patient, PatientInput, PatientStatus, Study } from '@/types'

export interface PatientListParams {
  search?: string
  status?: PatientStatus | ''
  page?: number
  limit?: number
}

class PatientService extends APIBase {
  /** `signal` permite cancelar la búsqueda anterior mientras el asesor sigue escribiendo. */
  async list(params: PatientListParams, signal?: AbortSignal): Promise<Paginated<Patient>> {
    const query: Record<string, string | number> = {
      page: params.page || 1,
      limit: params.limit || 20,
    }
    if (params.search) query.search = params.search
    if (params.status) query.status = params.status

    const { data } = await this.get<Paginated<Patient>>('patients', undefined, {
      params: query,
      signal,
    })
    return data
  }

  async getById(id: string): Promise<Patient> {
    const { data } = await this.get<Patient>(`patients/${id}`)
    return data
  }

  async create(input: PatientInput): Promise<Patient> {
    const { data } = await this.post<Patient>('patients', input)
    return data
  }

  async update(id: string, input: Partial<PatientInput>): Promise<Patient> {
    const { data } = await this.put<Patient>(`patients/${id}`, input)
    return data
  }

  async remove(id: string): Promise<void> {
    await this.delete<{ ok: boolean }>(`patients/${id}`)
  }

  async studies(id: string): Promise<Study[]> {
    const { data } = await this.get<Study[]>(`patients/${id}/studies`)
    return data
  }
}

export const patientService = new PatientService()
