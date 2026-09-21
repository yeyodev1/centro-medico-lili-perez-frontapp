<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import PanelField from './PanelField.vue'
import PanelModal from './PanelModal.vue'
import { useToastStore } from '@/stores/toast'
import { errorMessage, errorStatus } from '@/utils/apiError'
import { panelCopy } from '@/config/panel'
import type { StaffUserCreate, StaffUserUpdate } from '@/services/user.service'
import type { AccountType, StaffUser } from '@/types'

export type UserFormMode = 'create' | 'edit' | 'password'

const props = defineProps<{
  mode: UserFormMode | null
  user: StaffUser | null
  isSelf: boolean
  create: (input: StaffUserCreate) => Promise<StaffUser>
  update: (id: string, input: StaffUserUpdate) => Promise<StaffUser>
}>()

const emit = defineEmits<{ close: [] }>()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const toast = useToastStore()
const saving = ref(false)
const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  accountType: 'staff' as string,
})
const errors = reactive<{ name?: string; email?: string; password?: string }>({})

const roleOptions = Object.entries(panelCopy.roles)
  .map(([value, label]) => ({ value, label }))
  .reverse()

const title = computed(() => {
  if (props.mode === 'create') return 'Nuevo usuario'
  return props.mode === 'password' ? 'Restablecer contraseña' : 'Editar usuario'
})

watch(
  () => props.mode,
  (mode) => {
    if (!mode) return
    Object.assign(form, {
      name: props.user?.name || '',
      email: props.user?.email || '',
      phone: props.user?.phone || '',
      password: '',
      accountType: props.user?.accountType || 'staff',
    })
    Object.assign(errors, { name: undefined, email: undefined, password: undefined })
  },
)

function validate(): boolean {
  const needsProfile = props.mode !== 'password'
  const needsPassword = props.mode !== 'edit'
  errors.name = needsProfile && !form.name.trim() ? 'Escribe el nombre' : undefined
  errors.email =
    props.mode === 'create' && !EMAIL_RE.test(form.email.trim())
      ? 'Escribe un correo válido'
      : undefined
  errors.password =
    needsPassword && form.password.length < 8 ? 'Debe tener al menos 8 caracteres' : undefined
  return !errors.name && !errors.email && !errors.password
}

async function submit() {
  if (saving.value || !props.mode || !validate()) return
  saving.value = true
  const profile = {
    name: form.name.trim(),
    phone: form.phone.trim(),
    accountType: form.accountType as AccountType,
  }
  try {
    if (props.mode === 'create') {
      await props.create({
        ...profile,
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })
      toast.success('Usuario creado')
    } else if (props.user && props.mode === 'edit') {
      // A uno mismo no se le manda el rol: el back rechaza que un admin se lo quite.
      const { accountType, ...own } = profile
      await props.update(props.user.id, props.isSelf ? own : { ...own, accountType })
      toast.success('Usuario actualizado')
    } else if (props.user) {
      await props.update(props.user.id, { password: form.password })
      toast.success(`Contraseña de ${props.user.name} restablecida`)
    }
    emit('close')
  } catch (e) {
    const message = errorMessage(e, 'No se pudo guardar el usuario.')
    if (errorStatus(e) === 409) errors.email = message
    toast.error(message)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <PanelModal
    :open="Boolean(mode)"
    :title="title"
    :subtitle="mode === 'create' ? undefined : user?.email"
    :busy="saving"
    @close="emit('close')"
  >
    <form id="user-form" class="uform" novalidate @submit.prevent="submit">
      <template v-if="mode !== 'password'">
        <PanelField
          id="uf-name"
          v-model="form.name"
          label="Nombre"
          required
          maxlength="80"
          autocomplete="off"
          data-autofocus
          :error="errors.name"
        />
        <PanelField
          v-if="mode === 'create'"
          id="uf-email"
          v-model="form.email"
          label="Correo"
          type="email"
          required
          autocomplete="off"
          :error="errors.email"
        />
        <PanelField id="uf-phone" v-model="form.phone" label="Teléfono" type="tel" maxlength="20" />
        <PanelField
          id="uf-role"
          v-model="form.accountType"
          label="Rol"
          type="select"
          :options="roleOptions"
          :disabled="isSelf"
          :hint="
            isSelf
              ? 'No puedes cambiar tu propio rol.'
              : 'El administrador además gestiona usuarios y puede eliminar pacientes.'
          "
        />
      </template>
      <PanelField
        v-if="mode !== 'edit'"
        id="uf-password"
        v-model="form.password"
        :label="mode === 'password' ? 'Nueva contraseña' : 'Contraseña'"
        type="password"
        required
        autocomplete="new-password"
        hint="Mínimo 8 caracteres. Entrégasela a la persona por un medio seguro."
        :data-autofocus="mode === 'password' ? '' : undefined"
        :error="errors.password"
      />
    </form>

    <template #footer>
      <button class="btn btn--ghost" type="button" :disabled="saving" @click="emit('close')">
        Cancelar
      </button>
      <button class="btn btn--primary" type="submit" form="user-form" :disabled="saving">
        <i v-if="saving" class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
        {{ mode === 'create' ? 'Crear usuario' : 'Guardar' }}
      </button>
    </template>
  </PanelModal>
</template>

<style scoped lang="scss">
.uform {
  @include flex(column, stretch, flex-start, 0.85rem);
}
</style>
