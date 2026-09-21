import { computed, nextTick, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { patientService } from '@/services/patient.service'
import { useToastStore } from '@/stores/toast'
import { errorMessage, errorStatus } from '@/utils/apiError'
import { toDateInput } from '@/utils/format'
import { todayInput } from '@/utils/today'
import { panelCopy, type PatientFieldKey } from '@/config/panel'
import type { Patient, PatientInput } from '@/types'

export type PatientFormState = Record<PatientFieldKey | 'notes', string> & { isForeigner: boolean }
export type PatientFormErrors = Partial<Record<PatientFieldKey, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CEDULA_RE = /^[A-Z0-9]{5,20}$/

/** Igual que el back: sin espacios ni guiones, en mayúsculas. */
export function normalizeCedula(value: string): string {
  return value.replace(/[\s-]/g, '').toUpperCase()
}

function emptyForm(): PatientFormState {
  return {
    clinicalHistory: '',
    idType: 'cedula',
    isForeigner: false,
    cedula: '',
    fullName: '',
    maritalStatus: '',
    address: '',
    email: '',
    sex: '',
    bloodType: 'S/E',
    status: 'active',
    admissionDate: todayInput(),
    birthDate: '',
    origin: '',
    sector: '',
    landline: '',
    mobile1: '',
    mobile2: '',
    notes: '',
  }
}

function fromPatient(patient: Patient): PatientFormState {
  const base = emptyForm()
  return {
    ...base,
    clinicalHistory: patient.clinicalHistory || '',
    idType: patient.idType || 'cedula',
    isForeigner: Boolean(patient.isForeigner),
    cedula: patient.cedula || '',
    fullName: patient.fullName || '',
    maritalStatus: patient.maritalStatus || '',
    address: patient.address || '',
    email: patient.email || '',
    sex: patient.sex || '',
    bloodType: patient.bloodType || 'S/E',
    status: patient.status || 'active',
    admissionDate: toDateInput(patient.admissionDate),
    birthDate: toDateInput(patient.birthDate),
    origin: patient.origin || '',
    sector: patient.sector || '',
    landline: patient.landline || '',
    mobile1: patient.mobile1 || '',
    mobile2: patient.mobile2 || '',
    notes: patient.notes || '',
  }
}

export function usePatientForm() {
  const route = useRoute()
  const router = useRouter()
  const toast = useToastStore()
  const copy = panelCopy.patientForm

  const patientId = typeof route.params.id === 'string' ? route.params.id : ''
  const isEdit = Boolean(patientId)

  const form = reactive<PatientFormState>(emptyForm())
  const errors = reactive<PatientFormErrors>({})
  const loading = ref(isEdit)
  const loadError = ref('')
  const saving = ref(false)
  const snapshot = ref('')
  const saved = ref(false)

  const isDirty = computed(
    () => !saved.value && !loading.value && JSON.stringify(form) !== snapshot.value,
  )

  function takeSnapshot() {
    snapshot.value = JSON.stringify(form)
  }

  async function load() {
    if (!isEdit) {
      // La lista manda la cédula que el asesor ya había escrito al buscar. La foto se toma
      // DESPUÉS: volver atrás sin haber tocado nada no debe pedir confirmación.
      if (typeof route.query.cedula === 'string') form.cedula = normalizeCedula(route.query.cedula)
      takeSnapshot()
      return
    }
    loading.value = true
    loadError.value = ''
    try {
      Object.assign(form, fromPatient(await patientService.getById(patientId)))
      takeSnapshot()
    } catch (e) {
      loadError.value = errorMessage(e, 'No se pudo cargar el paciente.')
    } finally {
      loading.value = false
    }
  }

  function setField(key: PatientFieldKey | 'notes' | 'isForeigner', value: string | boolean) {
    ;(form as Record<string, string | boolean>)[key] = value
    if (key in errors) delete errors[key as PatientFieldKey]
  }

  function validate(): boolean {
    for (const key of Object.keys(errors)) delete errors[key as PatientFieldKey]
    form.cedula = normalizeCedula(form.cedula)
    form.fullName = form.fullName.trim().replace(/\s+/g, ' ').toUpperCase()
    form.email = form.email.trim()

    if (!form.cedula) errors.cedula = copy.errors.cedulaRequired
    else if (!CEDULA_RE.test(form.cedula)) errors.cedula = copy.errors.cedulaFormat
    if (!form.fullName) errors.fullName = copy.errors.nameRequired
    if (form.email && !EMAIL_RE.test(form.email)) errors.email = copy.errors.email
    return Object.keys(errors).length === 0
  }

  async function focusFirstError() {
    await nextTick()
    const first = Object.keys(errors)[0]
    if (first) document.getElementById(`pf-${first}`)?.focus()
  }

  function toInput(): PatientInput {
    const { admissionDate, birthDate, ...rest } = form
    return {
      ...(rest as unknown as PatientInput),
      admissionDate: admissionDate || null,
      birthDate: birthDate || null,
    }
  }

  async function submit() {
    if (saving.value) return
    if (!validate()) {
      toast.error(copy.errors.review)
      focusFirstError()
      return
    }

    saving.value = true
    try {
      const patient = isEdit
        ? await patientService.update(patientId, toInput())
        : await patientService.create(toInput())
      saved.value = true
      toast.success(isEdit ? copy.updated : copy.created)
      // Recién creado, lo que sigue es subirle el estudio: la ficha abre la subida de una vez.
      router.replace({
        name: 'PatientDetail',
        params: { id: patient.id },
        query: isEdit ? {} : { subir: '1' },
      })
    } catch (e) {
      const message = errorMessage(e, 'No se pudo guardar el paciente.')
      if (errorStatus(e) === 409) {
        // El duplicado se muestra junto al campo que choca, no solo en un toast.
        const key = /historia/i.test(message) ? 'clinicalHistory' : 'cedula'
        errors[key] = message
        focusFirstError()
      }
      toast.error(message)
    } finally {
      saving.value = false
    }
  }

  load()

  return {
    form,
    errors,
    isEdit,
    patientId,
    loading,
    loadError,
    saving,
    isDirty,
    setField,
    submit,
    load,
  }
}
