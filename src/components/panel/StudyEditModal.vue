<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import PanelModal from './PanelModal.vue'
import StudyMetaFields from './StudyMetaFields.vue'
import { defaultStudyMeta, type StudyMeta } from '@/composables/useStudyUpload'
import { studyService } from '@/services/study.service'
import { useToastStore } from '@/stores/toast'
import { errorMessage } from '@/utils/apiError'
import { toDateInput } from '@/utils/format'
import { panelCopy } from '@/config/panel'
import type { Study } from '@/types'

const props = defineProps<{ study: Study | null }>()
const emit = defineEmits<{ close: []; saved: [study: Study] }>()

const toast = useToastStore()
const meta = ref<StudyMeta>(defaultStudyMeta())
const errors = reactive<{ title?: string; studyDate?: string }>({})
const saving = ref(false)

watch(
  () => props.study,
  (study) => {
    if (!study) return
    delete errors.title
    delete errors.studyDate
    meta.value = {
      type: study.type,
      title: study.title,
      studyDate: toDateInput(study.studyDate),
      examNumber: study.examNumber || '',
      doctor: study.doctor || '',
      notes: study.notes || '',
    }
  },
  { immediate: true },
)

async function save() {
  if (saving.value || !props.study) return
  delete errors.title
  delete errors.studyDate
  const title = meta.value.title.trim()
  if (!title) errors.title = panelCopy.upload.errors.title
  if (!meta.value.studyDate) errors.studyDate = panelCopy.upload.errors.date
  if (errors.title || errors.studyDate) return

  saving.value = true
  try {
    const updated = await studyService.update(props.study.id, {
      ...meta.value,
      title,
      examNumber: meta.value.examNumber.trim(),
      doctor: meta.value.doctor.trim(),
      notes: meta.value.notes.trim(),
    })
    toast.success('Estudio actualizado')
    emit('saved', updated)
    emit('close')
  } catch (e) {
    toast.error(errorMessage(e, 'No se pudo guardar el estudio.'))
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <PanelModal
    :open="Boolean(study)"
    title="Editar datos del estudio"
    :subtitle="study?.file.originalName"
    :busy="saving"
    wide
    @close="emit('close')"
  >
    <form id="study-edit-form" novalidate @submit.prevent="save">
      <StudyMetaFields v-model:meta="meta" prefix="ed" :errors="errors" :disabled="saving" />
    </form>

    <template #footer>
      <button class="btn btn--ghost" type="button" :disabled="saving" @click="emit('close')">
        Cancelar
      </button>
      <button class="btn btn--primary" type="submit" form="study-edit-form" :disabled="saving">
        <i
          :class="saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-floppy-disk'"
          aria-hidden="true"
        ></i>
        Guardar cambios
      </button>
    </template>
  </PanelModal>
</template>
