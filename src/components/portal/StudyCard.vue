<script setup lang="ts">
import { computed } from 'vue'
import { studyTypes } from '@/config/site'
import { formatBytes, formatDate } from '@/utils/format'
import type { PortalStudy } from '@/types'
import ActionButton from '@/components/ui/ActionButton.vue'
import FormAlert from '@/components/ui/FormAlert.vue'

const props = defineProps<{
  study: PortalStudy
  downloading: boolean
  disabled: boolean
  downloaded: boolean
  error: string
}>()

defineEmits<{ download: [] }>()

// Copy que aún no está en site.ts (reportado al coordinador).
const COPY = {
  date: 'Fecha',
  doctor: 'Médico',
  examNumber: 'N° de examen',
  file: 'Archivo',
  download: 'Descargar',
  preparing: 'Preparando descarga…',
  done: 'La descarga comenzó. Búscala en la carpeta Descargas de tu equipo.',
}

const type = computed(() => studyTypes[props.study.type] ?? studyTypes.otro)
const date = computed(() => formatDate(props.study.studyDate))
const format = computed(() => props.study.file.format.toUpperCase())
const fileInfo = computed(() => `${format.value} · ${formatBytes(props.study.file.bytes)}`)
</script>

<template>
  <article class="study">
    <div class="study__main">
      <p class="study__type">
        <i :class="type.icon" aria-hidden="true"></i>
        {{ type.label }}
      </p>
      <h3 class="study__title">{{ study.title }}</h3>

      <dl class="study__meta">
        <div class="study__datum">
          <dt>{{ COPY.date }}</dt>
          <dd>{{ date }}</dd>
        </div>
        <div v-if="study.doctor" class="study__datum">
          <dt>{{ COPY.doctor }}</dt>
          <dd>{{ study.doctor }}</dd>
        </div>
        <div v-if="study.examNumber" class="study__datum">
          <dt>{{ COPY.examNumber }}</dt>
          <dd>{{ study.examNumber }}</dd>
        </div>
        <div class="study__datum">
          <dt>{{ COPY.file }}</dt>
          <dd>{{ fileInfo }}</dd>
        </div>
      </dl>
    </div>

    <div class="study__action">
      <ActionButton
        icon="fa-solid fa-file-arrow-down"
        :loading="downloading"
        :disabled="disabled"
        :aria-label="`${COPY.download} ${study.title}, ${date}`"
        block
        @click="$emit('download')"
      >
        {{ downloading ? COPY.preparing : `${COPY.download} ${format}` }}
      </ActionButton>
    </div>

    <FormAlert v-if="error" class="study__feedback">{{ error }}</FormAlert>
    <FormAlert v-else-if="downloaded" tone="success" class="study__feedback">
      {{ COPY.done }}
    </FormAlert>
  </article>
</template>

<style scoped lang="scss">
.study {
  @include card;
  @include flex(row, stretch, flex-start, 1.25rem);
  flex-wrap: wrap;
  padding: 1.25rem;

  @include from('md') {
    align-items: center;
    padding: 1.5rem 1.75rem;
  }

  &__main {
    flex: 1 1 100%;
    min-width: 0;

    @include from('md') {
      flex: 1 1 0;
    }
  }

  &__type {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.7rem;
    border-radius: $radius-pill;
    background: $sand;
    color: $accent-deep;
    font-size: 0.875rem;
    font-weight: 700;
    margin-bottom: 0.6rem;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 800;
    color: $ink;
    overflow-wrap: anywhere;
    margin-bottom: 0.75rem;
  }

  &__meta {
    @include flex(row, flex-start, flex-start, 0.75rem 1.75rem);
    flex-wrap: wrap;
  }

  &__datum {
    // Dos por fila en el celular: cuatro datos apilados alargan demasiado la tarjeta.
    flex: 1 1 8.5rem;
    min-width: 0;

    @include from('md') {
      flex: 0 1 auto;
    }

    dt {
      font-size: 0.8125rem;
      font-weight: 600;
      color: $ink-soft;
    }

    dd {
      font-size: 1rem;
      font-weight: 600;
      color: $ink;
      overflow-wrap: anywhere;
    }
  }

  &__action {
    flex: 1 1 100%;

    @include from('md') {
      flex: 0 0 14rem;
    }
  }

  &__feedback {
    flex: 1 1 100%;
  }
}
</style>
