<script setup lang="ts">
import { home } from '@/config/site'
import ActionButton from '@/components/ui/ActionButton.vue'

// Copy que aún no está en site.ts (reportado al coordinador).
const COPY = {
  code: 'Error 404',
  title: 'Esta página no existe',
  text: 'Puede que el enlace esté mal escrito. Desde aquí puedes consultar tus resultados o volver al inicio.',
  home: 'Volver al inicio',
}
</script>

<template>
  <section class="not-found" aria-labelledby="not-found-title">
    <span class="not-found__icon" aria-hidden="true"><i class="fa-solid fa-map-signs"></i></span>
    <p class="not-found__code">{{ COPY.code }}</p>
    <h1 id="not-found-title" class="not-found__title">{{ COPY.title }}</h1>
    <p class="not-found__text">{{ COPY.text }}</p>

    <div class="not-found__actions">
      <ActionButton :to="{ name: 'Results' }" icon="fa-solid fa-magnifying-glass" block>
        {{ home.hero.cta }}
      </ActionButton>
      <ActionButton :to="{ name: 'Home' }" variant="outline" block>{{ COPY.home }}</ActionButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
.not-found {
  @include container(560px);
  @include flex(column, center, center, 0.75rem);
  flex: 1;
  text-align: center;
  padding-block: $space-xl;

  &__icon {
    @include flex(row, center, center);
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: $sand;
    color: $accent;
    font-size: 1.6rem;
    margin-bottom: 0.5rem;
  }

  &__code {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm);
    color: $ink;
  }

  &__text {
    font-size: 1.0625rem;
    color: $ink-soft;
    max-width: 42ch;
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.75rem);
    width: 100%;
    max-width: 22rem;
    margin-top: 1rem;
  }
}
</style>
