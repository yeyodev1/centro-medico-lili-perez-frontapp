<script setup lang="ts">
import { home } from '@/config/site'
</script>

<template>
  <section id="como-funciona" class="steps" aria-labelledby="steps-title">
    <div class="steps__inner">
      <header class="steps__head">
        <p class="steps__eyebrow">{{ home.steps.eyebrow }}</p>
        <h2 id="steps-title" class="steps__title">{{ home.steps.title }}</h2>
      </header>

      <ol class="steps__list">
        <li v-for="(step, index) in home.steps.items" :key="step.title" class="step">
          <span class="step__number" aria-hidden="true">{{ index + 1 }}</span>
          <div class="step__body">
            <h3 class="step__title">
              <i :class="step.icon" aria-hidden="true"></i>
              {{ step.title }}
            </h3>
            <p class="step__text">{{ step.text }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped lang="scss">
.steps {
  // El header es sticky: sin este margen el ancla queda tapada.
  scroll-margin-top: 4.5rem;
  padding-block: $space-xl;

  &__inner {
    @include container;
  }

  &__head {
    margin-bottom: 2rem;

    @include from('md') {
      margin-bottom: 2.75rem;
    }
  }

  &__eyebrow {
    @include eyebrow;
    margin-bottom: 0.6rem;
  }

  &__title {
    @include display($display-sm);
    color: $ink;
  }

  &__list {
    @include flex-cards(16rem, 0);
    list-style: none;

    // Tres en una fila desde tablet: con la base de 16rem la tercera caería sola abajo.
    @include from('md') {
      gap: 2.5rem;

      > * {
        flex-basis: 11rem;
      }
    }
  }
}

.step {
  @include flex(row, flex-start, flex-start, 1rem);
  position: relative;
  padding-bottom: 1.75rem;

  // En el celular una línea une los números: se lee como una secuencia, no como tres cajas.
  &:not(:last-child)::before {
    content: '';
    position: absolute;
    top: 3rem;
    bottom: 0.25rem;
    left: calc(1.375rem - 1px);
    width: 2px;
    background: $line;
  }

  @include from('md') {
    flex-direction: column;
    gap: 1.1rem;
    padding-bottom: 0;

    &:not(:last-child)::before {
      display: none;
    }
  }

  &__number {
    @include flex(row, center, center);
    flex: 0 0 auto;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: $accent;
    color: $surface;
    font-family: $font-display;
    font-size: 1.25rem;
    font-weight: 800;
  }

  &__body {
    min-width: 0;
    padding-top: 0.35rem;

    @include from('md') {
      padding-top: 0;
    }
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 800;
    color: $ink;
    margin-bottom: 0.4rem;

    i {
      margin-right: 0.35rem;
      font-size: 1.05rem;
      color: $accent;
    }
  }

  &__text {
    font-size: 1.0625rem;
    color: $ink-soft;
    max-width: 38ch;
  }
}
</style>
