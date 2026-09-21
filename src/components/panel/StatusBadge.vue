<script setup lang="ts">
defineProps<{
  tone?: 'success' | 'muted' | 'warning' | 'danger' | 'accent'
  icon?: string
}>()
</script>

<template>
  <span class="badge" :class="`badge--${tone || 'muted'}`">
    <i v-if="icon" :class="icon" aria-hidden="true"></i>
    <slot />
  </span>
</template>

<style scoped lang="scss">
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.12rem 0.5rem;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 700;
  line-height: 1.5;
  white-space: nowrap;

  &--success {
    background: $success-bg;
    color: darken($success, 12);
  }

  &--muted {
    background: $sand;
    color: $ink-soft;
  }

  &--warning {
    background: $warning-bg;
    color: darken($warning, 22);
  }

  &--danger {
    background: $danger-bg;
    color: darken($danger, 8);
  }

  &--accent {
    background: $accent-soft;
    color: $accent-deep;
  }
}
</style>
