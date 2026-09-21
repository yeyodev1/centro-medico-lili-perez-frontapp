<script setup lang="ts">
import { ref } from 'vue'
import { portal } from '@/config/site'

defineProps<{
  id: string
  invalid?: boolean
  describedBy?: string
}>()

const model = defineModel<string>({ required: true })
const input = ref<HTMLInputElement | null>(null)

defineExpose({ focus: () => input.value?.focus() })
</script>

<template>
  <div class="cedula-field">
    <label class="cedula-field__label" :for="id">{{ portal.cedulaLabel }}</label>
    <!-- Texto y no numérico: los pasaportes llevan letras. -->
    <input
      :id="id"
      ref="input"
      v-model="model"
      class="cedula-field__input"
      type="text"
      inputmode="text"
      name="portal-id"
      autocomplete="off"
      autocapitalize="characters"
      autocorrect="off"
      spellcheck="false"
      enterkeyhint="go"
      maxlength="20"
      :placeholder="portal.cedulaPlaceholder"
      :aria-invalid="invalid || undefined"
      :aria-describedby="describedBy"
    />
  </div>
</template>

<style scoped lang="scss">
.cedula-field {
  &__label {
    font-size: 1rem;
    font-weight: 700;
    color: $ink;
    margin-bottom: 0.5rem;
  }

  &__input {
    min-height: 3.75rem;
    padding: 0.8rem 1rem;
    font-size: 1.375rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    border: 2px solid $ink-muted;
    border-radius: $radius-sm;

    &::placeholder {
      font-weight: 400;
      letter-spacing: 0;
      color: $ink-soft;
    }

    &:focus {
      border-color: $accent;
      box-shadow: 0 0 0 4px rgba($accent, 0.2);
    }

    &[aria-invalid='true'] {
      border-color: $danger;
    }
  }
}
</style>
