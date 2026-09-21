<script setup lang="ts">
defineProps<{
  kind: 'loading' | 'empty' | 'error'
  title?: string
  message?: string
  /** Filas del esqueleto mientras carga. */
  rows?: number
}>()

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div v-if="kind === 'loading'" class="pstate pstate--loading" aria-busy="true">
    <span class="visually-hidden" role="status">Cargando…</span>
    <div v-for="n in rows || 5" :key="n" class="pstate__bone"></div>
  </div>

  <div
    v-else
    class="pstate"
    :class="`pstate--${kind}`"
    :role="kind === 'error' ? 'alert' : 'status'"
  >
    <i
      class="pstate__icon"
      :class="kind === 'error' ? 'fa-solid fa-triangle-exclamation' : 'fa-regular fa-folder-open'"
      aria-hidden="true"
    ></i>
    <p v-if="title" class="pstate__title">{{ title }}</p>
    <p v-if="message" class="pstate__message">{{ message }}</p>
    <div class="pstate__actions">
      <button
        v-if="kind === 'error'"
        class="btn btn--ghost btn--sm"
        type="button"
        @click="emit('retry')"
      >
        <i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Reintentar
      </button>
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.pstate {
  @include flex(column, center, center, 0.45rem);
  padding: 2.2rem 1rem;
  text-align: center;
  background: $surface;
  border: 1px dashed $line;
  border-radius: 10px;

  &--loading {
    align-items: stretch;
    gap: 0.5rem;
    padding: 0.75rem;
    border-style: solid;
  }

  &__bone {
    height: 44px;
    border-radius: 6px;
    background: $sand;
    animation: pstate-pulse 1.2s ease-in-out infinite;

    &:nth-child(odd) {
      animation-delay: 0.15s;
    }
  }

  &__icon {
    font-size: 1.5rem;
    color: $ink-muted;
  }

  &--error &__icon {
    color: $danger;
  }

  &__title {
    font-weight: 700;
  }

  &__message {
    max-width: 46ch;
    font-size: 0.88rem;
    color: $ink-soft;
  }

  &__actions {
    @include flex(row, center, center, 0.5rem);
    flex-wrap: wrap;
    margin-top: 0.4rem;

    &:empty {
      display: none;
    }
  }
}

@keyframes pstate-pulse {
  50% {
    opacity: 0.45;
  }
}
</style>
