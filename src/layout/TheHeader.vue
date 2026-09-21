<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { home, site } from '@/config/site'
import ActionButton from '@/components/ui/ActionButton.vue'

const route = useRoute()
const open = ref(false)
const root = ref<HTMLElement | null>(null)
const burger = ref<HTMLButtonElement | null>(null)

// Copy que aún no está en site.ts (reportado al coordinador).
const COPY = {
  home: 'inicio',
  nav: 'Navegación principal',
  openMenu: 'Abrir menú',
  closeMenu: 'Cerrar menú',
  menu: 'Menú',
}

function close() {
  open.value = false
}

async function closeWithEscape() {
  if (!open.value) return
  close()
  await nextTick()
  burger.value?.focus()
}

function onDocumentClick(event: MouseEvent) {
  if (!root.value?.contains(event.target as Node)) close()
}

// Los enlaces con hash comparten ruta con el inicio: RouterLink los marcaría todos como
// página actual, así que se compara la ruta completa.
function isCurrent(to: string): boolean {
  return route.fullPath === to
}

watch(open, (value) => {
  if (value) document.addEventListener('click', onDocumentClick)
  else document.removeEventListener('click', onDocumentClick)
})

watch(() => route.fullPath, close)

onUnmounted(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <header ref="root" class="header" @keydown.esc="closeWithEscape">
    <div class="header__inner">
      <RouterLink to="/" class="header__brand" :aria-label="`${site.name}, ${COPY.home}`">
        <svg class="header__mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
          <rect width="64" height="64" rx="14" />
          <path d="M26 14h12v12h12v12H38v12H26V38H14V26h12z" />
        </svg>
        <span class="header__names">
          <span class="header__name">{{ site.shortName }}</span>
          <span class="header__tagline">{{ site.tagline }}</span>
        </span>
      </RouterLink>

      <button
        ref="burger"
        type="button"
        class="header__burger"
        aria-controls="site-menu"
        :aria-expanded="open"
        :aria-label="open ? COPY.closeMenu : COPY.openMenu"
        @click="open = !open"
      >
        <i :class="open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" aria-hidden="true"></i>
        <span class="header__burger-text" aria-hidden="true">{{ COPY.menu }}</span>
      </button>

      <nav
        id="site-menu"
        class="header__nav"
        :class="{ 'header__nav--open': open }"
        :aria-label="COPY.nav"
      >
        <ul class="header__links">
          <li v-for="link in site.nav" :key="link.to">
            <RouterLink v-slot="{ href, navigate }" :to="link.to" custom>
              <a
                class="header__link"
                :href="href"
                :aria-current="isCurrent(link.to) ? 'page' : undefined"
                @click="(navigate($event), close())"
              >
                {{ link.label }}
              </a>
            </RouterLink>
          </li>
        </ul>

        <ActionButton
          class="header__cta"
          :to="{ name: 'Results' }"
          icon="fa-solid fa-magnifying-glass"
          @click="close"
        >
          {{ home.hero.cta }}
        </ActionButton>
      </nav>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: $surface;
  border-bottom: 1px solid $line;

  &__inner {
    @include container;
    @include flex(row, center, space-between, 1rem);
    position: relative;
    min-height: 4rem;

    @include from('lg') {
      min-height: 4.75rem;
    }
  }

  &__brand {
    @include flex(row, center, flex-start, 0.7rem);
    min-width: 0;
    padding-block: 0.5rem;
    color: $ink;
  }

  &__mark {
    flex: 0 0 auto;
    width: 2.5rem;
    height: 2.5rem;

    rect {
      fill: $accent;
    }

    path {
      fill: $surface;
    }
  }

  &__names {
    @include flex(column, flex-start, center);
    min-width: 0;
    line-height: 1.2;
  }

  &__name {
    font-family: $font-display;
    font-size: 1.125rem;
    font-weight: 800;
    letter-spacing: -0.01em;
  }

  &__tagline {
    font-size: 0.8125rem;
    font-weight: 600;
    color: $ink-soft;
  }

  &__burger {
    @include flex(row, center, center, 0.5rem);
    flex: 0 0 auto;
    min-height: 3rem;
    padding-inline: 0.85rem;
    border: 2px solid $line;
    border-radius: $radius-sm;
    font-size: 1.125rem;
    color: $ink;

    @include from('lg') {
      display: none;
    }
  }

  // "Menú" escrito junto al icono: muchos pacientes mayores no reconocen las tres rayas.
  &__burger-text {
    font-size: 1rem;
    font-weight: 700;
  }

  &__nav {
    display: none;

    &--open {
      @include flex(column, stretch, flex-start, 1rem);
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      padding: 0.75rem 1.25rem 1.5rem;
      background: $surface;
      border-bottom: 1px solid $line;
      box-shadow: $shadow-md;
    }

    @include from('lg') {
      @include flex(row, center, flex-end, 2rem);
      position: static;
      padding: 0;
      border: none;
      box-shadow: none;
    }
  }

  &__links {
    @include flex(column, stretch, flex-start, 0);
    list-style: none;

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      gap: 1.75rem;
    }
  }

  &__link {
    @include flex(row, center, flex-start);
    min-height: 3.25rem;
    border-bottom: 1px solid $line;
    font-size: 1.0625rem;
    font-weight: 700;
    color: $ink;
    @include transition(color);

    &:hover,
    &[aria-current='page'] {
      color: $accent;
    }

    @include from('lg') {
      min-height: 3rem;
      border-bottom: none;
      font-size: 1rem;
    }
  }

  // Doble clase: tiene que ganarle a los estilos propios de ActionButton.
  &__nav &__cta {
    @include from('lg') {
      min-height: 3rem;
      padding-block: 0.5rem;
      font-size: 1rem;
    }
  }
}
</style>
