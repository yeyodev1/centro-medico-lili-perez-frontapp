<script setup lang="ts">
import { ref, watch } from 'vue'
import { portal } from '@/config/site'

/**
 * Día, mes y año por separado: el selector nativo de fecha obliga a retroceder décadas
 * mes a mes, algo muy incómodo para un adulto mayor en el celular.
 * Emite 'YYYY-MM-DD' cuando la fecha es real, o '' mientras esté incompleta.
 */
defineProps<{ id: string; invalid?: boolean }>()

const model = defineModel<string>({ required: true })

// Copy que aún no está en site.ts (reportado al coordinador).
const COPY = {
  day: 'Día',
  month: 'Mes',
  year: 'Año',
  monthPlaceholder: 'Elige',
  months: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
}

const day = ref('')
const month = ref('')
const year = ref('')
const dayInput = ref<HTMLInputElement | null>(null)

function toIso(): string {
  const d = Number(day.value)
  const m = Number(month.value)
  const y = Number(year.value)
  if (!d || !m || year.value.length !== 4 || y < 1900) return ''

  const candidate = new Date(Date.UTC(y, m - 1, d))
  const isReal = candidate.getUTCMonth() === m - 1 && candidate.getUTCDate() === d
  if (!isReal || candidate.getTime() > Date.now()) return ''

  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

// En la plantilla los refs llegan desenvueltos: se elige el destino por nombre.
function onlyDigits(event: Event, part: 'day' | 'year') {
  const el = event.target as HTMLInputElement
  const target = part === 'day' ? day : year
  target.value = el.value.replace(/\D/g, '')
  el.value = target.value
}

watch([day, month, year], () => (model.value = toIso()))

defineExpose({ focus: () => dayInput.value?.focus() })
</script>

<template>
  <fieldset class="birth" :class="{ 'birth--invalid': invalid }">
    <legend class="birth__legend">{{ portal.birthDateLabel }}</legend>

    <div class="birth__row">
      <div class="birth__part birth__part--day">
        <label :for="`${id}-day`">{{ COPY.day }}</label>
        <input
          :id="`${id}-day`"
          ref="dayInput"
          :value="day"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          maxlength="2"
          placeholder="DD"
          @input="onlyDigits($event, 'day')"
        />
      </div>

      <div class="birth__part birth__part--month">
        <label :for="`${id}-month`">{{ COPY.month }}</label>
        <select :id="`${id}-month`" v-model="month" autocomplete="off">
          <option value="" disabled>{{ COPY.monthPlaceholder }}</option>
          <option v-for="(name, index) in COPY.months" :key="name" :value="String(index + 1)">
            {{ name }}
          </option>
        </select>
      </div>

      <div class="birth__part birth__part--year">
        <label :for="`${id}-year`">{{ COPY.year }}</label>
        <input
          :id="`${id}-year`"
          :value="year"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          maxlength="4"
          placeholder="AAAA"
          @input="onlyDigits($event, 'year')"
        />
      </div>
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
.birth {
  border: none;
  min-width: 0;

  &__legend {
    font-size: 1rem;
    font-weight: 700;
    color: $ink;
    margin-bottom: 0.5rem;
  }

  &__row {
    @include flex(row, flex-end, flex-start, 0.6rem);
  }

  &__part {
    min-width: 0;

    &--day {
      flex: 0 0 4.25rem;
    }

    &--month {
      flex: 1 1 auto;
    }

    &--year {
      flex: 0 0 5.5rem;
    }

    label {
      font-size: 0.875rem;
      font-weight: 600;
      color: $ink-soft;
    }

    input,
    select {
      min-height: 3.25rem;
      padding: 0.6rem 0.7rem;
      font-size: 1.125rem;
      font-weight: 600;
      border: 2px solid $ink-muted;

      &:focus {
        border-color: $accent;
        box-shadow: 0 0 0 4px rgba($accent, 0.2);
      }
    }

    input::placeholder {
      font-weight: 400;
      color: $ink-soft;
    }
  }

  &--invalid input,
  &--invalid select {
    border-color: $danger;
  }
}
</style>
