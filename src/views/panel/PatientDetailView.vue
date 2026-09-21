<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseModal from '@/components/ui/BaseModal.vue'
import PanelPageHeader from '@/components/panel/PanelPageHeader.vue'
import PanelState from '@/components/panel/PanelState.vue'
import PatientDeleteModal from '@/components/panel/PatientDeleteModal.vue'
import PatientSummary from '@/components/panel/PatientSummary.vue'
import StudyEditModal from '@/components/panel/StudyEditModal.vue'
import StudyItem from '@/components/panel/StudyItem.vue'
import StudyUploadModal from '@/components/panel/StudyUploadModal.vue'
import { useEscapeKey } from '@/composables/useEscapeKey'
import { usePatientDetail } from '@/composables/usePatientDetail'
import { patientService } from '@/services/patient.service'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import { errorMessage } from '@/utils/apiError'
import { panelCopy } from '@/config/panel'
import type { Study } from '@/types'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()
const userStore = useUserStore()
const copy = panelCopy.studies

const patientId = String(route.params.id)
const {
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
} = usePatientDetail(patientId)

// ?subir=1 abre la subida directo: es el paso siguiente a crear un paciente.
const uploadOpen = ref(route.query.subir === '1')
const editing = ref<Study | null>(null)
const removing = ref<Study | null>(null)
const deleteOpen = ref(false)
const deleting = ref(false)

const removeOpen = computed(() => Boolean(removing.value))
useEscapeKey(removeOpen, () => (removing.value = null))

function closeUpload() {
  uploadOpen.value = false
  // Sin esto, recargar o volver "atrás" reabriría la subida.
  if (route.query.subir) router.replace({ query: {} })
}

async function confirmRemove() {
  const study = removing.value
  removing.value = null
  if (study) await remove(study)
}

async function deletePatient() {
  if (deleting.value) return
  deleting.value = true
  try {
    await patientService.remove(patientId)
    toast.success('Paciente eliminado')
    router.replace({ name: 'Patients' })
  } catch (e) {
    toast.error(errorMessage(e, 'No se pudo eliminar el paciente.'))
  } finally {
    deleting.value = false
    deleteOpen.value = false
  }
}
</script>

<template>
  <section class="pdetail">
    <PanelState v-if="loading" kind="loading" :rows="6" />
    <PanelState
      v-else-if="error || !patient"
      kind="error"
      title="No se pudo cargar"
      :message="error"
      @retry="load"
    >
      <RouterLink class="btn btn--ghost btn--sm" :to="{ name: 'Patients' }">
        Volver a pacientes
      </RouterLink>
    </PanelState>

    <template v-else>
      <PanelPageHeader
        :title="patient.fullName"
        :back="{ to: { name: 'Patients' }, label: 'Pacientes' }"
      >
        <RouterLink
          class="btn btn--ghost"
          :to="{ name: 'PatientEdit', params: { id: patient.id } }"
        >
          <i class="fa-solid fa-pen" aria-hidden="true"></i> Editar
        </RouterLink>
        <button
          v-if="userStore.isAdmin"
          class="btn btn--ghost is-danger"
          type="button"
          @click="deleteOpen = true"
        >
          <i class="fa-solid fa-trash" aria-hidden="true"></i> Eliminar paciente
        </button>
      </PanelPageHeader>

      <PatientSummary :patient="patient" />

      <div class="pdetail__bar">
        <h2 class="pdetail__subtitle">
          {{ copy.title }} <span class="pdetail__count">{{ studies.length }}</span>
        </h2>
        <button class="btn btn--primary" type="button" @click="uploadOpen = true">
          <i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i> {{ copy.upload }}
        </button>
      </div>

      <PanelState v-if="!studies.length" kind="empty" :title="copy.empty">
        <button class="btn btn--primary btn--sm" type="button" @click="uploadOpen = true">
          <i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i> {{ copy.upload }}
        </button>
      </PanelState>

      <ul v-else class="pdetail__studies">
        <StudyItem
          v-for="study in studies"
          :key="study.id"
          :study="study"
          :can-notify="Boolean(patient.email)"
          :working="workingId === study.id"
          :locked="Boolean(workingId)"
          @download="download(study)"
          @toggle="toggleVisibility(study)"
          @edit="editing = study"
          @notify="notify(study)"
          @remove="removing = study"
        />
      </ul>

      <StudyUploadModal
        :open="uploadOpen"
        :patient="patient"
        @close="closeUpload"
        @uploaded="addStudy"
      />
      <StudyEditModal :study="editing" @close="editing = null" @saved="replaceStudy" />
      <BaseModal
        :open="removeOpen"
        :title="copy.deleteTitle"
        :message="`${removing?.title || ''}. ${copy.deleteMessage}`"
        confirm-label="Eliminar"
        danger
        @confirm="confirmRemove"
        @cancel="removing = null"
      />
      <PatientDeleteModal
        v-if="userStore.isAdmin"
        :open="deleteOpen"
        :patient="patient"
        :deleting="deleting"
        @confirm="deletePatient"
        @cancel="deleteOpen = false"
      />
    </template>
  </section>
</template>

<style scoped lang="scss">
.pdetail {
  max-width: 1080px;

  &__bar {
    @include flex(row, center, space-between, 0.75rem);
    flex-wrap: wrap;
    margin: 1.5rem 0 0.8rem;
  }

  &__subtitle {
    font-size: 1.15rem;
    font-weight: 800;
  }

  &__count {
    margin-left: 0.3rem;
    padding: 0.05rem 0.5rem;
    border-radius: 6px;
    background: $sand;
    font-size: 0.85rem;
    color: $ink-soft;
  }

  &__studies {
    @include flex(column, stretch, flex-start, 0.6rem);
    list-style: none;
  }
}
</style>
