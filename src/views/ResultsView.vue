<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { usePortalSession } from '@/composables/usePortalSession'
import PortalLookupForm from '@/components/portal/PortalLookupForm.vue'
import PortalResults from '@/components/portal/PortalResults.vue'
import HelpCallout from '@/components/portal/HelpCallout.vue'

const { isActive, restoring, restore, clearMessages } = usePortalSession()

// Copy que aún no está en site.ts (reportado al coordinador).
const COPY = { restoring: 'Cargando tus resultados…' }

onMounted(restore)
onUnmounted(clearMessages)
</script>

<template>
  <div class="portal" :class="{ 'portal--wide': isActive }">
    <p v-if="restoring" class="portal__loading" role="status">
      <i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
      {{ COPY.restoring }}
    </p>
    <PortalResults v-else-if="isActive" />
    <PortalLookupForm v-else />

    <HelpCallout class="portal__help" :heading-level="2" />
  </div>
</template>

<style scoped lang="scss">
.portal {
  @include container(560px);
  @include flex(column, stretch, flex-start, 1.5rem);
  flex: 1;
  padding-block: 1.5rem $space-xl;

  @include from('md') {
    padding-block: $space-lg $space-xl;
  }

  // Con la lista abierta hace falta más ancho: tarjeta con datos y botón en una fila.
  &--wide {
    max-width: 880px;
  }

  &__loading {
    @include flex(row, center, center, 0.75rem);
    padding-block: $space-xl;
    font-size: 1.0625rem;
    font-weight: 600;
    color: $ink-soft;
  }

  &__help {
    margin-top: 0.5rem;
  }
}
</style>
