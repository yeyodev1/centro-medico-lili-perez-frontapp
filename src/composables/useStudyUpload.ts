import axios from 'axios'
import { computed, reactive, ref } from 'vue'
import { studyService } from '@/services/study.service'
import { errorMessage } from '@/utils/apiError'
import { todayInput } from '@/utils/today'
import { panelCopy, studyTitleSuggestions, uploadRules } from '@/config/panel'
import type { Study, StudyType } from '@/types'

export interface StudyMeta {
  type: StudyType
  title: string
  studyDate: string
  examNumber: string
  doctor: string
  notes: string
}

export type UploadPhase = 'idle' | 'signing' | 'uploading' | 'saving'

interface CloudinaryUpload {
  public_id: string
  resource_type: string
}

const copy = panelCopy.upload

export function defaultStudyMeta(): StudyMeta {
  return {
    type: 'laboratorio',
    title: studyTitleSuggestions.laboratorio[0] || '',
    studyDate: todayInput(),
    examNumber: '',
    doctor: '',
    notes: '',
  }
}

/** Devuelve el motivo del rechazo, o '' si el archivo sirve. Se valida ANTES de subir. */
export function validateStudyFile(file: File): string {
  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  const extensionOk = (uploadRules.extensions as readonly string[]).includes(extension)
  // Algunos navegadores no informan el MIME: en ese caso manda la extensión.
  const mimeOk = !file.type || (uploadRules.mimeTypes as readonly string[]).includes(file.type)
  if (!extensionOk || !mimeOk) return copy.errors.type
  if (file.size === 0) return copy.errors.empty
  if (file.size > uploadRules.maxBytes) return copy.errors.size
  return ''
}

/** Al cambiar de tipo se propone su título, salvo que el asesor ya haya escrito uno propio. */
export function withType(meta: StudyMeta, type: StudyType): StudyMeta {
  const defaults = Object.values(studyTitleSuggestions).map((list) => list[0])
  const untouched = !meta.title.trim() || defaults.includes(meta.title)
  return { ...meta, type, title: untouched ? studyTitleSuggestions[type][0] || '' : meta.title }
}

export function useStudyUpload(patientId: string) {
  const file = ref<File | null>(null)
  const fileError = ref('')
  const meta = ref<StudyMeta>(defaultStudyMeta())
  const notify = ref(false)
  const errors = reactive<{ title?: string; studyDate?: string }>({})

  const phase = ref<UploadPhase>('idle')
  const progress = ref(0)
  const failure = ref<{ phase: Exclude<UploadPhase, 'idle'>; message: string } | null>(null)

  // Si falla el paso 3, el archivo ya está en Cloudinary: reintentar no lo vuelve a subir.
  let uploaded: CloudinaryUpload | null = null
  let controller: AbortController | null = null

  const busy = computed(() => phase.value !== 'idle')

  function pickFile(next: File | null | undefined) {
    if (busy.value || !next) return
    const problem = validateStudyFile(next)
    fileError.value = problem
    if (problem) return
    file.value = next
    uploaded = null
    failure.value = null
    progress.value = 0
  }

  function validate(): boolean {
    delete errors.title
    delete errors.studyDate
    meta.value = { ...meta.value, title: meta.value.title.trim() }
    if (!file.value) fileError.value = copy.errors.noFile
    if (!meta.value.title) errors.title = copy.errors.title
    if (!meta.value.studyDate) errors.studyDate = copy.errors.date
    return Boolean(file.value) && !errors.title && !errors.studyDate
  }

  /** Paso 2: directo a Cloudinary con axios "pelado" — sin el Bearer del personal. */
  async function uploadToCloudinary(target: File): Promise<CloudinaryUpload> {
    phase.value = 'signing'
    let signature
    try {
      signature = await studyService.uploadSignature(patientId)
    } catch (e) {
      throw { phase: 'signing', message: errorMessage(e, copy.errors.signing) }
    }

    phase.value = 'uploading'
    progress.value = 0
    const body = new FormData()
    body.append('file', target)
    body.append('api_key', signature.apiKey)
    body.append('timestamp', String(signature.timestamp))
    body.append('signature', signature.signature)
    body.append('folder', signature.folder)
    body.append('type', signature.type)

    controller = new AbortController()
    try {
      const { data } = await axios.post<CloudinaryUpload>(signature.uploadUrl, body, {
        signal: controller.signal,
        onUploadProgress: (event) => {
          const total = event.total || target.size
          progress.value = Math.min(100, Math.round((event.loaded / total) * 100))
        },
      })
      return data
    } catch (e) {
      if (axios.isCancel(e)) throw { phase: 'uploading', message: copy.errors.cancelled }
      const detail = axios.isAxiosError(e) ? e.response?.data?.error?.message : ''
      throw {
        phase: 'uploading',
        message: detail ? `${copy.errors.uploading} (${detail})` : copy.errors.uploading,
      }
    } finally {
      controller = null
    }
  }

  async function submit(): Promise<Study | null> {
    // Doble clic o Enter repetido: la subida en curso manda.
    if (busy.value || !validate() || !file.value) return null
    failure.value = null
    const target = file.value

    try {
      if (!uploaded) uploaded = await uploadToCloudinary(target)

      phase.value = 'saving'
      try {
        return await studyService.create({
          patientId,
          type: meta.value.type,
          title: meta.value.title,
          studyDate: meta.value.studyDate,
          examNumber: meta.value.examNumber.trim(),
          doctor: meta.value.doctor.trim(),
          notes: meta.value.notes.trim(),
          notify: notify.value,
          file: {
            publicId: uploaded.public_id,
            resourceType: uploaded.resource_type,
            originalName: target.name,
          },
        })
      } catch (e) {
        // Un 400 significa que el back rechazó (y borró) el archivo: toca subirlo otra vez.
        if ((e as { status?: number }).status === 400) uploaded = null
        throw { phase: 'saving', message: errorMessage(e, copy.errors.saving) }
      }
    } catch (e) {
      failure.value = e as { phase: Exclude<UploadPhase, 'idle'>; message: string }
      return null
    } finally {
      phase.value = 'idle'
    }
  }

  function cancelUpload() {
    controller?.abort()
  }

  function reset() {
    cancelUpload()
    meta.value = defaultStudyMeta()
    file.value = null
    fileError.value = ''
    failure.value = null
    uploaded = null
    progress.value = 0
    delete errors.title
    delete errors.studyDate
  }

  return {
    file,
    fileError,
    meta,
    notify,
    errors,
    phase,
    progress,
    failure,
    busy,
    pickFile,
    submit,
    cancelUpload,
    reset,
  }
}
