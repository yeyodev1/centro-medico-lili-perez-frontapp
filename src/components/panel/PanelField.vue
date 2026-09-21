<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'

export interface FieldOption {
  value: string
  label: string
}

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  id: string
  label: string
  modelValue: string
  type?: 'text' | 'email' | 'tel' | 'date' | 'password' | 'search' | 'select' | 'textarea'
  options?: readonly (FieldOption | string)[]
  /** Sugerencias de autocompletar (datalist) para campos de texto. */
  suggestions?: readonly string[]
  error?: string
  hint?: string
  required?: boolean
  uppercase?: boolean
  rows?: number
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

// class y style van a la raíz (el padre acomoda el campo en su fila);
// el resto de atributos (maxlength, autocomplete, disabled…) van al control.
const attrs = useAttrs()
const controlAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})

const control = ref<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>(null)

const normalizedOptions = computed<FieldOption[]>(() =>
  (props.options || []).map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  ),
)

const describedBy = computed(() => {
  if (props.error) return `${props.id}-error`
  return props.hint ? `${props.id}-hint` : undefined
})

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', props.uppercase ? target.value.toUpperCase() : target.value)
}

defineExpose({ focus: () => control.value?.focus() })
</script>

<template>
  <div class="field" :class="[attrs.class, { 'field--error': error }]">
    <label class="field__label" :for="id">
      {{ label }}
      <span v-if="required" class="field__required" aria-hidden="true">*</span>
    </label>

    <select
      v-if="type === 'select'"
      :id="id"
      ref="control"
      class="field__control"
      :value="modelValue"
      :aria-invalid="Boolean(error)"
      :aria-describedby="describedBy"
      v-bind="controlAttrs"
      @change="onInput"
    >
      <option v-for="option in normalizedOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <textarea
      v-else-if="type === 'textarea'"
      :id="id"
      ref="control"
      class="field__control field__control--area"
      :value="modelValue"
      :rows="rows || 4"
      :aria-invalid="Boolean(error)"
      :aria-describedby="describedBy"
      v-bind="controlAttrs"
      @input="onInput"
    ></textarea>

    <input
      v-else
      :id="id"
      ref="control"
      class="field__control"
      :class="{ 'field__control--upper': uppercase }"
      :type="type || 'text'"
      :value="modelValue"
      :required="required"
      :list="suggestions ? `${id}-list` : undefined"
      :aria-invalid="Boolean(error)"
      :aria-describedby="describedBy"
      v-bind="controlAttrs"
      @input="onInput"
    />

    <datalist v-if="suggestions" :id="`${id}-list`">
      <option v-for="suggestion in suggestions" :key="suggestion" :value="suggestion"></option>
    </datalist>

    <p v-if="error" :id="`${id}-error`" class="field__error" role="alert">
      <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {{ error }}
    </p>
    <p v-else-if="hint" :id="`${id}-hint`" class="field__hint">{{ hint }}</p>
  </div>
</template>

<style scoped lang="scss">
.field {
  @include flex(column, stretch, flex-start, 0.3rem);
  min-width: 0;

  &__label {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 600;
    color: $ink-soft;
  }

  &__required {
    color: $danger;
  }

  &__control {
    // 16 px en móvil: por debajo de eso iOS hace zoom al enfocar.
    font-size: 1rem;
    min-height: 44px;
    padding: 0.55rem 0.75rem;
    border-radius: 8px;

    @include from('md') {
      font-size: 0.92rem;
      min-height: 38px;
      padding: 0.4rem 0.65rem;
    }

    &--upper {
      text-transform: uppercase;
    }

    &--area {
      resize: vertical;
      line-height: 1.5;
    }

    &:disabled {
      background: $paper;
      color: $ink-muted;
      cursor: not-allowed;
    }
  }

  &--error &__control {
    border-color: $danger;

    &:focus {
      box-shadow: 0 0 0 3px rgba($danger, 0.15);
    }
  }

  &__error {
    font-size: 0.8rem;
    color: $danger;
    line-height: 1.35;
  }

  &__hint {
    font-size: 0.78rem;
    color: $ink-muted;
    line-height: 1.35;
  }
}
</style>
