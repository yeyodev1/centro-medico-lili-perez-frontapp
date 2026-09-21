import APIBase from './httpBase'
import type { DownloadLink, Study, StudyInput, UploadSignature } from '@/types'

export type StudyUpdate = Partial<
  Pick<Study, 'type' | 'title' | 'studyDate' | 'examNumber' | 'doctor' | 'notes' | 'isVisible'>
>

class StudyService extends APIBase {
  /** Paso 1 de la subida: el back firma los parámetros; el archivo nunca pasa por él. */
  async uploadSignature(patientId: string): Promise<UploadSignature> {
    const { data } = await this.post<UploadSignature>('studies/upload-signature', { patientId })
    return data
  }

  /** Paso 3: registra el estudio. El back verifica el recurso en Cloudinary, por eso el timeout largo. */
  async create(input: StudyInput): Promise<Study> {
    const { data } = await this.post<Study>('studies', input, undefined, { timeout: 30000 })
    return data
  }

  async update(id: string, input: StudyUpdate): Promise<Study> {
    const { data } = await this.put<Study>(`studies/${id}`, input)
    return data
  }

  async remove(id: string): Promise<void> {
    await this.delete<{ ok: boolean }>(`studies/${id}`)
  }

  async download(id: string): Promise<DownloadLink> {
    const { data } = await this.get<DownloadLink>(`studies/${id}/download`)
    return data
  }

  async notify(id: string): Promise<boolean> {
    const { data } = await this.post<{ sent: boolean }>(`studies/${id}/notify`, {})
    return data.sent
  }
}

export const studyService = new StudyService()
