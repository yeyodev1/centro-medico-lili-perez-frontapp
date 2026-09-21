<script setup lang="ts">
import { home, site, telLink } from '@/config/site'
import ActionButton from '@/components/ui/ActionButton.vue'

// En el inicio es un <h2> de sección; dentro de /resultados baja a <h3>.
withDefaults(defineProps<{ headingLevel?: 2 | 3 }>(), { headingLevel: 2 })

// Copy que aún no está en site.ts (reportado al coordinador).
const COPY = { call: 'Llamar al' }
</script>

<template>
  <aside class="help">
    <span class="help__icon" aria-hidden="true"><i class="fa-solid fa-phone-volume"></i></span>

    <div class="help__body">
      <component :is="`h${headingLevel}`" class="help__title">{{ home.help.title }}</component>
      <p class="help__text">{{ home.help.text }}</p>
    </div>

    <ul class="help__phones">
      <li v-for="phone in site.phones" :key="phone">
        <ActionButton :href="telLink(phone)" variant="outline" icon="fa-solid fa-phone" block>
          <span class="visually-hidden">{{ COPY.call }}</span> {{ phone }}
        </ActionButton>
      </li>
    </ul>
  </aside>
</template>

<style scoped lang="scss">
.help {
  // Con wrap y bases en rem el bloque se acomoda solo: en fila si el contenedor es ancho,
  // apilado en el celular o dentro de la columna angosta de /resultados.
  @include flex(row, center, flex-start, 1.25rem);
  flex-wrap: wrap;
  padding: 1.5rem 1.25rem;
  background: $sand;
  border: 1px solid $line;
  border-radius: $radius-md;

  @include from('md') {
    gap: 1.5rem 1.75rem;
    padding: 2rem;
  }

  &__icon {
    @include flex(row, center, center);
    flex: 0 0 auto;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: $accent;
    color: $surface;
    font-size: 1.2rem;
  }

  &__body {
    flex: 1 1 14rem;
    min-width: 0;
  }

  &__title {
    font-size: $text-xl;
    font-weight: 800;
    color: $ink;
    margin-bottom: 0.4rem;
  }

  &__text {
    font-size: 1.0625rem;
    color: $ink-soft;
    max-width: 48ch;
  }

  &__phones {
    @include flex(column, stretch, flex-start, 0.75rem);
    flex: 1 1 14rem;
    list-style: none;
  }
}
</style>
