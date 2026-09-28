<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { panelNav, site } from '@/config/site'
import { panelCopy } from '@/config/panel'

const emit = defineEmits<{ logout: [] }>()

const route = useRoute()
const userStore = useUserStore()
const menuOpen = ref(false)

const links = computed(() =>
  panelNav.filter((item) => !('adminOnly' in item && item.adminOnly) || userStore.isAdmin),
)

const roleLabel = computed(() => {
  const role = userStore.user?.accountType || ''
  return panelCopy.roles[role] || role
})

function isActive(item: (typeof panelNav)[number]): boolean {
  if ('exact' in item && item.exact) return route.path === item.to
  return route.path === item.to || route.path.startsWith(`${item.to}/`)
}

watch(
  () => route.fullPath,
  () => (menuOpen.value = false),
)
</script>

<template>
  <aside class="side">
    <div class="side__bar">
      <RouterLink class="side__brand" to="/panel">
        <span class="side__brand-name">{{ site.name }}</span>
        <span class="side__brand-sub">{{ panelCopy.brand }}</span>
      </RouterLink>
      <button
        class="side__toggle"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="panel-menu"
        @click="menuOpen = !menuOpen"
      >
        <i :class="menuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'" aria-hidden="true"></i>
        <span class="visually-hidden">Menú</span>
      </button>
    </div>

    <div id="panel-menu" class="side__menu" :class="{ 'side__menu--open': menuOpen }">
      <nav class="side__nav" aria-label="Panel">
        <RouterLink
          v-for="item in links"
          :key="item.to"
          class="side__link"
          :class="{ 'side__link--active': isActive(item) }"
          :aria-current="isActive(item) ? 'page' : undefined"
          :to="item.to"
        >
          <i :class="item.icon" aria-hidden="true"></i> {{ item.label }}
        </RouterLink>
      </nav>

      <div class="side__session">
        <p class="side__user">{{ userStore.user?.name || userStore.user?.email }}</p>
        <p class="side__role">{{ roleLabel }}</p>
        <RouterLink class="side__aux" to="/">
          <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
          {{ panelCopy.viewPortal }}
        </RouterLink>
        <button class="side__aux" type="button" @click="emit('logout')">
          <i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
          {{ panelCopy.logout }}
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped lang="scss">
$side-width: 236px;

.side {
  position: sticky;
  top: 0;
  z-index: 50;
  background: $surface;
  border-bottom: 1px solid $line;

  @include from('lg') {
    @include flex(column, stretch, flex-start);
    flex: none;
    width: $side-width;
    height: 100vh;
    border-bottom: none;
    border-right: 1px solid $line;
  }

  &__bar {
    @include flex(row, center, space-between, 1rem);
    padding: 0.6rem 1rem;

    @include from('lg') {
      padding: 1.2rem 1.1rem 1rem;
    }
  }

  &__brand {
    @include flex(column, flex-start, center);
    line-height: 1.2;
  }

  &__brand-name {
    font-family: $font-display;
    font-weight: 800;
    font-size: 1rem;
    color: $accent;
  }

  &__brand-sub {
    font-size: 0.74rem;
    color: $ink-muted;
  }

  &__toggle {
    width: 44px;
    height: 44px;
    border: 1px solid $line;
    border-radius: 8px;
    font-size: 1.05rem;

    @include from('lg') {
      display: none;
    }
  }

  &__menu {
    display: none;
    padding: 0.4rem 0.75rem 0.9rem;
    border-top: 1px solid $line;

    &--open {
      @include flex(column, stretch, flex-start, 0.75rem);
    }

    @include from('lg') {
      @include flex(column, stretch, space-between, 1rem);
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      border-top: none;
      padding: 0.25rem 0.75rem 1rem;
    }
  }

  &__nav {
    @include flex(column, stretch, flex-start, 0.15rem);
  }

  &__link {
    @include flex(row, center, flex-start, 0.7rem);
    min-height: 44px;
    padding: 0.5rem 0.7rem;
    border-radius: 8px;
    font-size: 0.93rem;
    font-weight: 600;
    color: $ink-soft;

    i {
      width: 1.2rem;
      text-align: center;
    }

    &:hover {
      background: $paper;
      color: $ink;
    }

    &--active,
    &--active:hover {
      background: $accent-soft;
      color: $accent-deep;
    }

    @include from('lg') {
      min-height: 40px;
    }
  }

  &__session {
    @include flex(column, stretch, flex-start, 0.1rem);
    padding-top: 0.75rem;
    border-top: 1px solid $line;
  }

  &__user {
    padding-inline: 0.7rem;
    font-weight: 700;
    font-size: 0.9rem;
    line-height: 1.3;
    overflow-wrap: anywhere;
  }

  &__role {
    padding-inline: 0.7rem;
    margin-bottom: 0.4rem;
    font-size: 0.78rem;
    color: $ink-muted;
  }

  &__aux {
    @include flex(row, center, flex-start, 0.6rem);
    min-height: 40px;
    padding: 0.4rem 0.7rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    color: $ink-soft;
    text-align: left;

    &:hover {
      background: $paper;
      color: $ink;
    }
  }
}
</style>
