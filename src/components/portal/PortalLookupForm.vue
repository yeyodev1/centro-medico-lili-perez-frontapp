<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { portal } from '@/config/site'
import { usePortalSession } from '@/composables/usePortalSession'
import ActionButton from '@/components/ui/ActionButton.vue'
import FormAlert from '@/components/ui/FormAlert.vue'
import CedulaField from './CedulaField.vue'
import BirthDateField from './BirthDateField.vue'

const { requireBirthDate, loading, error, notice, loadConfig, lookup, takePendingCedula } =
  usePortalSession()

// Copy que aún no está en site.ts (reportado al coordinador).
const COPY = { searching: 'Buscando tus resultados…' }

const cedula = ref('')
const birthDate = ref('')
const cedulaField = ref<InstanceType<typeof CedulaField> | null>(null)
const birthField = ref<InstanceType<typeof BirthDateField> | null>(null)

async function submit() {
  const found = await lookup(cedula.value, birthDate.value)
  if (found) return
  await nextTick()
  // Con la cédula ya escrita, lo que falta corregir casi siempre es la fecha.
  if (requireBirthDate.value && cedula.value && !birthDate.value) birthField.value?.focus()
  else cedulaField.value?.focus()
}

onMounted(async () => {
  // La cédula escrita en el hero del inicio llega por estado, nunca por la URL.
  const pending = takePendingCedula()
  if (pending) cedula.value = pending

  await loadConfig()
  if (!pending) return

  if (requireBirthDate.value) {
    await nextTick()
    birthField.value?.focus()
  } else {
    submit()
  }
})
</script>

<template>
  <form class="lookup" novalidate @submit.prevent="submit">
    <header class="lookup__head">
      <h1 class="lookup__title">{{ portal.title }}</h1>
      <p class="lookup__lead">{{ portal.lead }}</p>
    </header>

    <FormAlert v-if="notice" tone="info">{{ notice }}</FormAlert>

    <CedulaField
      id="portal-cedula"
      ref="cedulaField"
      v-model="cedula"
      :invalid="Boolean(error)"
      :described-by="error ? 'portal-error' : undefined"
    />

    <BirthDateField
      v-if="requireBirthDate"
      id="portal-birth"
      ref="birthField"
      v-model="birthDate"
      :invalid="Boolean(error) && !birthDate"
    />

    <FormAlert v-if="error" id="portal-error">{{ error }}</FormAlert>

    <ActionButton type="submit" icon="fa-solid fa-magnifying-glass" :loading="loading" block>
      {{ loading ? COPY.searching : portal.submit }}
    </ActionButton>

    <p class="lookup__privacy">
      <i class="fa-solid fa-lock" aria-hidden="true"></i>
      <span>{{ portal.privacy }}</span>
    </p>
  </form>
</template>

<style scoped lang="scss">
.lookup {
  @include card;
  @include flex(column, stretch, flex-start, 1.25rem);
  padding: 1.5rem 1.25rem;
  box-shadow: $shadow-sm;

  @include from('md') {
    padding: 2.25rem 2rem;
  }

  &__title {
    @include display($display-sm);
    color: $ink;
    margin-bottom: 0.5rem;
  }

  &__lead {
    font-size: 1.0625rem;
    color: $ink-soft;
  }

  &__privacy {
    @include flex(row, flex-start, flex-start, 0.6rem);
    padding-top: 1rem;
    border-top: 1px solid $line;
    font-size: 0.9375rem;
    color: $ink-soft;

    i {
      margin-top: 0.3rem;
      color: $accent;
    }
  }
}
</style>
