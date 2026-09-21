<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import PanelSidebar from '@/components/panel/PanelSidebar.vue'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { useSessionExpiry } from '@/composables/useSessionExpiry'
import { panelCopy } from '@/config/panel'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()

function logout() {
  userStore.clear()
  router.replace('/login')
}

// Un 401 en cualquier pantalla: fuera, y de vuelta a donde estaba tras ingresar.
let expiring = false
useSessionExpiry(() => {
  if (expiring) return
  expiring = true
  userStore.clear()
  toast.error(panelCopy.sessionExpired)
  router.replace({ name: 'Login', query: { next: route.fullPath } })
})
</script>

<template>
  <div class="panel">
    <PanelSidebar @logout="logout" />

    <div class="panel__content">
      <!-- key por path: de un paciente a otro se remonta la vista; la query (búsqueda) no. -->
      <RouterView v-slot="{ Component, route: current }">
        <component :is="Component" :key="current.path" />
      </RouterView>
    </div>

    <!-- Destino de los modales del panel: adentro, para que hereden estos estilos. -->
    <div id="panel-overlays"></div>
  </div>
</template>

<style scoped lang="scss">
.panel {
  @include flex(column, stretch, flex-start);
  flex: 1;
  min-height: 100vh;
  background: $paper;

  @include from('lg') {
    flex-direction: row;
  }

  &__content {
    flex: 1;
    min-width: 0;
    width: 100%;
    max-width: 1240px;
    padding: 1.1rem 1rem 3rem;

    @include from('md') {
      padding: 1.5rem 1.75rem 3rem;
    }
  }

  // Botones del panel: más compactos y rectos que los del sitio público.
  :deep(.btn) {
    min-height: 44px;
    padding: 0.55rem 1rem;
    border-radius: 8px;
    font-size: 0.9rem;
    letter-spacing: 0;
    transform: none;

    @include from('md') {
      min-height: 38px;
    }
  }

  :deep(.btn--ghost) {
    background: $surface;
    border-color: $line;
    color: $ink;

    &:hover {
      background: $sand;
      border-color: $accent;
      color: $ink;
    }
  }

  // Acciones destructivas que no son el botón principal (eliminar en una fila).
  :deep(.btn--ghost.is-danger) {
    color: $danger;

    &:hover {
      background: $danger-bg;
      border-color: $danger;
      color: darken($danger, 8);
    }
  }

  :deep(.btn--sm) {
    min-height: 36px;
    padding: 0.35rem 0.7rem;
    font-size: 0.82rem;

    @include from('md') {
      min-height: 32px;
    }
  }

  :deep(.btn--danger:hover) {
    background: darken($danger, 8);
  }

  :deep(.btn--block) {
    width: 100%;
  }
}
</style>
