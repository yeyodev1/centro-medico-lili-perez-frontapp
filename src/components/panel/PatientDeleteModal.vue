<script setup lang="ts">
import { ref, toRef, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import PanelField from './PanelField.vue'
import { useEscapeKey } from '@/composables/useEscapeKey'
import { normalizeCedula } from '@/composables/usePatientForm'
import { panelCopy } from '@/config/panel'
import type { Patient } from '@/types'

const props = defineProps<{ open: boolean; patient: Patient; deleting: boolean }>()
const emit = defineEmits<{ confirm: []; cancel: [] }>()

const copy = panelCopy.deletePatient
const typed = ref('')
const mismatch = ref('')

function cancel() {
  if (!props.deleting) emit('cancel')
}

// Borrar un paciente arrastra todos sus estudios: exige escribir la cédula, no solo un clic.
function confirm() {
  if (props.deleting) return
  if (normalizeCedula(typed.value) !== normalizeCedula(props.patient.cedula)) {
    mismatch.value = copy.mismatch
    return
  }
  emit('confirm')
}

useEscapeKey(toRef(props, 'open'), cancel)

watch(
  () => props.open,
  () => {
    typed.value = ''
    mismatch.value = ''
  },
)
</script>

<template>
  <BaseModal
    :open="open"
    :title="copy.title"
    :message="copy.message"
    :confirm-label="deleting ? 'Eliminando…' : copy.confirm"
    danger
    @confirm="confirm"
    @cancel="cancel"
  >
    <form class="pdelete" @submit.prevent="confirm">
      <PanelField
        id="delete-cedula"
        v-model="typed"
        :label="`Escribe ${patient.cedula} para confirmar`"
        :error="mismatch"
        uppercase
        autocomplete="off"
        @update:model-value="mismatch = ''"
      />
    </form>
  </BaseModal>
</template>

<style scoped lang="scss">
.pdelete {
  width: 100%;
  margin-top: 0.4rem;
  text-align: left;
}
</style>
