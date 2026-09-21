import { ref } from 'vue'
import { patientService } from '@/services/patient.service'
import { studyService } from '@/services/study.service'
import { useToastStore } from '@/stores/toast'
import { errorMessage } from '@/utils/apiError'
import type { Patient, Study } from '@/types'

/** Ficha + estudios de un paciente, y las acciones sobre cada estudio. */
export function usePatientDetail(patientId: string) {
  const toast = useToastStore()

  const patient = ref<Patient | null>(null)
  const studies = ref<Study[]>([])
  const loading = ref(true)
  const error = ref('')
  // Id del estudio con una acción en curso: deshabilita sus botones (sin doble clic).
  const workingId = ref('')

  async function load() {
    loading.value = true
    error.value = ''
    try {
      const [loadedPatient, loadedStudies] = await Promise.all([
        patientService.getById(patientId),
        patientService.studies(patientId),
      ])
      patient.value = loadedPatient
      studies.value = loadedStudies
    } catch (e) {
      error.value = errorMessage(e, 'No se pudo cargar el paciente.')
    } finally {
      loading.value = false
    }
  }

  function replaceStudy(updated: Study) {
    studies.value = studies.value.map((study) => (study.id === updated.id ? updated : study))
  }

  function addStudy(study: Study) {
    studies.value = [study, ...studies.value].sort((a, b) => b.studyDate.localeCompare(a.studyDate))
    if (patient.value) patient.value.studiesCount = studies.value.length
  }

  async function run(study: Study, task: () => Promise<void>, fallback: string) {
    if (workingId.value) return
    workingId.value = study.id
    try {
      await task()
    } catch (e) {
      toast.error(errorMessage(e, fallback))
    } finally {
      workingId.value = ''
    }
  }

  function download(study: Study) {
    return run(
      study,
      async () => {
        const { url, filename } = await studyService.download(study.id)
        // La URL firmada responde como adjunto: el navegador descarga sin salir del panel,
        // y al no abrir pestaña nueva tras el await no hay bloqueo de pop-ups.
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.rel = 'noopener'
        document.body.appendChild(link)
        link.click()
        link.remove()
      },
      'No se pudo generar la descarga.',
    )
  }

  function toggleVisibility(study: Study) {
    return run(
      study,
      async () => {
        const updated = await studyService.update(study.id, { isVisible: !study.isVisible })
        replaceStudy(updated)
        toast.success(updated.isVisible ? 'El paciente ya puede verlo' : 'Oculto para el paciente')
      },
      'No se pudo cambiar la visibilidad.',
    )
  }

  function notify(study: Study) {
    return run(
      study,
      async () => {
        const sent = await studyService.notify(study.id)
        if (!sent) {
          toast.error('No se pudo enviar el correo. Inténtalo más tarde.')
          return
        }
        replaceStudy({ ...study, notifiedAt: new Date().toISOString() })
        toast.success(`Aviso enviado a ${patient.value?.email}`)
      },
      'No se pudo enviar el aviso.',
    )
  }

  function remove(study: Study) {
    return run(
      study,
      async () => {
        await studyService.remove(study.id)
        studies.value = studies.value.filter((item) => item.id !== study.id)
        if (patient.value) patient.value.studiesCount = studies.value.length
        toast.success('Estudio eliminado')
      },
      'No se pudo eliminar el estudio.',
    )
  }

  load()

  return {
    patient,
    studies,
    loading,
    error,
    workingId,
    load,
    addStudy,
    replaceStudy,
    download,
    toggleVisibility,
    notify,
    remove,
  }
}
