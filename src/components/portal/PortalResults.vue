<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { portal, studyTypes } from '@/config/site'
import { usePortalSession } from '@/composables/usePortalSession'
import type { StudyType } from '@/types'
import StudyCard from './StudyCard.vue'

const { patient, studies, downloadingId, downloadedId, downloadError, download, logout } =
  usePortalSession()

// Copy que aún no está en site.ts (reportado al coordinador).
const COPY = {
  greeting: 'Hola,',
  idLabel: 'Identificación',
  listTitle: 'Tus resultados',
  filterLabel: 'Filtrar por tipo',
  all: 'Todos',
  one: 'resultado',
  many: 'resultados',
}

const filter = ref<StudyType | 'all'>('all')
const heading = ref<HTMLElement | null>(null)

const typesPresent = computed(() =>
  (Object.keys(studyTypes) as StudyType[]).filter((type) =>
    studies.value.some((study) => study.type === type),
  ),
)

const visible = computed(() =>
  filter.value === 'all' ? studies.value : studies.value.filter((s) => s.type === filter.value),
)

const countLabel = computed(
  () => `${visible.value.length} ${visible.value.length === 1 ? COPY.one : COPY.many}`,
)

// El cambio de formulario a resultados no recarga la página: se lleva el foco al saludo
// para que el lector de pantalla anuncie que la consulta funcionó.
onMounted(() => heading.value?.focus())
</script>

<template>
  <section class="results" aria-labelledby="results-heading">
    <header class="results__head">
      <div class="results__who">
        <h1 id="results-heading" ref="heading" class="results__name" tabindex="-1">
          <span class="results__greeting">{{ COPY.greeting }}</span>
          {{ patient?.fullName }}
        </h1>
        <p class="results__id">
          <i class="fa-solid fa-id-card" aria-hidden="true"></i>
          {{ COPY.idLabel }}: <strong>{{ patient?.cedulaMasked }}</strong>
        </p>
      </div>

      <button type="button" class="results__logout" @click="logout">
        <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
        {{ portal.logout }}
      </button>
    </header>

    <p v-if="!studies.length" class="results__empty">
      <i class="fa-regular fa-folder-open" aria-hidden="true"></i>
      <span>{{ portal.empty }}</span>
    </p>

    <template v-else>
      <div class="results__bar">
        <h2 class="results__title">{{ COPY.listTitle }}</h2>
        <p class="results__count" role="status" aria-live="polite">{{ countLabel }}</p>
      </div>

      <div
        v-if="typesPresent.length > 1"
        class="results__filters"
        role="group"
        :aria-label="COPY.filterLabel"
      >
        <button
          type="button"
          class="results__filter"
          :aria-pressed="filter === 'all'"
          @click="filter = 'all'"
        >
          {{ COPY.all }}
        </button>
        <button
          v-for="type in typesPresent"
          :key="type"
          type="button"
          class="results__filter"
          :aria-pressed="filter === type"
          @click="filter = type"
        >
          <i :class="studyTypes[type].icon" aria-hidden="true"></i>
          {{ studyTypes[type].label }}
        </button>
      </div>

      <ul class="results__list">
        <li v-for="study in visible" :key="study.id">
          <StudyCard
            :study="study"
            :downloading="downloadingId === study.id"
            :disabled="Boolean(downloadingId) && downloadingId !== study.id"
            :downloaded="downloadedId === study.id"
            :error="downloadError?.id === study.id ? downloadError.message : ''"
            @download="download(study)"
          />
        </li>
      </ul>
    </template>
  </section>
</template>

<style scoped lang="scss">
.results {
  @include flex(column, stretch, flex-start, 1.25rem);

  &__head {
    @include flex(row, flex-start, space-between, 1rem);
    flex-wrap: wrap;
    padding-bottom: 1.25rem;
    border-bottom: 1px solid $line;
  }

  &__who {
    flex: 1 1 14rem;
    min-width: 0;
  }

  &__name {
    font-size: $text-xl;
    font-weight: 800;
    color: $ink;
    overflow-wrap: anywhere;

    &:focus {
      outline: none;
    }
  }

  &__greeting {
    display: block;
    font-family: $font-principal;
    font-size: 1.0625rem;
    font-weight: 600;
    color: $ink-soft;
  }

  &__id {
    margin-top: 0.4rem;
    font-size: 1rem;
    color: $ink-soft;

    i {
      margin-right: 0.35rem;
      color: $accent;
    }

    strong {
      color: $ink;
      letter-spacing: 0.04em;
    }
  }

  &__logout {
    @include flex(row, center, center, 0.5rem);
    min-height: 3rem;
    padding: 0.5rem 1.1rem;
    border: 2px solid $line;
    border-radius: $radius-sm;
    background: $surface;
    font-size: 1rem;
    font-weight: 700;
    color: $ink;
    @include transition(border-color);

    &:hover {
      border-color: $ink-soft;
    }
  }

  &__bar {
    @include flex(row, baseline, space-between, 1rem);
  }

  &__title {
    font-size: $text-lg;
    font-weight: 800;
  }

  &__count {
    font-size: 1rem;
    font-weight: 600;
    color: $ink-soft;
  }

  &__filters {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
  }

  &__filter {
    @include flex(row, center, center, 0.5rem);
    min-height: 3rem;
    padding: 0.5rem 1.1rem;
    border: 2px solid $line;
    border-radius: $radius-pill;
    background: $surface;
    font-size: 1rem;
    font-weight: 700;
    color: $ink-soft;
    @include transition(background-color);

    &[aria-pressed='true'] {
      background: $accent;
      border-color: $accent;
      color: $surface;
    }
  }

  &__list {
    @include flex(column, stretch, flex-start, 1rem);
    list-style: none;
  }

  &__empty {
    @include card;
    @include flex(column, center, center, 1rem);
    padding: 2.5rem 1.5rem;
    text-align: center;
    font-size: 1.0625rem;
    color: $ink-soft;

    i {
      font-size: 2.25rem;
      color: $accent;
    }

    span {
      max-width: 40ch;
    }
  }
}
</style>
