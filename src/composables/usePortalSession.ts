import { computed, readonly, ref } from 'vue'
import { portal } from '@/config/site'
import { portalService } from '@/services/portal.service'
import type { ApiError, DownloadLink, PortalSession, PortalStudy } from '@/types'

/**
 * Sesión del paciente en el portal público.
 *
 * Estado de módulo: el hero del inicio deja la cédula acá y /resultados la recoge, así el
 * dato personal nunca viaja por la URL. El token vive en memoria y, como respaldo, en
 * sessionStorage (en celulares de gama baja la pestaña se descarta al abrir el PDF y al
 * volver se perdería la consulta). Jamás en localStorage ni en `access_token`: esa clave
 * es del personal.
 */

const STORAGE_KEY = 'portal_session'

// Copy que aún no está en site.ts (reportado al coordinador).
const COPY = {
  cedulaRequired: 'Escribe tu número de cédula para continuar.',
  birthDateRequired: 'Completa tu fecha de nacimiento para continuar.',
}

interface ActiveSession {
  token: string
  patient: PortalSession['patient']
  expiresAt: number
}

const session = ref<ActiveSession | null>(null)
const studies = ref<PortalStudy[]>([])
const requireBirthDate = ref(false)
const loading = ref(false)
const restoring = ref(false)
const error = ref('')
const notice = ref('')
const downloadingId = ref('')
const downloadedId = ref('')
const downloadError = ref<{ id: string; message: string } | null>(null)

let configLoaded = false
let pendingCedula = ''
let expiryTimer: ReturnType<typeof setTimeout> | undefined
let watchingVisibility = false

export function normalizeCedula(value: string): string {
  return value.replace(/[\s.-]/g, '').toUpperCase()
}

function persist(value: ActiveSession | null) {
  try {
    if (value) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    else sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Modo privado o almacenamiento bloqueado: la sesión queda solo en memoria.
  }
}

function readPersisted(): ActiveSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const value = JSON.parse(raw) as ActiveSession
    if (!value?.token || !value.patient || typeof value.expiresAt !== 'number') return null
    return value
  } catch {
    return null
  }
}

function clear() {
  if (expiryTimer) clearTimeout(expiryTimer)
  expiryTimer = undefined
  session.value = null
  studies.value = []
  downloadingId.value = ''
  downloadedId.value = ''
  downloadError.value = null
  persist(null)
}

function expire() {
  clear()
  error.value = ''
  notice.value = portal.sessionExpired
}

function checkExpiry() {
  if (session.value && Date.now() >= session.value.expiresAt) expire()
}

function start(value: ActiveSession) {
  session.value = value
  persist(value)

  if (expiryTimer) clearTimeout(expiryTimer)
  expiryTimer = setTimeout(expire, Math.max(0, value.expiresAt - Date.now()))

  // En el celular los timers se congelan con la pestaña en segundo plano: al volver
  // se revisa contra el reloj.
  if (!watchingVisibility) {
    watchingVisibility = true
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') checkExpiry()
    })
  }
}

async function loadConfig() {
  if (configLoaded) return
  try {
    const config = await portalService.config()
    requireBirthDate.value = Boolean(config.requireBirthDate)
    configLoaded = true
  } catch {
    // Sin config se asume que basta la cédula; se reintenta en el próximo envío.
  }
}

async function lookup(cedulaInput: string, birthDate = ''): Promise<boolean> {
  if (loading.value) return false
  const cedula = normalizeCedula(cedulaInput)
  notice.value = ''
  error.value = ''

  if (!cedula) {
    error.value = COPY.cedulaRequired
    return false
  }

  loading.value = true
  try {
    await loadConfig()
    if (requireBirthDate.value && !birthDate) {
      error.value = COPY.birthDateRequired
      return false
    }

    const result = await portalService.lookup(cedula, birthDate || undefined)
    studies.value = result.studies
    start({
      token: result.token,
      patient: result.patient,
      expiresAt: Date.now() + result.expiresIn * 1000,
    })
    return true
  } catch (e) {
    error.value = (e as ApiError).message
    return false
  } finally {
    loading.value = false
  }
}

/** Tras recargar la página: recupera la consulta guardada en sessionStorage, si sigue vigente. */
async function restore() {
  if (session.value || restoring.value) return
  const saved = readPersisted()
  if (!saved) return
  if (Date.now() >= saved.expiresAt) {
    expire()
    return
  }

  restoring.value = true
  try {
    studies.value = await portalService.studies(saved.token)
    start(saved)
  } catch {
    expire()
  } finally {
    restoring.value = false
  }
}

function triggerDownload(link: DownloadLink) {
  // La URL firmada responde con `attachment`: el navegador descarga sin salir de la página.
  const anchor = document.createElement('a')
  anchor.href = link.url
  anchor.download = link.filename
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

async function download(study: PortalStudy) {
  if (!session.value || downloadingId.value) return
  checkExpiry()
  if (!session.value) return

  downloadingId.value = study.id
  downloadedId.value = ''
  downloadError.value = null
  try {
    triggerDownload(await portalService.downloadLink(session.value.token, study.id))
    downloadedId.value = study.id
  } catch (e) {
    const apiError = e as ApiError
    if (apiError.status === 401) expire()
    else downloadError.value = { id: study.id, message: apiError.message }
  } finally {
    downloadingId.value = ''
  }
}

function logout() {
  clear()
  error.value = ''
  notice.value = ''
}

/** El hero del inicio deja la cédula acá antes de navegar a /resultados. */
function setPendingCedula(value: string) {
  pendingCedula = value
}

/** Se lee una sola vez: después de consumirla no queda en memoria. */
function takePendingCedula(): string {
  const value = pendingCedula
  pendingCedula = ''
  return value
}

function clearMessages() {
  error.value = ''
  notice.value = ''
}

export function usePortalSession() {
  return {
    patient: computed(() => session.value?.patient ?? null),
    isActive: computed(() => Boolean(session.value)),
    studies: readonly(studies),
    requireBirthDate: readonly(requireBirthDate),
    loading: readonly(loading),
    restoring: readonly(restoring),
    error: readonly(error),
    notice: readonly(notice),
    downloadingId: readonly(downloadingId),
    downloadedId: readonly(downloadedId),
    downloadError: readonly(downloadError),
    loadConfig,
    lookup,
    restore,
    download,
    logout,
    setPendingCedula,
    takePendingCedula,
    clearMessages,
  }
}
