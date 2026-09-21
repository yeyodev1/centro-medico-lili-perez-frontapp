<script setup lang="ts">
import { computed } from 'vue'
import { panelCopy } from '@/config/panel'
import type { DashboardStats } from '@/types'

const props = defineProps<{ stats: DashboardStats | null }>()

const labels = panelCopy.dashboard.stats
const number = new Intl.NumberFormat('es-EC')

const cards = computed(
  () =>
    [
      {
        key: 'patients',
        label: labels.patients,
        icon: 'fa-solid fa-hospital-user',
        to: '/panel/pacientes',
      },
      { key: 'studies', label: labels.studies, icon: 'fa-solid fa-file-medical' },
      {
        key: 'studiesThisMonth',
        label: labels.studiesThisMonth,
        icon: 'fa-solid fa-calendar-check',
      },
      { key: 'downloads', label: labels.downloads, icon: 'fa-solid fa-download' },
    ] as const,
)

function value(key: (typeof cards.value)[number]['key']): string {
  return props.stats ? number.format(props.stats[key] ?? 0) : '—'
}
</script>

<template>
  <ul class="stats">
    <li v-for="card in cards" :key="card.key" class="stats__card">
      <i class="stats__icon" :class="card.icon" aria-hidden="true"></i>
      <div>
        <p class="stats__value" :class="{ 'stats__value--loading': !stats }">
          {{ value(card.key) }}
        </p>
        <p class="stats__label">{{ card.label }}</p>
      </div>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.stats {
  @include flex-cards(150px, 0.6rem);
  list-style: none;

  &__card {
    @include flex(row, center, flex-start, 0.8rem);
    padding: 0.85rem 1rem;
    background: $surface;
    border: 1px solid $line;
    border-radius: 10px;
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

  &__value {
    font-family: $font-display;
    font-size: 1.45rem;
    font-weight: 800;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;

    &--loading {
      color: $ink-muted;
    }
  }

  &__label {
    font-size: 0.8rem;
    color: $ink-soft;
    line-height: 1.3;
  }
}
</style>
