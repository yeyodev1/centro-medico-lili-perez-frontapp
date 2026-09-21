<script setup lang="ts">
defineProps<{ page: number; pages: number; total: number; disabled?: boolean }>()
const emit = defineEmits<{ change: [page: number] }>()
</script>

<template>
  <nav class="ppager" aria-label="Paginación">
    <p class="ppager__info">
      {{ total }} {{ total === 1 ? 'resultado' : 'resultados' }}
      <template v-if="pages > 1"> · página {{ page }} de {{ pages }}</template>
    </p>
    <div v-if="pages > 1" class="ppager__buttons">
      <button
        class="btn btn--ghost btn--sm"
        type="button"
        :disabled="disabled || page <= 1"
        @click="emit('change', page - 1)"
      >
        <i class="fa-solid fa-chevron-left" aria-hidden="true"></i> Anterior
      </button>
      <button
        class="btn btn--ghost btn--sm"
        type="button"
        :disabled="disabled || page >= pages"
        @click="emit('change', page + 1)"
      >
        Siguiente <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
      </button>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.ppager {
  @include flex(row, center, space-between, 0.75rem);
  flex-wrap: wrap;
  margin-top: 0.9rem;

  &__info {
    font-size: 0.85rem;
    color: $ink-soft;
  }

  &__buttons {
    @include flex(row, center, flex-end, 0.4rem);
  }
}
</style>
