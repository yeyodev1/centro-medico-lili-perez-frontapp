<script setup lang="ts">
import { computed, onMounted } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import PanelPageHeader from '@/components/panel/PanelPageHeader.vue'
import PanelState from '@/components/panel/PanelState.vue'
import PatientFormFields from '@/components/panel/PatientFormFields.vue'
import { useEscapeKey } from '@/composables/useEscapeKey'
import { usePatientForm } from '@/composables/usePatientForm'
import { useUnsavedGuard } from '@/composables/useUnsavedGuard'
import { panelCopy } from '@/config/panel'

const copy = panelCopy.patientForm

const {
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
} = usePatientForm()

const { asking, leave, stay } = useUnsavedGuard(isDirty)
useEscapeKey(asking, stay)

// Al crear, el cursor arranca donde toca escribir: la cédula, o el nombre si ya vino precargada.
onMounted(() => {
  if (!isEdit) document.getElementById(form.cedula ? 'pf-fullName' : 'pf-cedula')?.focus()
})

const back = computed(() =>
  isEdit
    ? { to: { name: 'PatientDetail', params: { id: patientId } }, label: 'Volver a la ficha' }
    : { to: { name: 'Patients' }, label: 'Pacientes' },
)
</script>

<template>
  <section class="pedit">
    <PanelPageHeader
      :title="isEdit ? 'Editar paciente' : 'Nuevo paciente'"
      :subtitle="isEdit ? form.fullName : 'Los mismos datos de la ficha de DoctorSys.'"
      :back="back"
    />

    <PanelState v-if="loading" kind="loading" :rows="6" />
    <PanelState
      v-else-if="loadError"
      kind="error"
      title="No se pudo cargar"
      :message="loadError"
      @retry="load"
    />

    <form v-else class="pedit__form" novalidate @submit.prevent="submit">
      <PatientFormFields :form="form" :errors="errors" @change="setField" />

      <div class="pedit__actions">
        <p class="pedit__legend"><span aria-hidden="true">*</span> Campos obligatorios</p>
        <RouterLink class="btn btn--ghost" :to="back.to">Cancelar</RouterLink>
        <button class="btn btn--primary" type="submit" :disabled="saving">
          <i
            :class="saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-floppy-disk'"
            aria-hidden="true"
          ></i>
          {{ saving ? copy.saving : copy.save }}
        </button>
      </div>
    </form>

    <BaseModal
      :open="asking"
      :title="copy.unsavedTitle"
      :message="copy.unsavedMessage"
      :confirm-label="copy.unsavedConfirm"
      :cancel-label="copy.unsavedCancel"
      danger
      @confirm="leave"
      @cancel="stay"
    />
  </section>
</template>

<style scoped lang="scss">
.pedit {
  max-width: 980px;

  &__form {
    @include flex(column, stretch, flex-start, 1rem);
  }

  // Siempre a la vista: el formulario es largo y guardar no debe exigir scroll.
  &__actions {
    position: sticky;
    bottom: 0;
    z-index: 5;
    @include flex(row, center, flex-end, 0.6rem);
    flex-wrap: wrap;
    margin-inline: -1rem;
    padding: 0.75rem 1rem;
    background: $paper;
    border-top: 1px solid $line;

    @include from('md') {
      margin-inline: 0;
      padding-inline: 0;
    }
  }

  &__legend {
    flex: 1 1 100%;
    font-size: 0.8rem;
    color: $ink-muted;

    span {
      color: $danger;
    }

    @include from('sm') {
      flex: 1;
    }
  }
}
</style>
