<script setup lang="ts">
import PanelTable from './PanelTable.vue'
import StatusBadge from './StatusBadge.vue'
import { panelCopy } from '@/config/panel'
import { formatDateTime } from '@/utils/format'
import type { StaffUser } from '@/types'

defineProps<{ users: StaffUser[]; currentUserId: string; workingId: string }>()

const emit = defineEmits<{
  edit: [user: StaffUser]
  password: [user: StaffUser]
  toggle: [user: StaffUser]
}>()
</script>

<template>
  <PanelTable caption="Personal con acceso al panel">
    <thead>
      <tr>
        <th scope="col">Nombre</th>
        <th scope="col">Correo</th>
        <th scope="col">Rol</th>
        <th scope="col">Estado</th>
        <th scope="col">Último ingreso</th>
        <th scope="col"><span class="visually-hidden">Acciones</span></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <td class="is-main">
          {{ user.name }}
          <StatusBadge v-if="user.id === currentUserId" tone="accent">Tú</StatusBadge>
        </td>
        <td class="urow__email" data-label="Correo">{{ user.email }}</td>
        <td data-label="Rol">{{ panelCopy.roles[user.accountType] || user.accountType }}</td>
        <td data-label="Estado">
          <StatusBadge :tone="user.isActive ? 'success' : 'muted'">
            {{ user.isActive ? 'Activo' : 'Desactivado' }}
          </StatusBadge>
        </td>
        <td data-label="Último ingreso">
          {{ user.lastLoginAt ? formatDateTime(user.lastLoginAt) : 'Nunca' }}
        </td>
        <td class="is-actions">
          <button class="btn btn--ghost btn--sm" type="button" @click="emit('edit', user)">
            <i class="fa-solid fa-pen" aria-hidden="true"></i> Editar
          </button>
          <button class="btn btn--ghost btn--sm" type="button" @click="emit('password', user)">
            <i class="fa-solid fa-key" aria-hidden="true"></i> Contraseña
          </button>
          <!-- Un admin no puede dejarse a sí mismo fuera del panel (el back también lo impide). -->
          <button
            v-if="user.id !== currentUserId"
            class="btn btn--ghost btn--sm"
            :class="{ 'is-danger': user.isActive }"
            type="button"
            :disabled="workingId === user.id"
            @click="emit('toggle', user)"
          >
            <i
              :class="user.isActive ? 'fa-solid fa-user-slash' : 'fa-solid fa-user-check'"
              aria-hidden="true"
            ></i>
            {{ user.isActive ? 'Desactivar' : 'Activar' }}
          </button>
        </td>
      </tr>
    </tbody>
  </PanelTable>
</template>

<style scoped lang="scss">
.urow__email {
  overflow-wrap: anywhere;
}
</style>
