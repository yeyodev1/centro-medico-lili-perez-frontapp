<script setup lang="ts">
import { computed, watch } from 'vue'
import PanelCheckbox from './PanelCheckbox.vue'
import PanelModal from './PanelModal.vue'
import StudyDropzone from './StudyDropzone.vue'
import StudyMetaFields from './StudyMetaFields.vue'
import StudyUploadProgress from './StudyUploadProgress.vue'
import { useStudyUpload } from '@/composables/useStudyUpload'
import { useToastStore } from '@/stores/toast'
import { panelCopy } from '@/config/panel'
import type { Patient, Study } from '@/types'

const props = defineProps<{ open: boolean; patient: Patient }>()
const emit = defineEmits<{ close: []; uploaded: [study: Study] }>()

const copy = panelCopy.upload
const toast = useToastStore()

const {
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
} = useStudyUpload(props.patient.id)

const hasEmail = computed(() => Boolean(props.patient.email))

// Cada apertura arranca limpia; avisar queda marcado si hay a dónde avisar.
watch(
  () => props.open,
  (value) => {
    if (!value) return
    reset()
    notify.value = hasEmail.value
  },
  { immediate: true },
)

async function onSubmit() {
  const study = await submit()
  if (!study) return
  toast.success(copy.success)
  emit('uploaded', study)
  emit('close')
}
</script>

<template>
  <PanelModal
    :open="open"
    :title="copy.title"
    :subtitle="`${patient.fullName} · ${patient.cedula}`"
    :busy="busy"
    wide
    @close="emit('close')"
  >
    <form id="study-upload-form" class="upload" novalidate @submit.prevent="onSubmit">
      <StudyDropzone :file="file" :error="fileError" :disabled="busy" @pick="pickFile" />

      <StudyMetaFields v-model:meta="meta" prefix="up" :errors="errors" :disabled="busy" />

      <PanelCheckbox
        id="up-notify"
        v-model="notify"
        :label="copy.notify"
        :disabled="!hasEmail || busy"
        :hint="hasEmail ? `Se enviará a ${patient.email}` : copy.notifyDisabled"
      />

      <StudyUploadProgress :phase="phase" :progress="progress" :failure="failure" />
    </form>

    <template #footer>
      <button
        v-if="phase === 'uploading'"
        class="btn btn--ghost"
        type="button"
        @click="cancelUpload"
      >
        Cancelar subida
      </button>
      <button v-else class="btn btn--ghost" type="button" :disabled="busy" @click="emit('close')">
        Cerrar
      </button>
      <button class="btn btn--primary" type="submit" form="study-upload-form" :disabled="busy">
        <i
          :class="busy ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-cloud-arrow-up'"
          aria-hidden="true"
        ></i>
        {{ failure && !busy ? copy.retry : copy.submit }}
      </button>
    </template>
  </PanelModal>
</template>

<style scoped lang="scss">
.upload {
  @include flex(column, stretch, flex-start, 1rem);
}
</style>
