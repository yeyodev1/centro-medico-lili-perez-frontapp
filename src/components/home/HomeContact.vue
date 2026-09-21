<script setup lang="ts">
import { site, telLink, whatsappLink } from '@/config/site'

// Copy que aún no está en site.ts (reportado al coordinador).
const COPY = {
  eyebrow: 'Contacto',
  title: 'Dónde encontrarnos',
  address: 'Dirección',
  directions: 'Ver cómo llegar',
  newTab: '(se abre en otra pestaña)',
  phones: 'Teléfonos',
  whatsapp: 'WhatsApp',
  whatsappCta: 'Escríbenos por WhatsApp',
  email: 'Correo',
}

const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.name}, ${site.address}`,
)}`
</script>

<template>
  <section id="contacto" class="contact" aria-labelledby="contact-title">
    <div class="contact__inner">
      <header class="contact__head">
        <p class="contact__eyebrow">{{ COPY.eyebrow }}</p>
        <h2 id="contact-title" class="contact__title">{{ COPY.title }}</h2>
      </header>

      <div class="contact__items">
        <div class="contact__item">
          <span class="contact__icon" aria-hidden="true">
            <i class="fa-solid fa-location-dot"></i>
          </span>
          <div class="contact__body">
            <h3 class="contact__label">{{ COPY.address }}</h3>
            <address class="contact__value">{{ site.address }}</address>
            <a class="contact__link" :href="mapsLink" target="_blank" rel="noopener">
              {{ COPY.directions }}
              <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
              <span class="visually-hidden">{{ COPY.newTab }}</span>
            </a>
          </div>
        </div>

        <div class="contact__item">
          <span class="contact__icon" aria-hidden="true"><i class="fa-solid fa-phone"></i></span>
          <div class="contact__body">
            <h3 class="contact__label">{{ COPY.phones }}</h3>
            <a
              v-for="phone in site.phones"
              :key="phone"
              class="contact__value contact__value--link"
              :href="telLink(phone)"
            >
              {{ phone }}
            </a>
          </div>
        </div>

        <div v-if="site.whatsapp" class="contact__item">
          <span class="contact__icon" aria-hidden="true">
            <i class="fa-brands fa-whatsapp"></i>
          </span>
          <div class="contact__body">
            <h3 class="contact__label">{{ COPY.whatsapp }}</h3>
            <a
              class="contact__value contact__value--link"
              :href="whatsappLink()"
              target="_blank"
              rel="noopener"
            >
              {{ COPY.whatsappCta }}
              <span class="visually-hidden">{{ COPY.newTab }}</span>
            </a>
          </div>
        </div>

        <div v-if="site.email" class="contact__item">
          <span class="contact__icon" aria-hidden="true">
            <i class="fa-solid fa-envelope"></i>
          </span>
          <div class="contact__body">
            <h3 class="contact__label">{{ COPY.email }}</h3>
            <a class="contact__value contact__value--link" :href="`mailto:${site.email}`">
              {{ site.email }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.contact {
  scroll-margin-top: 4.5rem;
  padding-block: $space-xl;

  &__inner {
    @include container;
  }

  &__head {
    margin-bottom: 1.75rem;
  }

  &__eyebrow {
    @include eyebrow;
    margin-bottom: 0.6rem;
  }

  &__title {
    @include display($display-sm);
    color: $ink;
  }

  &__items {
    @include flex-cards(17rem, 1rem);

    @include from('md') {
      gap: 1.5rem;
    }
  }

  &__item {
    @include card;
    @include flex(row, flex-start, flex-start, 1rem);
    padding: 1.25rem;

    @include from('md') {
      padding: 1.5rem;
    }
  }

  &__icon {
    @include flex(row, center, center);
    flex: 0 0 auto;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: $sand;
    color: $accent;
    font-size: 1.2rem;
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.15rem);
    min-width: 0;
  }

  &__label {
    font-family: $font-principal;
    font-size: 0.9375rem;
    font-weight: 700;
    color: $ink-soft;
  }

  &__value {
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 700;
    line-height: 1.45;
    color: $ink;
    overflow-wrap: anywhere;

    // Área táctil cómoda: los teléfonos se tocan con el pulgar.
    &--link {
      display: inline-flex;
      align-items: center;
      min-height: 2.75rem;
      color: $accent-deep;
      text-decoration: underline;
      text-underline-offset: 0.2em;
    }
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    min-height: 2.75rem;
    font-size: 1rem;
    font-weight: 700;
    color: $accent-deep;
    text-decoration: underline;
    text-underline-offset: 0.2em;

    i {
      font-size: 0.85rem;
    }
  }
}
</style>
