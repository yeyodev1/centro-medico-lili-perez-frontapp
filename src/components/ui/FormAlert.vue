<script setup lang="ts">
withDefaults(defineProps<{ tone?: 'error' | 'info' | 'success' }>(), { tone: 'error' })

const icons = {
  error: 'fa-solid fa-circle-exclamation',
  info: 'fa-solid fa-circle-info',
  success: 'fa-solid fa-circle-check',
}
</script>

<template>
  <!-- `alert` interrumpe al lector de pantalla; los avisos que no son error usan `status`. -->
  <p class="alert" :class="`alert--${tone}`" :role="tone === 'error' ? 'alert' : 'status'">
    <i :class="icons[tone]" aria-hidden="true"></i>
    <span><slot /></span>
  </p>
</template>

<style scoped lang="scss">
.alert {
  @include flex(row, flex-start, flex-start, 0.7rem);
  padding: 0.9rem 1rem;
  border-radius: $radius-sm;
  border-left: 4px solid;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.45;

  i {
    margin-top: 0.2rem;
    font-size: 1.1rem;
  }

  // Tinta oscura sobre fondo tenue: el rojo/verde puro no llega a contraste AA en texto.
  &--error {
    background: $danger-bg;
    border-color: $danger;
    color: darken($danger, 18);
  }

  &--info {
    background: $sand;
    border-color: $accent;
    color: $accent-deep;
  }

  &--success {
    background: $success-bg;
    border-color: $success;
    color: darken($success, 18);
  }
}
</style>
