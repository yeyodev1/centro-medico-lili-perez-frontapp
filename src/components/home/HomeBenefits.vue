<script setup lang="ts">
import { home } from '@/config/site'
</script>

<template>
  <section class="benefits" aria-labelledby="benefits-title">
    <div class="benefits__inner">
      <header class="benefits__head">
        <p class="benefits__eyebrow">{{ home.benefits.eyebrow }}</p>
        <h2 id="benefits-title" class="benefits__title">{{ home.benefits.title }}</h2>
      </header>

      <ul class="benefits__list">
        <li v-for="item in home.benefits.items" :key="item.title" class="benefit">
          <span class="benefit__icon" aria-hidden="true"><i :class="item.icon"></i></span>
          <div class="benefit__body">
            <h3 class="benefit__title">{{ item.title }}</h3>
            <p class="benefit__text">{{ item.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.benefits {
  background: $surface;
  border-block: 1px solid $line;
  padding-block: $space-xl;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 1.5rem);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
      gap: 4rem;
    }
  }

  &__head {
    @include from('lg') {
      flex: 1 1 0;
      position: sticky;
      top: 6rem;
    }
  }

  &__eyebrow {
    @include eyebrow;
    margin-bottom: 0.6rem;
  }

  &__title {
    @include display($display-sm);
    color: $ink;
    max-width: 18ch;
  }

  &__list {
    list-style: none;

    @include from('lg') {
      flex: 1.4 1 0;
    }
  }
}

// Filas con separador en vez de tarjetas: es una lista de razones, no un catálogo.
.benefit {
  @include flex(row, flex-start, flex-start, 1rem);
  padding-block: 1.25rem;
  border-top: 1px solid $line;

  &:first-child {
    border-top: none;
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &__icon {
    @include flex(row, center, center);
    flex: 0 0 auto;
    width: 3rem;
    height: 3rem;
    border-radius: $radius-sm;
    background: $sand;
    color: $accent;
    font-size: 1.25rem;
  }

  &__body {
    min-width: 0;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 800;
    color: $ink;
    margin-bottom: 0.3rem;
  }

  &__text {
    font-size: 1.0625rem;
    color: $ink-soft;
    max-width: 52ch;
  }
}
</style>
