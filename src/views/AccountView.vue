<script setup lang="ts">
import { reactive, ref } from 'vue'
import PanelField from '@/components/panel/PanelField.vue'
import PanelPageHeader from '@/components/panel/PanelPageHeader.vue'
import { accountService } from '@/services/account.service'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'
import { errorMessage, errorStatus } from '@/utils/apiError'
import { panelCopy } from '@/config/panel'

const userStore = useUserStore()
const toast = useToastStore()

const form = reactive({ current: '', next: '', repeat: '' })
const errors = reactive<{ current?: string; next?: string; repeat?: string }>({})
const saving = ref(false)

function validate(): boolean {
  errors.current = form.current ? undefined : 'Escribe tu contraseña actual'
  errors.next = form.next.length >= 8 ? undefined : 'Debe tener al menos 8 caracteres'
  if (!errors.next && form.next === form.current)
    errors.next = 'Usa una contraseña distinta a la actual'
  errors.repeat = form.repeat === form.next ? undefined : 'Las contraseñas no coinciden'
  return !errors.current && !errors.next && !errors.repeat
}

async function submit() {
  if (saving.value || !validate()) return
  saving.value = true
  try {
    // accountService y no authService: ver el porqué en ese servicio (el 401 de contraseña errada).
    await accountService.changePassword(form.current, form.next)
    Object.assign(form, { current: '', next: '', repeat: '' })
    toast.success('Contraseña actualizada')
  } catch (e) {
    const message = errorMessage(e, 'No se pudo cambiar la contraseña.')
    if (errorStatus(e) === 401) errors.current = message
    else toast.error(message)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="account">
    <PanelPageHeader title="Mi cuenta" />

    <div class="account__cols">
      <div class="account__card">
        <h2 class="account__subtitle">Datos de la sesión</h2>
        <dl class="account__data">
          <div>
            <dt>Nombre</dt>
            <dd>{{ userStore.user?.name || '—' }}</dd>
          </div>
          <div>
            <dt>Correo</dt>
            <dd>{{ userStore.user?.email }}</dd>
          </div>
          <div>
            <dt>Teléfono</dt>
            <dd>{{ userStore.user?.phone || '—' }}</dd>
          </div>
          <div>
            <dt>Rol</dt>
            <dd>
              {{
                panelCopy.roles[userStore.user?.accountType || ''] || userStore.user?.accountType
              }}
            </dd>
          </div>
        </dl>
        <p class="account__note">
          Para cambiar tu nombre, correo o rol, pídeselo a un administrador del centro.
        </p>
      </div>

      <form class="account__card" novalidate @submit.prevent="submit">
        <h2 class="account__subtitle">Cambiar contraseña</h2>
        <!-- Ayuda a los gestores de contraseñas a asociar el cambio con la cuenta. -->
        <input
          class="visually-hidden"
          type="email"
          autocomplete="username"
          :value="userStore.user?.email"
          tabindex="-1"
          aria-hidden="true"
          readonly
        />
        <PanelField
          id="ac-current"
          v-model="form.current"
          label="Contraseña actual"
          type="password"
          required
          autocomplete="current-password"
          :error="errors.current"
        />
        <PanelField
          id="ac-next"
          v-model="form.next"
          label="Nueva contraseña"
          type="password"
          required
          autocomplete="new-password"
          hint="Mínimo 8 caracteres."
          :error="errors.next"
        />
        <PanelField
          id="ac-repeat"
          v-model="form.repeat"
          label="Repite la nueva contraseña"
          type="password"
          required
          autocomplete="new-password"
          :error="errors.repeat"
        />
        <button class="btn btn--primary account__submit" type="submit" :disabled="saving">
          <i v-if="saving" class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
          {{ saving ? 'Guardando…' : 'Cambiar contraseña' }}
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.account {
  max-width: 900px;

  &__cols {
    @include flex-cards(300px, 1rem);
    align-items: flex-start;
  }

  &__card {
    @include flex(column, stretch, flex-start, 0.85rem);
    padding: 1rem;
    background: $surface;
    border: 1px solid $line;
    border-radius: 10px;

    @include from('md') {
      padding: 1.2rem 1.3rem;
    }
  }

  &__subtitle {
    font-size: 1rem;
    font-weight: 800;
  }

  &__data {
    @include flex(column, stretch, flex-start, 0.7rem);

    dt {
      font-size: 0.74rem;
      font-weight: 600;
      color: $ink-muted;
    }

    dd {
      font-weight: 600;
      font-size: 0.94rem;
      overflow-wrap: anywhere;
    }
  }

  &__note {
    font-size: 0.82rem;
    color: $ink-muted;
  }

  &__submit {
    align-self: flex-start;
  }
}
</style>
