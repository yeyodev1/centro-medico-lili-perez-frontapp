<script setup lang="ts">
import { site, telLink, whatsappLink } from '@/config/site'

const year = new Date().getFullYear()

// Copy que aún no está en site.ts (reportado al coordinador).
const COPY = {
  nav: 'Navegación',
  contact: 'Contacto',
  results: 'Consultar resultados',
  staff: 'Acceso del personal',
  whatsapp: 'WhatsApp',
  madeBy: 'Hecho por',
}
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <p class="footer__name">{{ site.name }}</p>
        <p class="footer__tagline">{{ site.tagline }}</p>
        <p class="footer__description">{{ site.description }}</p>
      </div>

      <nav class="footer__col" :aria-label="COPY.nav">
        <h2 class="footer__heading">{{ COPY.nav }}</h2>
        <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to" class="footer__link">
          {{ link.label }}
        </RouterLink>
        <RouterLink :to="{ name: 'Results' }" class="footer__link">{{ COPY.results }}</RouterLink>
      </nav>

      <div class="footer__col">
        <h2 class="footer__heading">{{ COPY.contact }}</h2>
        <address class="footer__address">{{ site.address }}</address>
        <a v-for="phone in site.phones" :key="phone" :href="telLink(phone)" class="footer__link">
          <i class="fa-solid fa-phone" aria-hidden="true"></i> {{ phone }}
        </a>
        <a
          v-if="site.whatsapp"
          :href="whatsappLink()"
          class="footer__link"
          target="_blank"
          rel="noopener"
        >
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> {{ COPY.whatsapp }}
        </a>
        <a v-if="site.email" :href="`mailto:${site.email}`" class="footer__link">
          <i class="fa-solid fa-envelope" aria-hidden="true"></i> {{ site.email }}
        </a>
      </div>
    </div>

    <div class="footer__bar">
      <span>© {{ year }} {{ site.name }}</span>
      <RouterLink :to="{ name: 'Login' }" class="footer__staff">
        <i class="fa-solid fa-user-lock" aria-hidden="true"></i> {{ COPY.staff }}
      </RouterLink>
      <span>
        {{ COPY.madeBy }}
        <a href="https://bakano.ec" target="_blank" rel="noopener" class="footer__credit">Bakano</a>
      </span>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background: $ink;
  color: rgba($paper, 0.88);
  margin-top: auto;

  &__inner {
    @include container;
    @include flex-cards(14rem, 2rem);
    padding-block: $space-lg 2rem;

    @include from('md') {
      gap: 3rem;
      padding-block: $space-xl 2.5rem;
    }
  }

  &__brand {
    flex: 2 1 16rem;
  }

  &__name {
    font-family: $font-display;
    font-size: 1.25rem;
    font-weight: 800;
    color: $surface;
  }

  &__tagline {
    font-size: 0.9375rem;
    font-weight: 600;
    color: $accent-soft;
    margin-bottom: 0.75rem;
  }

  &__description {
    font-size: 1rem;
    color: rgba($paper, 0.8);
    max-width: 38ch;
  }

  &__col {
    @include flex(column, flex-start, flex-start, 0.1rem);
  }

  &__heading {
    @include eyebrow;
    color: $accent-soft;
    margin-bottom: 0.5rem;
  }

  &__address {
    font-size: 1rem;
    font-style: normal;
    max-width: 30ch;
    margin-bottom: 0.4rem;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    min-height: 2.75rem;
    font-size: 1rem;
    font-weight: 600;
    color: $surface;
    @include transition(color);

    &:hover {
      color: $accent-soft;
      text-decoration: underline;
    }

    &:focus-visible {
      outline-color: $surface;
    }
  }

  &__bar {
    @include container;
    @include flex(column, flex-start, flex-start, 0.25rem);
    padding-block: 1.25rem;
    border-top: 1px solid rgba($paper, 0.16);
    font-size: 0.9375rem;
    color: rgba($paper, 0.8);

    @include from('md') {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
  }

  // Discreto a propósito: el paciente no necesita verlo, el personal sabe dónde está.
  &__staff {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 2.75rem;
    color: rgba($paper, 0.8);
    text-decoration: underline;
    text-underline-offset: 0.2em;

    &:hover {
      color: $surface;
    }

    &:focus-visible {
      outline-color: $surface;
    }
  }

  &__credit {
    color: $surface;
    text-decoration: underline;
    text-underline-offset: 0.2em;

    &:focus-visible {
      outline-color: $surface;
    }
  }
}
</style>
