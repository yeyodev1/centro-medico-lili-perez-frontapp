<script setup lang="ts">
import { useRouter } from 'vue-router'
import PanelTable from './PanelTable.vue'
import StatusBadge from './StatusBadge.vue'
import type { Patient } from '@/types'

defineProps<{ patients: Patient[] }>()

const router = useRouter()

function open(patient: Patient, event: MouseEvent) {
  // El enlace del nombre ya navega solo (y permite abrir en otra pestaña).
  if ((event.target as HTMLElement).closest('a')) return
  // Si está seleccionando texto (copiar la cédula), no navegar.
  if (window.getSelection()?.toString()) return
  router.push({ name: 'PatientDetail', params: { id: patient.id } })
}
</script>

<template>
  <PanelTable caption="Pacientes">
    <thead>
      <tr>
        <th scope="col">Apellidos y nombres</th>
        <th scope="col">Cédula</th>
        <th scope="col">Historia clínica</th>
        <th scope="col">Estudios</th>
        <th scope="col">Estado</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="patient in patients"
        :key="patient.id"
        class="is-clickable"
        @click="open(patient, $event)"
      >
        <td class="is-main">
          <RouterLink
            class="prow__name"
            :to="{ name: 'PatientDetail', params: { id: patient.id } }"
          >
            {{ patient.fullName }}
          </RouterLink>
        </td>
        <td class="prow__mono" data-label="Cédula">{{ patient.cedula }}</td>
        <td class="prow__mono" data-label="Historia clínica">
          {{ patient.clinicalHistory || '—' }}
        </td>
        <td data-label="Estudios">{{ patient.studiesCount ?? 0 }}</td>
        <td data-label="Estado">
          <StatusBadge :tone="patient.status === 'active' ? 'success' : 'muted'">
            {{ patient.status === 'active' ? 'Activo' : 'Inactivo' }}
          </StatusBadge>
        </td>
      </tr>
    </tbody>
  </PanelTable>
</template>

<style scoped lang="scss">
.prow {
  &__name {
    color: $ink;
    font-weight: 700;
    overflow-wrap: anywhere;

    &:hover {
      color: $accent;
      text-decoration: underline;
    }
  }

  &__mono {
    font-variant-numeric: tabular-nums;
  }
}
</style>
