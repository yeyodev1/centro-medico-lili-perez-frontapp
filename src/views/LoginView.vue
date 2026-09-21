<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { site } from '@/config/site'
import { useUserStore } from '@/stores/user'
import type { ApiError } from '@/types'
import ActionButton from '@/components/ui/ActionButton.vue'
import FormAlert from '@/components/ui/FormAlert.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// Copy que aún no está en site.ts (reportado al coordinador).
const COPY = {
  title: 'Acceso del personal',
  lead: 'Ingreso exclusivo para el equipo del centro médico.',
  email: 'Correo electrónico',
  password: 'Contraseña',
  show: 'Mostrar',
  hide: 'Ocultar',
  showLabel: 'Mostrar contraseña',
  hideLabel: 'Ocultar contraseña',
  submit: 'Ingresar',
  loading: 'Ingresando…',
  patientHint: '¿Eres paciente? No necesitas cuenta.',
  patientLink: 'Consulta tus resultados con tu cédula',
  back: 'Volver al inicio',
}

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// Solo rutas internas: un `next` externo convertiría el login en un redirector abierto.
function nextRoute() {
  const next = route.query.next
  if (typeof next === 'string' && next.startsWith('/') && !next.startsWith('//')) return next
  return { name: 'Panel' }
}

async function submit() {
  if (loading.value) return
  error.value = ''
  loading.value = true
  try {
    await userStore.login(email.value.trim(), password.value)
    await router.replace(nextRoute())
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="login">
    <form class="login__card" @submit.prevent="submit">
      <header class="login__head">
        <span class="login__icon" aria-hidden="true"><i class="fa-solid fa-user-lock"></i></span>
        <p class="login__brand">{{ site.name }}</p>
        <h1 class="login__title">{{ COPY.title }}</h1>
        <p class="login__lead">{{ COPY.lead }}</p>
      </header>

      <div class="login__field">
        <label for="login-email">{{ COPY.email }}</label>
        <input
          id="login-email"
          v-model="email"
          type="email"
          inputmode="email"
          autocomplete="username"
          autocapitalize="none"
          spellcheck="false"
          required
        />
      </div>

      <div class="login__field">
        <label for="login-password">{{ COPY.password }}</label>
        <div class="login__password">
          <input
            id="login-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            autocapitalize="none"
            spellcheck="false"
            required
          />
          <button
            type="button"
            class="login__toggle"
            :aria-pressed="showPassword"
            :aria-label="showPassword ? COPY.hideLabel : COPY.showLabel"
            @click="showPassword = !showPassword"
          >
            <i
              :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
              aria-hidden="true"
            ></i>
            {{ showPassword ? COPY.hide : COPY.show }}
          </button>
        </div>
      </div>

      <FormAlert v-if="error">{{ error }}</FormAlert>

      <ActionButton type="submit" :loading="loading" block>
        {{ loading ? COPY.loading : COPY.submit }}
      </ActionButton>

      <p class="login__patient">
        {{ COPY.patientHint }}
        <RouterLink :to="{ name: 'Results' }">{{ COPY.patientLink }}</RouterLink>
      </p>
    </form>

    <RouterLink :to="{ name: 'Home' }" class="login__back">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ COPY.back }}
    </RouterLink>
  </section>
</template>

<style scoped lang="scss">
.login {
  @include container(480px);
  @include flex(column, stretch, center, 1rem);
  flex: 1;
  padding-block: 1.5rem $space-xl;

  @include from('md') {
    padding-block: $space-xl;
  }

  &__card {
    @include card;
    @include flex(column, stretch, flex-start, 1.25rem);
    padding: 1.75rem 1.25rem;
    box-shadow: $shadow-sm;

    @include from('md') {
      padding: 2.5rem 2.25rem;
    }
  }

  &__icon {
    @include flex(row, center, center);
    width: 3rem;
    height: 3rem;
    border-radius: $radius-sm;
    background: $sand;
    color: $accent;
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  &__brand {
    @include eyebrow;
    letter-spacing: 0.12em;
    margin-bottom: 0.35rem;
  }

  &__title {
    @include display($display-sm);
    color: $ink;
    margin-bottom: 0.4rem;
  }

  &__lead {
    font-size: 1rem;
    color: $ink-soft;
  }

  &__field {
    label {
      font-size: 1rem;
      font-weight: 700;
      color: $ink;
      margin-bottom: 0.45rem;
    }

    // 16 px mínimo: por debajo de eso iOS hace zoom al enfocar el campo.
    input {
      min-height: 3.25rem;
      font-size: 1.0625rem;
      border: 2px solid $ink-muted;

      &:focus {
        border-color: $accent;
        box-shadow: 0 0 0 4px rgba($accent, 0.2);
      }
    }
  }

  &__password {
    position: relative;

    input {
      padding-right: 7rem;
    }
  }

  &__toggle {
    @include flex(row, center, center, 0.4rem);
    position: absolute;
    top: 50%;
    right: 0.35rem;
    min-width: 6rem;
    min-height: 2.75rem;
    padding-inline: 0.6rem;
    border-radius: 8px;
    transform: translateY(-50%);
    font-size: 0.9375rem;
    font-weight: 700;
    color: $accent-deep;

    &:hover {
      background: $sand;
    }
  }

  &__patient {
    padding-top: 1rem;
    border-top: 1px solid $line;
    font-size: 1rem;
    color: $ink-soft;

    a {
      font-weight: 700;
      color: $accent-deep;
      text-decoration: underline;
      text-underline-offset: 0.2em;
    }
  }

  &__back {
    @include flex(row, center, center, 0.5rem);
    align-self: center;
    min-height: 3rem;
    padding-inline: 0.75rem;
    font-size: 1rem;
    font-weight: 700;
    color: $accent-deep;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
