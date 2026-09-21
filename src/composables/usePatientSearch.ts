import { computed, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router'
import { patientService } from '@/services/patient.service'
import { errorMessage } from '@/utils/apiError'
import type { Paginated, Patient, PatientStatus } from '@/types'

const DEBOUNCE_MS = 300
const PAGE_SIZE = 20

type StatusFilter = PatientStatus | ''

function one(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

/**
 * Búsqueda de pacientes con la URL como fuente de verdad: `search`, `status` y
 * `page` viven en la query, así "atrás" desde la ficha devuelve la misma lista.
 */
export function usePatientSearch() {
  const route = useRoute()
  const router = useRouter()

  const term = ref(one(route.query.search))
  const result = ref<Paginated<Patient> | null>(null)
  const loading = ref(false)
  const error = ref('')

  const search = computed(() => one(route.query.search).trim())
  const status = computed<StatusFilter>(() => {
    const value = one(route.query.status)
    return value === 'active' || value === 'inactive' ? value : ''
  })
  const page = computed(() => Math.max(1, Number.parseInt(one(route.query.page), 10) || 1))

  let timer: ReturnType<typeof setTimeout> | undefined
  let controller: AbortController | null = null
  let lastRequest = 0

  async function load() {
    // Carrera: se cancela la petición anterior y, por si ya venía en camino,
    // solo se acepta la respuesta de la última que salió.
    controller?.abort()
    controller = new AbortController()
    const request = ++lastRequest
    loading.value = true
    error.value = ''

    try {
      const data = await patientService.list(
        { search: search.value, status: status.value, page: page.value, limit: PAGE_SIZE },
        controller.signal,
      )
      if (request !== lastRequest) return
      result.value = data
    } catch (e) {
      if (request !== lastRequest) return
      error.value = errorMessage(e, 'No se pudo cargar la lista de pacientes.')
    } finally {
      if (request === lastRequest) loading.value = false
    }
  }

  function buildQuery(next: { search?: string; status?: StatusFilter; page?: number }) {
    const query: LocationQueryRaw = {}
    const nextSearch = (next.search ?? search.value).trim()
    const nextStatus = next.status ?? status.value
    const nextPage = next.page ?? 1
    if (nextSearch) query.search = nextSearch
    if (nextStatus) query.status = nextStatus
    if (nextPage > 1) query.page = String(nextPage)
    return query
  }

  /** Escribir reemplaza la entrada del historial: "atrás" no recorre letra por letra. */
  function commitTerm() {
    clearTimeout(timer)
    if (term.value.trim() === search.value) return
    router.replace({ query: buildQuery({ search: term.value, page: 1 }) })
  }

  function setStatus(value: StatusFilter) {
    if (value === status.value) return
    router.push({ query: buildQuery({ status: value, page: 1 }) })
  }

  function setPage(value: number) {
    router.push({ query: buildQuery({ page: value }) })
  }

  watch(term, () => {
    clearTimeout(timer)
    timer = setTimeout(commitTerm, DEBOUNCE_MS)
  })

  watch(
    [search, status, page],
    () => {
      // Al salir hacia la ficha la query cambia: esta vista ya no debe reaccionar.
      if (route.name !== 'Patients') return
      if (term.value.trim() !== search.value) term.value = search.value
      load()
    },
    { immediate: true },
  )

  onUnmounted(() => {
    clearTimeout(timer)
    controller?.abort()
    lastRequest += 1
  })

  /** Solo dígitos (con o sin guiones/espacios): sirve para precargar la cédula al crear. */
  const cedulaCandidate = computed(() => {
    const compact = search.value.replace(/[\s-]/g, '')
    return /^\d{5,20}$/.test(compact) ? compact : ''
  })

  return {
    term,
    search,
    status,
    page,
    result,
    loading,
    error,
    cedulaCandidate,
    commitTerm,
    setStatus,
    setPage,
    reload: load,
  }
}
