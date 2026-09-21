<script setup lang="ts">
import PanelField from './PanelField.vue'
import { studyTypes } from '@/config/site'
import { studyTitleSuggestions } from '@/config/panel'
import { withType, type StudyMeta } from '@/composables/useStudyUpload'
import type { StudyType } from '@/types'

// Los mismos campos sirven para subir y para editar un estudio.
defineProps<{
  errors?: { title?: string; studyDate?: string }
  disabled?: boolean
  prefix: string
}>()

const meta = defineModel<StudyMeta>('meta', { required: true })

const typeEntries = Object.entries(studyTypes) as [StudyType, (typeof studyTypes)[StudyType]][]

function update<K extends keyof StudyMeta>(key: K, value: StudyMeta[K]) {
  meta.value = { ...meta.value, [key]: value }
}
</script>

<template>
  <div class="smeta">
    <fieldset class="smeta__types" :disabled="disabled">
      <legend class="smeta__legend">Tipo de estudio</legend>
      <div class="smeta__options">
        <label
          v-for="[value, config] in typeEntries"
          :key="value"
          class="smeta__type"
          :class="{ 'smeta__type--active': meta.type === value }"
          :for="`${prefix}-type-${value}`"
        >
          <input
            :id="`${prefix}-type-${value}`"
            class="visually-hidden"
            type="radio"
            :name="`${prefix}-type`"
            :value="value"
            :checked="meta.type === value"
            @change="meta = withType(meta, value)"
          />
          <i :class="config.icon" aria-hidden="true"></i> {{ config.label }}
        </label>
      </div>
    </fieldset>

    <PanelField
      :id="`${prefix}-title`"
      class="smeta__field smeta__field--wide"
      label="Título"
      required
      maxlength="120"
      autocomplete="off"
      :suggestions="studyTitleSuggestions[meta.type]"
      :model-value="meta.title"
      :error="errors?.title"
      :disabled="disabled"
      @update:model-value="update('title', $event)"
    />
    <PanelField
      :id="`${prefix}-date`"
      class="smeta__field"
      label="Fecha del estudio"
      type="date"
      required
      :model-value="meta.studyDate"
      :error="errors?.studyDate"
      :disabled="disabled"
      @update:model-value="update('studyDate', $event)"
    />
    <PanelField
      :id="`${prefix}-exam`"
      class="smeta__field"
      label="N° de examen"
      inputmode="numeric"
      maxlength="30"
      autocomplete="off"
      :model-value="meta.examNumber"
      :disabled="disabled"
      @update:model-value="update('examNumber', $event)"
    />
    <PanelField
      :id="`${prefix}-doctor`"
      class="smeta__field smeta__field--wide"
      label="Médico"
      uppercase
      maxlength="120"
      autocomplete="off"
      :model-value="meta.doctor"
      :disabled="disabled"
      @update:model-value="update('doctor', $event)"
    />
    <PanelField
      :id="`${prefix}-notes`"
      class="smeta__field smeta__field--wide"
      label="Observación"
      type="textarea"
      :rows="2"
      maxlength="500"
      :model-value="meta.notes"
      :disabled="disabled"
      @update:model-value="update('notes', $event)"
    />
  </div>
</template>

<style scoped lang="scss">
.smeta {
  @include flex(row, flex-start, flex-start, 0.8rem);
  flex-wrap: wrap;

  &__types {
    flex: 1 1 100%;
    min-width: 0;
    border: none;
  }

  &__legend {
    margin-bottom: 0.3rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: $ink-soft;
  }

  &__options {
    @include flex(row, stretch, flex-start, 0.4rem);
    flex-wrap: wrap;
  }

  &__type {
    @include flex(row, center, center, 0.45rem);
    flex: 1 1 110px;
    min-height: 44px;
    margin: 0;
    padding: 0.4rem 0.7rem;
    border: 1px solid $line;
    border-radius: 8px;
    background: $surface;
    font-size: 0.9rem;
    font-weight: 600;
    color: $ink-soft;
    cursor: pointer;

    &:hover {
      border-color: $accent;
    }

    &:focus-within {
      outline: 2px solid $accent;
      outline-offset: 2px;
    }

    &--active {
      background: $accent-soft;
      border-color: $accent;
      color: $accent-deep;
    }

    @include from('md') {
      min-height: 38px;
    }
  }

  &__field {
    flex: 1 1 100%;

    @include from('sm') {
      flex: 1 1 180px;

      &--wide {
        flex: 1 1 100%;
      }
    }
  }
}
</style>
