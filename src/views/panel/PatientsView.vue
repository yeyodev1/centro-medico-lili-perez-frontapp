<script setup lang="ts">
import { computed } from 'vue'
import PanelPageHeader from '@/components/panel/PanelPageHeader.vue'
import PanelPagination from '@/components/panel/PanelPagination.vue'
import PanelState from '@/components/panel/PanelState.vue'
import PatientSearchBox from '@/components/panel/PatientSearchBox.vue'
import PatientsTable from '@/components/panel/PatientsTable.vue'
import { usePatientSearch } from '@/composables/usePatientSearch'
import { panelCopy } from '@/config/panel'

const copy = panelCopy.patients

const {
  term,
  search,
  status,
  result,
  loading,
  error,
  cedulaCandidate,
  commitTerm,
  setStatus,
  setPage,
  reload,
} = usePatientSearch()

const isFiltered = computed(() => Boolean(search.value || status.value))

const newPatientLink = computed(() => ({
  name: 'PatientNew',
  query: cedulaCandidate.value ? { cedula: cedulaCandidate.value } : {},
}))
</script>

<template>
  <section class="patients">
    <PanelPageHeader :title="copy.title">
      <RouterLink class="btn btn--primary" :to="{ name: 'PatientNew' }">
        <i class="fa-solid fa-user-plus" aria-hidden="true"></i> {{ copy.create }}
      </RouterLink>
    </PanelPageHeader>

    <div class="patients__tools">
      <PatientSearchBox v-model="term" autofocus :loading="loading" @submit="commitTerm" />

      <div class="patients__filters" role="group" aria-label="Filtrar por estado">
        <button
          v-for="filter in copy.filters"
          :key="filter.value"
          class="patients__filter"
          :class="{ 'patients__filter--active': status === filter.value }"
          type="button"
          :aria-pressed="status === filter.value"
          @click="setStatus(filter.value)"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <PanelState
      v-if="error"
      kind="error"
      title="No se pudo cargar"
      :message="error"
      @retry="reload"
    />

    <PanelState v-else-if="!result" kind="loading" :rows="8" />

    <PanelState
      v-else-if="!result.items.length"
      kind="empty"
      :title="isFiltered ? copy.empty : copy.emptyAll"
      :message="search ? `Buscaste: “${search}”` : undefined"
    >
      <RouterLink class="btn btn--primary btn--sm" :to="newPatientLink">
        <i class="fa-solid fa-user-plus" aria-hidden="true"></i>
        {{ cedulaCandidate ? `${copy.createWithCedula} (${cedulaCandidate})` : copy.create }}
      </RouterLink>
    </PanelState>

    <div v-else class="patients__list" :class="{ 'patients__list--stale': loading }">
      <PatientsTable :patients="result.items" />
      <PanelPagination
        :page="result.page"
        :pages="result.pages"
        :total="result.total"
        :disabled="loading"
        @change="setPage"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.patients {
  &__tools {
    @include flex(column, stretch, flex-start, 0.7rem);
    margin-bottom: 1rem;
  }

  &__filters {
    @include flex(row, center, flex-start, 0.35rem);
    flex-wrap: wrap;
  }

  &__filter {
    min-height: 40px;
    padding: 0.3rem 0.9rem;
    border: 1px solid $line;
    border-radius: 8px;
    background: $surface;
    font-size: 0.86rem;
    font-weight: 600;
    color: $ink-soft;

    &:hover {
      border-color: $accent;
      color: $ink;
    }

    &--active,
    &--active:hover {
      background: $accent;
      border-color: $accent;
      color: $surface;
    }

    @include from('md') {
      min-height: 34px;
    }
  }

  // Mientras llega la búsqueda nueva se atenúa la anterior en vez de parpadear a esqueleto.
  &__list {
    transition: opacity 0.15s ease;

    &--stale {
      opacity: 0.55;
    }
  }
}
</style>
