import { ref } from 'vue'
import { userService, type StaffUserCreate, type StaffUserUpdate } from '@/services/user.service'
import { useToastStore } from '@/stores/toast'
import { errorMessage } from '@/utils/apiError'
import type { StaffUser } from '@/types'

export function useUsers() {
  const toast = useToastStore()

  const users = ref<StaffUser[]>([])
  const loading = ref(true)
  const error = ref('')
  const workingId = ref('')

  async function load() {
    loading.value = true
    error.value = ''
    try {
      users.value = await userService.list()
    } catch (e) {
      error.value = errorMessage(e, 'No se pudo cargar el personal.')
    } finally {
      loading.value = false
    }
  }

  /** Lanza el error para que el formulario lo muestre junto al campo (409 de correo). */
  async function create(input: StaffUserCreate): Promise<StaffUser> {
    const created = await userService.create(input)
    users.value = [...users.value, created]
    return created
  }

  async function update(id: string, input: StaffUserUpdate): Promise<StaffUser> {
    const updated = await userService.update(id, input)
    users.value = users.value.map((user) => (user.id === id ? updated : user))
    return updated
  }

  async function toggleActive(user: StaffUser) {
    if (workingId.value) return
    workingId.value = user.id
    try {
      const updated = await update(user.id, { isActive: !user.isActive })
      toast.success(
        updated.isActive
          ? `${updated.name} puede volver a ingresar`
          : `${updated.name} ya no puede ingresar`,
      )
    } catch (e) {
      toast.error(errorMessage(e, 'No se pudo cambiar el estado.'))
    } finally {
      workingId.value = ''
    }
  }

  load()

  return { users, loading, error, workingId, load, create, update, toggleActive }
}
