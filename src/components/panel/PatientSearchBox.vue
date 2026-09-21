<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { panelCopy } from '@/config/panel'

const props = defineProps<{
  modelValue: string
  autofocus?: boolean
  loading?: boolean
  /** Con botón: el buscador envía (resumen). Sin botón: busca mientras se escribe. */
  withButton?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string]; submit: [] }>()

const input = ref<HTMLInputElement | null>(null)

function clear() {
  emit('update:modelValue', '')
  emit('submit')
  input.value?.focus()
}

onMounted(() => {
  if (props.autofocus) input.value?.focus()
})
</script>

<template>
  <form class="psearch" role="search" @submit.prevent="emit('submit')">
    <label class="visually-hidden" for="patient-search">{{ panelCopy.search.label }}</label>
    <div class="psearch__box">
      <i
        class="psearch__icon"
        :class="loading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-magnifying-glass'"
        aria-hidden="true"
      ></i>
      <input
        id="patient-search"
        ref="input"
        class="psearch__input"
        type="search"
        :value="modelValue"
        :placeholder="panelCopy.search.placeholder"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        enterkeyhint="search"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <button
        v-if="modelValue"
        class="psearch__clear"
        type="button"
        aria-label="Limpiar búsqueda"
        @click="clear"
      >
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </div>
    <button v-if="withButton" class="btn btn--primary psearch__submit" type="submit">
      {{ panelCopy.search.submit }}
    </button>
  </form>
</template>

<style scoped lang="scss">
.psearch {
  @include flex(column, stretch, flex-start, 0.5rem);

  @include from('sm') {
    flex-direction: row;
  }

  &__box {
    position: relative;
    flex: 1;
    min-width: 0;
  }

  &__icon {
    position: absolute;
    top: 50%;
    left: 0.95rem;
    transform: translateY(-50%);
    color: $ink-muted;
    pointer-events: none;

    &.fa-spin {
      // fa-spin anima transform y pisaría el centrado vertical.
      top: calc(50% - 0.5em);
      transform: none;
    }
  }

  &__input {
    min-height: 50px;
    padding: 0.6rem 2.8rem 0.6rem 2.6rem;
    border-radius: 10px;
    border-color: darken($line, 8);
    font-size: 1.02rem;

    &::-webkit-search-cancel-button {
      display: none;
    }
  }

  &__clear {
    position: absolute;
    top: 50%;
    right: 0.4rem;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 8px;
    color: $ink-muted;

    &:hover {
      color: $ink;
      background: $sand;
    }
  }

  // Gana en especificidad a los botones compactos del layout.
  & &__submit.btn {
    min-height: 50px;
    padding-inline: 1.4rem;
  }
}
</style>
