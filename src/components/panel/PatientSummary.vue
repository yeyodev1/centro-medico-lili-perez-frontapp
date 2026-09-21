<script setup lang="ts">
import { computed } from 'vue'
import StatusBadge from './StatusBadge.vue'
import { patientOptions } from '@/config/site'
import { formatAge, formatDate } from '@/utils/format'
import type { Patient } from '@/types'

const props = defineProps<{ patient: Patient }>()

const idTypeLabel = computed(
  () =>
    patientOptions.idType.find((option) => option.value === props.patient.idType)?.label ||
    'Cédula',
)

const sexLabel = computed(() => {
  if (props.patient.sex === 'F') return 'Femenino'
  return props.patient.sex === 'M' ? 'Masculino' : '—'
})

const phones = computed(() =>
  [props.patient.mobile1, props.patient.mobile2, props.patient.landline].filter(Boolean),
)

const facts = computed(() => [
  { label: idTypeLabel.value, value: props.patient.cedula },
  { label: 'Historia clínica', value: props.patient.clinicalHistory || '—' },
  {
    label: 'Edad',
    value: props.patient.birthDate
      ? `${formatAge(props.patient.birthDate)} (${formatDate(props.patient.birthDate)})`
      : '—',
  },
  { label: 'Sexo', value: sexLabel.value },
  { label: 'Tipo de sangre', value: props.patient.bloodType || 'S/E' },
])
</script>

<template>
  <section class="psum" aria-label="Ficha del paciente">
    <dl class="psum__facts">
      <div v-for="fact in facts" :key="fact.label" class="psum__fact">
        <dt>{{ fact.label }}</dt>
        <dd>{{ fact.value }}</dd>
      </div>
      <div class="psum__fact">
        <dt>Estado</dt>
        <dd>
          <StatusBadge :tone="patient.status === 'active' ? 'success' : 'muted'">
            {{ patient.status === 'active' ? 'Activo' : 'Inactivo' }}
          </StatusBadge>
        </dd>
      </div>
      <div class="psum__fact psum__fact--wide">
        <dt>Correo</dt>
        <dd>
          <a v-if="patient.email" class="psum__link" :href="`mailto:${patient.email}`">
            {{ patient.email }}
          </a>
          <span v-else class="psum__missing">
            <i class="fa-solid fa-circle-info" aria-hidden="true"></i> Sin correo: no se le puede
            avisar
          </span>
        </dd>
      </div>
      <div class="psum__fact psum__fact--wide">
        <dt>Teléfonos</dt>
        <dd>{{ phones.length ? phones.join(' · ') : '—' }}</dd>
      </div>
      <div v-if="patient.notes" class="psum__fact psum__fact--full">
        <dt>Observación</dt>
        <dd class="psum__notes">{{ patient.notes }}</dd>
      </div>
    </dl>
  </section>
</template>

<style scoped lang="scss">
.psum {
  padding: 0.9rem 1rem;
  background: $surface;
  border: 1px solid $line;
  border-radius: 10px;

  &__facts {
    @include flex(row, flex-start, flex-start, 0.85rem 1.5rem);
    flex-wrap: wrap;
  }

  &__fact {
    flex: 1 1 130px;
    min-width: 0;

    &--wide {
      flex: 2 1 220px;
    }

    &--full {
      flex: 1 1 100%;
    }

    dt {
      font-size: 0.74rem;
      font-weight: 600;
      color: $ink-muted;
    }

    dd {
      font-size: 0.94rem;
      font-weight: 600;
      line-height: 1.4;
      overflow-wrap: anywhere;
    }
  }

  &__link {
    color: $accent;

    &:hover {
      text-decoration: underline;
    }
  }

  &__missing {
    font-weight: 600;
    font-size: 0.86rem;
    color: darken($warning, 22);
  }

  &__notes {
    font-weight: 400;
    white-space: pre-line;
  }
}
</style>
