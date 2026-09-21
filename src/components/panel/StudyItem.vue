<script setup lang="ts">
import { computed } from 'vue'
import StatusBadge from './StatusBadge.vue'
import { studyTypes } from '@/config/site'
import { panelCopy } from '@/config/panel'
import { formatBytes, formatDate, formatDateTime } from '@/utils/format'
import type { Study } from '@/types'

const props = defineProps<{ study: Study; canNotify: boolean; working: boolean; locked: boolean }>()

const emit = defineEmits<{
  download: []
  toggle: []
  edit: []
  notify: []
  remove: []
}>()

const copy = panelCopy.studies
const type = computed(() => studyTypes[props.study.type] || studyTypes.otro)

const details = computed(() =>
  [
    { label: 'Fecha', value: formatDate(props.study.studyDate) },
    { label: 'N° examen', value: props.study.examNumber },
    { label: 'Médico', value: props.study.doctor },
    {
      label: 'Archivo',
      value: `${(props.study.file.format || '').toUpperCase()} · ${formatBytes(props.study.file.bytes || 0)}`,
    },
    { label: 'Subido por', value: props.study.uploadedBy?.name || '' },
  ].filter((item) => item.value),
)

const downloads = computed(() =>
  props.study.downloadCount
    ? `${props.study.downloadCount} · última ${formatDateTime(props.study.lastDownloadedAt)}`
    : 'Sin descargas',
)
</script>

<template>
  <li class="study" :class="{ 'study--hidden': !study.isVisible, 'study--working': working }">
    <span class="study__icon"><i :class="type.icon" aria-hidden="true"></i></span>

    <div class="study__main">
      <p class="study__title">
        {{ study.title }}
        <StatusBadge tone="accent">{{ type.label }}</StatusBadge>
        <StatusBadge v-if="!study.isVisible" tone="warning" icon="fa-solid fa-eye-slash">
          {{ copy.hidden }}
        </StatusBadge>
      </p>

      <dl class="study__meta">
        <div v-for="item in details" :key="item.label">
          <dt>{{ item.label }}</dt>
          <dd>{{ item.value }}</dd>
        </div>
        <div>
          <dt>Descargas del paciente</dt>
          <dd>{{ downloads }}</dd>
        </div>
        <div>
          <dt>Aviso por correo</dt>
          <dd>{{ study.notifiedAt ? formatDateTime(study.notifiedAt) : copy.notNotified }}</dd>
        </div>
      </dl>

      <p v-if="study.notes" class="study__notes">{{ study.notes }}</p>
    </div>

    <div class="study__actions">
      <button
        class="btn btn--ghost btn--sm"
        type="button"
        :disabled="locked"
        @click="emit('download')"
      >
        <i
          :class="working ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-download'"
          aria-hidden="true"
        ></i>
        Descargar
      </button>
      <button
        class="btn btn--ghost btn--sm"
        type="button"
        :disabled="locked"
        @click="emit('toggle')"
      >
        <i
          :class="study.isVisible ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
          aria-hidden="true"
        ></i>
        {{ study.isVisible ? 'Ocultar' : 'Mostrar' }}
      </button>
      <button class="btn btn--ghost btn--sm" type="button" :disabled="locked" @click="emit('edit')">
        <i class="fa-solid fa-pen" aria-hidden="true"></i> Editar
      </button>
      <button
        v-if="canNotify"
        class="btn btn--ghost btn--sm"
        type="button"
        :disabled="locked || !study.isVisible"
        :title="study.isVisible ? undefined : 'Muéstralo al paciente antes de avisarle'"
        @click="emit('notify')"
      >
        <i class="fa-solid fa-envelope" aria-hidden="true"></i>
        {{ study.notifiedAt ? 'Reenviar aviso' : 'Enviar aviso' }}
      </button>
      <button
        class="btn btn--ghost btn--sm is-danger study__delete"
        type="button"
        :disabled="locked"
        @click="emit('remove')"
      >
        <i class="fa-solid fa-trash" aria-hidden="true"></i> Eliminar
      </button>
    </div>
  </li>
</template>

<style scoped lang="scss">
.study {
  @include flex(row, flex-start, flex-start, 0.8rem);
  flex-wrap: wrap;
  padding: 0.9rem 1rem;
  background: $surface;
  border: 1px solid $line;
  border-radius: 10px;
  transition: opacity 0.15s ease;

  &--hidden {
    background: $paper;
    border-style: dashed;
  }

  &--working {
    opacity: 0.7;
  }

  &__icon {
    @include flex(row, center, center);
    flex: none;
    width: 38px;
    height: 38px;
    border-radius: 8px;
    background: $accent-soft;
    color: $accent-deep;
  }

  &__main {
    flex: 1 1 220px;
    min-width: 0;
  }

  &__title {
    @include flex(row, center, flex-start, 0.4rem);
    flex-wrap: wrap;
    font-weight: 700;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  &__meta {
    @include flex(row, flex-start, flex-start, 0.4rem 1.25rem);
    flex-wrap: wrap;
    margin-top: 0.45rem;

    dt {
      font-size: 0.72rem;
      font-weight: 600;
      color: $ink-muted;
    }

    dd {
      font-size: 0.86rem;
      line-height: 1.35;
      font-variant-numeric: tabular-nums;
    }
  }

  &__notes {
    margin-top: 0.45rem;
    font-size: 0.85rem;
    color: $ink-soft;
    white-space: pre-line;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.35rem);
    flex: 1 1 100%;
    flex-wrap: wrap;
    padding-top: 0.7rem;
    border-top: 1px solid $line;
  }

  &__delete {
    @include from('sm') {
      margin-left: auto;
    }
  }
}
</style>
