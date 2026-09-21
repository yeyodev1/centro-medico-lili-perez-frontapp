<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import DashboardStatCards from '@/components/panel/DashboardStatCards.vue'
import PanelPageHeader from '@/components/panel/PanelPageHeader.vue'
import PanelState from '@/components/panel/PanelState.vue'
import PatientSearchBox from '@/components/panel/PatientSearchBox.vue'
import RecentStudies from '@/components/panel/RecentStudies.vue'
import { dashboardService } from '@/services/dashboard.service'
import { useUserStore } from '@/stores/user'
import { errorMessage } from '@/utils/apiError'
import { panelCopy } from '@/config/panel'
import type { DashboardStats } from '@/types'

const copy = panelCopy.dashboard
const router = useRouter()
const userStore = useUserStore()

const term = ref('')
const stats = ref<DashboardStats | null>(null)
const loading = ref(true)
const error = ref('')

function search() {
  const value = term.value.trim()
  router.push({ name: 'Patients', query: value ? { search: value } : {} })
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    stats.value = await dashboardService.stats()
  } catch (e) {
    error.value = errorMessage(e, 'No se pudo cargar el resumen.')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section class="dash">
    <PanelPageHeader
      :title="copy.title"
      :subtitle="userStore.user?.name ? `Hola, ${userStore.user.name}` : undefined"
    />

    <!-- El buscador va primero: es lo que el asesor viene a hacer, no a mirar cifras. -->
    <div class="dash__search">
      <h2 class="dash__search-title">{{ copy.searchTitle }}</h2>
      <PatientSearchBox v-model="term" autofocus with-button @submit="search" />
      <div class="dash__quick">
        <p class="dash__hint">{{ panelCopy.search.hint }}</p>
        <RouterLink class="btn btn--ghost btn--sm" :to="{ name: 'PatientNew' }">
          <i class="fa-solid fa-user-plus" aria-hidden="true"></i> {{ copy.newPatient }}
        </RouterLink>
        <RouterLink class="btn btn--ghost btn--sm" :to="{ name: 'Patients' }">
          <i class="fa-solid fa-list" aria-hidden="true"></i> {{ copy.allPatients }}
        </RouterLink>
      </div>
    </div>

    <DashboardStatCards :stats="stats" />

    <h2 class="dash__subtitle">{{ copy.recentTitle }}</h2>
    <PanelState v-if="loading" kind="loading" :rows="4" />
    <PanelState
      v-else-if="error"
      kind="error"
      title="No se pudo cargar"
      :message="error"
      @retry="load"
    />
    <PanelState v-else-if="!stats?.recentStudies?.length" kind="empty" :title="copy.recentEmpty" />
    <RecentStudies v-else :studies="stats.recentStudies" />
  </section>
</template>

<style scoped lang="scss">
.dash {
  max-width: 1080px;

  &__search {
    @include flex(column, stretch, flex-start, 0.7rem);
    margin-bottom: 1rem;
    padding: 1rem;
    background: $surface;
    border: 1px solid $line;
    border-left: 4px solid $accent;
    border-radius: 10px;

    @include from('md') {
      padding: 1.25rem 1.4rem;
    }
  }

  &__search-title {
    font-size: 1.05rem;
    font-weight: 800;
  }

  &__quick {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }

  &__hint {
    flex: 1 1 100%;
    font-size: 0.82rem;
    color: $ink-muted;

    @include from('md') {
      flex: 1;
    }
  }

  &__subtitle {
    margin: 1.6rem 0 0.7rem;
    font-size: 1.05rem;
    font-weight: 800;
  }
}
</style>
