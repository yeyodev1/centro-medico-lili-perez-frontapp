<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { home, portal } from '@/config/site'
import { normalizeCedula, usePortalSession } from '@/composables/usePortalSession'
import ActionButton from '@/components/ui/ActionButton.vue'
import FormAlert from '@/components/ui/FormAlert.vue'
import CedulaField from '@/components/portal/CedulaField.vue'

const router = useRouter()
const { logout, setPendingCedula } = usePortalSession()

// Copy que aún no está en site.ts (reportado al coordinador).
const COPY = { required: 'Escribe tu número de cédula para continuar.' }

const cedula = ref('')
const error = ref('')
const field = ref<InstanceType<typeof CedulaField> | null>(null)

function submit() {
  if (!normalizeCedula(cedula.value)) {
    error.value = COPY.required
    field.value?.focus()
    return
  }
  error.value = ''
  // Una consulta nueva reemplaza a la anterior. La cédula viaja por el estado del
  // composable: es un dato personal y no debe quedar en la URL ni en el historial.
  logout()
  setPendingCedula(cedula.value)
  cedula.value = ''
  router.push({ name: 'Results' })
}
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__inner">
      <div class="hero__copy">
        <p class="hero__eyebrow">{{ home.hero.eyebrow }}</p>
        <h1 id="hero-title" class="hero__title">{{ home.hero.title }}</h1>
        <p class="hero__lead">{{ home.hero.lead }}</p>
      </div>

      <form class="hero__form" novalidate @submit.prevent="submit">
        <CedulaField
          id="hero-cedula"
          ref="field"
          v-model="cedula"
          :invalid="Boolean(error)"
          :described-by="error ? 'hero-error' : 'hero-privacy'"
        />
        <FormAlert v-if="error" id="hero-error">{{ error }}</FormAlert>
        <ActionButton type="submit" icon="fa-solid fa-magnifying-glass" block>
          {{ home.hero.cta }}
        </ActionButton>
        <p id="hero-privacy" class="hero__privacy">
          <i class="fa-solid fa-lock" aria-hidden="true"></i>
          <span>{{ portal.privacy }}</span>
        </p>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  overflow: hidden;
  background: $accent;
  color: $surface;

  // Cruz médica muy tenue, solo donde hay espacio: en el celular manda el formulario.
  &::before {
    content: '';
    position: absolute;
    left: -10rem;
    bottom: -12rem;
    display: none;
    width: 26rem;
    height: 26rem;
    background: rgba($surface, 0.06);
    clip-path: polygon(
      34% 0,
      66% 0,
      66% 34%,
      100% 34%,
      100% 66%,
      66% 66%,
      66% 100%,
      34% 100%,
      34% 66%,
      0 66%,
      0 34%,
      34% 34%
    );

    @include from('lg') {
      display: block;
    }
  }

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 1.75rem);
    position: relative;
    z-index: 1;
    padding-block: 2rem 2.5rem;

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      gap: 4rem;
      padding-block: $space-xl;
    }
  }

  &__copy {
    flex: 1 1 0;
    min-width: 0;
  }

  &__eyebrow {
    @include eyebrow;
    color: $accent-soft;
    margin-bottom: 0.9rem;
  }

  &__title {
    @include display(clamp(2rem, 1.4rem + 2.6vw, 3.25rem));
    margin-bottom: 1rem;
  }

  &__lead {
    font-size: $text-lg;
    line-height: 1.55;
    color: rgba($surface, 0.92);
    max-width: 46ch;
  }

  &__form {
    @include flex(column, stretch, flex-start, 1rem);
    padding: 1.5rem 1.25rem;
    background: $surface;
    color: $ink;
    border-radius: $radius-md;
    box-shadow: $shadow-lg;

    @include from('md') {
      padding: 2rem;
    }

    @include from('lg') {
      flex: 0 0 27rem;
    }
  }

  &__privacy {
    @include flex(row, flex-start, flex-start, 0.6rem);
    font-size: 0.9375rem;
    line-height: 1.5;
    color: $ink-soft;

    i {
      margin-top: 0.25rem;
      color: $accent;
    }
  }
}
</style>
