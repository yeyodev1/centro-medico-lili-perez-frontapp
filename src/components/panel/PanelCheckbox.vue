<script setup lang="ts">
defineProps<{
  id: string
  label: string
  modelValue: boolean
  disabled?: boolean
  hint?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<template>
  <div class="check" :class="{ 'check--disabled': disabled }">
    <div class="check__row">
      <input
        :id="id"
        class="check__input"
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        :aria-describedby="hint ? `${id}-hint` : undefined"
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />
      <label class="check__label" :for="id">{{ label }}</label>
    </div>
    <p v-if="hint" :id="`${id}-hint`" class="check__hint">{{ hint }}</p>
  </div>
</template>

<style scoped lang="scss">
.check {
  @include flex(column, stretch, flex-start, 0.25rem);

  &__row {
    @include flex(row, center, flex-start, 0.55rem);
    min-height: 38px;
  }

  // El estilo global de input pone width: 100% y padding: acá se deshace.
  &__input {
    flex: none;
    width: 18px;
    height: 18px;
    padding: 0;
    accent-color: $accent;
    cursor: pointer;
  }

  &__label {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: $ink;
    cursor: pointer;
  }

  &__hint {
    font-size: 0.78rem;
    color: $ink-muted;
    line-height: 1.35;
  }

  &--disabled &__label,
  &--disabled &__input {
    cursor: not-allowed;
    color: $ink-muted;
  }
}
</style>
