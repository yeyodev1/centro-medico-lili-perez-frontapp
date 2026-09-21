<script setup lang="ts">
import PanelCheckbox from './PanelCheckbox.vue'
import PanelField from './PanelField.vue'
import { patientOptions } from '@/config/site'
import { panelCopy, patientGeneralFields, type PatientFieldKey } from '@/config/panel'
import type { PatientFormErrors, PatientFormState } from '@/composables/usePatientForm'

defineProps<{ form: PatientFormState; errors: PatientFormErrors }>()

const emit = defineEmits<{
  change: [key: PatientFieldKey | 'notes' | 'isForeigner', value: string | boolean]
}>()

const copy = panelCopy.patientForm
</script>

<template>
  <fieldset class="pform">
    <legend class="pform__legend">{{ copy.general }}</legend>
    <div class="pform__fields">
      <template v-for="field in patientGeneralFields" :key="field.key">
        <PanelCheckbox
          v-if="field.key === 'isForeigner'"
          id="pf-isForeigner"
          class="pform__field pform__field--check"
          :label="field.label"
          :model-value="form.isForeigner"
          @update:model-value="emit('change', 'isForeigner', $event)"
        />
        <PanelField
          v-else
          :id="`pf-${field.key}`"
          class="pform__field"
          :class="`pform__field--${field.size}`"
          :label="field.label"
          :type="field.type === 'checkbox' ? 'text' : field.type"
          :options="field.options ? patientOptions[field.options] : undefined"
          :model-value="form[field.key]"
          :error="errors[field.key]"
          :required="field.required"
          :uppercase="field.uppercase || field.key === 'cedula'"
          :maxlength="field.maxlength"
          :inputmode="field.inputmode"
          :autocomplete="field.autocomplete || 'off'"
          @update:model-value="emit('change', field.key, $event)"
        />
      </template>
    </div>
  </fieldset>

  <fieldset class="pform">
    <legend class="pform__legend">{{ copy.notes }}</legend>
    <PanelField
      id="pf-notes"
      :label="copy.notes"
      type="textarea"
      :rows="4"
      maxlength="1000"
      :model-value="form.notes"
      @update:model-value="emit('change', 'notes', $event)"
    />
  </fieldset>
</template>

<style scoped lang="scss">
$gap: 0.85rem;

.pform {
  min-width: 0;
  padding: 1rem;
  background: $surface;
  border: 1px solid $line;
  border-radius: 10px;

  @include from('md') {
    padding: 1.1rem 1.25rem 1.25rem;
  }

  &__legend {
    float: left;
    width: 100%;
    margin-bottom: 0.85rem;
    padding-bottom: 0.55rem;
    border-bottom: 1px solid $line;
    font-family: $font-display;
    font-size: 0.95rem;
    font-weight: 800;
    color: $accent-deep;

    // float saca el legend del borde del fieldset; esto limpia el flujo.
    + * {
      clear: both;
    }
  }

  // Filas de cuatro columnas hechas con flex-wrap: cada campo ocupa 1, 2 o 3.
  // El ancho descuenta la parte del gap que le toca para que la fila cierre exacta.
  &__fields {
    @include flex(row, flex-start, flex-start, $gap);
    flex-wrap: wrap;
  }

  &__field {
    flex: 0 0 100%;
    min-width: 0;

    @include from('sm') {
      &--sm,
      &--check {
        flex-basis: calc(50% - #{$gap * 0.5});
      }
    }

    @include from('md') {
      &--sm,
      &--check {
        flex-basis: calc(25% - #{$gap * 0.75});
      }

      &--md {
        flex-basis: calc(50% - #{$gap * 0.5});
      }

      &--lg {
        flex-basis: calc(75% - #{$gap * 0.25});
      }
    }

    // El checkbox se alinea con los inputs de su fila, no con las etiquetas.
    &--check {
      padding-top: 0;

      @include from('sm') {
        padding-top: 1.35rem;
      }
    }
  }
}
</style>
