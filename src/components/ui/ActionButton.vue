<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

/**
 * Botón grande del sitio público: área táctil de 52 px y texto de 17 px, pensado para
 * pacientes mayores en el celular. Sirve como <button>, <a> o RouterLink.
 */
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'outline' | 'light'
    type?: 'button' | 'submit'
    to?: RouteLocationRaw
    href?: string
    icon?: string
    loading?: boolean
    disabled?: boolean
    block?: boolean
  }>(),
  { variant: 'primary', type: 'button' },
)

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'))

const attrs = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) return { href: props.href }
  return { type: props.type, disabled: props.disabled || props.loading }
})
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    class="action"
    :class="[`action--${variant}`, { 'action--block': block }]"
    :aria-busy="loading || undefined"
  >
    <i v-if="loading" class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
    <i v-else-if="icon" :class="icon" aria-hidden="true"></i>
    <span><slot /></span>
  </component>
</template>

<style scoped lang="scss">
.action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  min-height: 3.25rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid transparent;
  border-radius: $radius-sm;
  font-family: $font-principal;
  font-size: 1.0625rem;
  font-weight: 700;
  line-height: 1.25;
  text-align: center;
  cursor: pointer;
  @include transition(background-color);

  &:focus-visible {
    outline: 3px solid $accent;
    outline-offset: 3px;
  }

  &--block {
    display: flex;
    width: 100%;
  }

  &--primary {
    background: $accent;
    color: $surface;

    &:hover {
      background: $accent-deep;
    }
  }

  &--outline {
    background: $surface;
    border-color: $accent;
    color: $accent-deep;

    &:hover {
      background: $sand;
    }
  }

  &--light {
    background: $surface;
    color: $accent-deep;

    &:hover {
      background: $sand;
    }

    &:focus-visible {
      outline-color: $surface;
    }
  }

  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
}
</style>
