<script setup lang="ts">
import { studyTypes } from '@/config/site'
import { formatDate, formatDateTime } from '@/utils/format'
import type { RecentStudy } from '@/types'

defineProps<{ studies: RecentStudy[] }>()
</script>

<template>
  <ul class="recent">
    <li v-for="study in studies" :key="study.id">
      <RouterLink
        class="recent__item"
        :to="{ name: 'PatientDetail', params: { id: study.patient?.id || study.patientId } }"
      >
        <span class="recent__icon">
          <i :class="(studyTypes[study.type] || studyTypes.otro).icon" aria-hidden="true"></i>
        </span>
        <span class="recent__main">
          <span class="recent__patient">{{ study.patient?.fullName || 'Paciente' }}</span>
          <span class="recent__study">
            {{ study.title }} · {{ formatDate(study.studyDate) }}
            <template v-if="study.examNumber"> · N° {{ study.examNumber }}</template>
          </span>
        </span>
        <span class="recent__when">
          <span>{{ study.patient?.cedula }}</span>
          <span>Subido {{ formatDateTime(study.createdAt) }}</span>
        </span>
      </RouterLink>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.recent {
  @include flex(column, stretch, flex-start);
  list-style: none;
  background: $surface;
  border: 1px solid $line;
  border-radius: 10px;
  overflow: hidden;

  li + li {
    border-top: 1px solid $line;
  }

  &__item {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
    padding: 0.7rem 0.9rem;

    &:hover {
      background: lighten($sand, 3);
    }

    &:focus-visible {
      outline-offset: -2px;
    }
  }

  &__icon {
    @include flex(row, center, center);
    flex: none;
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: $accent-soft;
    color: $accent-deep;
    font-size: 0.9rem;
  }

  &__main {
    @include flex(column, flex-start, center);
    flex: 1 1 180px;
    min-width: 0;
    line-height: 1.35;
  }

  &__patient {
    font-weight: 700;
    font-size: 0.92rem;
    overflow-wrap: anywhere;
  }

  &__study {
    font-size: 0.83rem;
    color: $ink-soft;
  }

  &__when {
    @include flex(column, flex-start, center);
    flex: 1 1 100%;
    padding-left: calc(34px + 0.75rem);
    font-size: 0.78rem;
    color: $ink-muted;
    line-height: 1.4;
    font-variant-numeric: tabular-nums;

    @include from('md') {
      flex: none;
      align-items: flex-end;
      padding-left: 0;
    }
  }
}
</style>
