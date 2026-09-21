<script setup lang="ts">
import { ref } from 'vue'
import PanelPageHeader from '@/components/panel/PanelPageHeader.vue'
import PanelState from '@/components/panel/PanelState.vue'
import UserFormModal, { type UserFormMode } from '@/components/panel/UserFormModal.vue'
import UsersTable from '@/components/panel/UsersTable.vue'
import { useUsers } from '@/composables/useUsers'
import { useUserStore } from '@/stores/user'
import type { StaffUser } from '@/types'

const userStore = useUserStore()
const { users, loading, error, workingId, load, create, update, toggleActive } = useUsers()

const mode = ref<UserFormMode | null>(null)
const selected = ref<StaffUser | null>(null)

function open(next: UserFormMode, user: StaffUser | null = null) {
  selected.value = user
  mode.value = next
}

async function saveUser(id: string, input: Parameters<typeof update>[1]) {
  const updated = await update(id, input)
  // Si el admin editó su propio nombre, la barra lateral debe reflejarlo.
  if (userStore.user && updated.id === userStore.user.id) {
    userStore.user = { ...userStore.user, name: updated.name, phone: updated.phone }
  }
  return updated
}
</script>

<template>
  <section class="users">
    <PanelPageHeader title="Usuarios" subtitle="Personal del centro con acceso a este panel.">
      <button class="btn btn--primary" type="button" @click="open('create')">
        <i class="fa-solid fa-user-plus" aria-hidden="true"></i> Nuevo usuario
      </button>
    </PanelPageHeader>

    <PanelState v-if="loading" kind="loading" :rows="4" />
    <PanelState
      v-else-if="error"
      kind="error"
      title="No se pudo cargar"
      :message="error"
      @retry="load"
    />
    <UsersTable
      v-else
      :users="users"
      :current-user-id="userStore.user?.id || ''"
      :working-id="workingId"
      @edit="open('edit', $event)"
      @password="open('password', $event)"
      @toggle="toggleActive"
    />

    <UserFormModal
      :mode="mode"
      :user="selected"
      :is-self="Boolean(selected && selected.id === userStore.user?.id)"
      :create="create"
      :update="saveUser"
      @close="mode = null"
    />
  </section>
</template>

<style scoped lang="scss">
.users {
  max-width: 1080px;
}
</style>
