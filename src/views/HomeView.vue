<script setup lang="ts">
import HomeHero from '@/components/home/HomeHero.vue'
import HomeSteps from '@/components/home/HomeSteps.vue'
import HomeBenefits from '@/components/home/HomeBenefits.vue'
import HomeContact from '@/components/home/HomeContact.vue'
import HelpCallout from '@/components/portal/HelpCallout.vue'
</script>

<template>
  <div class="home">
    <HomeHero />
    <HomeSteps />
    <HomeBenefits />
    <section class="home__help">
      <HelpCallout />
    </section>
    <HomeContact />
  </div>
</template>

<style scoped lang="scss">
.home {
  &__help {
    @include container;
    padding-top: $space-xl;
  }
}
</style>
