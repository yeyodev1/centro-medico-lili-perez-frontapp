<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  title: string
  subtitle?: string
  back?: { to: RouteLocationRaw; label: string }
}>()
</script>

<template>
  <header class="phead">
    <div class="phead__text">
      <RouterLink v-if="back" class="phead__back" :to="back.to">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> {{ back.label }}
      </RouterLink>
      <h1 class="phead__title">{{ title }}</h1>
      <p v-if="subtitle" class="phead__subtitle">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.default" class="phead__actions">
      <slot />
    </div>
  </header>
</template>

<style scoped lang="scss">
.phead {
  @include flex(column, stretch, flex-start, 0.85rem);
  margin-bottom: 1.1rem;

  @include from('md') {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }

  &__text {
    min-width: 0;
  }

  &__back {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-height: 32px;
    font-size: 0.84rem;
    font-weight: 600;
    color: $ink-soft;

    &:hover {
      color: $accent;
    }
  }

  &__title {
    font-size: 1.4rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    overflow-wrap: anywhere;

    @include from('md') {
      font-size: 1.6rem;
    }
  }

  &__subtitle {
    font-size: 0.9rem;
    color: $ink-soft;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
  }
}
</style>
