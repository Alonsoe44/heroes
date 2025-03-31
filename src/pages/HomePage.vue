<template>
  <div class="w-full h-[500px] relative">
    <div
      class="w-full h-[500px] flex flex-col pl-[20%] justify-center relative"
    >
      <HeroTitle />
      <router-link
        to="/arena"
        class="text-white bg-primary px-4 py-2 rounded-xl hover:bg-indigo-700 transition w-60 text-center mt-4"
      >
        Enter the Arena
      </router-link>
    </div>
    <img
      :src="bannerImage"
      alt="banner"
      class="w-full h-full object-cover absolute top-0 -z-20"
    />
  </div>
  <div class="flex flex-col items-center justify-center w-full mt-4">
    <div class="flex flex-col items-center justify-center w-3/4 max-w-[1000px]">
      <div class="flex items-center w-full mb-4">
        <button
          @click="openModal = true"
          class="text-primary border-primary border-2 px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition text-center mt-4 mr-4 w-36 font-bold"
        >
          Create Hero
        </button>

        <ModalComponent :isOpen="openModal" @close="openModal = false">
          <CreateHeroForm @success="onHeroCreated" />
        </ModalComponent>
      </div>
      <div class="flex flex-wrap w-full gap-4 mb-8">
        <div v-if="loading" class="text-center py-10">Loading heroes...</div>
        <HeroCard
          v-for="hero in heroes"
          :key="hero.id"
          :hero="hero"
          :class="{ 'highlight-animation': hero.id === newHeroId }"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import bannerImage from "../assets/banner.webp";
import useFetchHeroes from "../features/heroes/composables/useFetchHeroes";
import type Hero from "../features/heroes/interfaces/Hero";
import HeroCard from "../features/heroes/components/HeroCard.vue";
import CreateHeroForm from "../features/heroes/components/CreateHeroForm.vue";
import ModalComponent from "../features/ui/components/ModalContainer.vue";
import HeroTitle from "../features/ui/components/HeroTitle.vue";

const { loading, heroes } = useFetchHeroes();
const newHeroId = ref<string | null>(null);
const openModal = ref(false);

const onHeroCreated = (hero: Hero) => {
  newHeroId.value = hero.id;
  openModal.value = false;

  setTimeout(() => {
    newHeroId.value = null;
  }, 2000);
};
</script>

<style scoped>
@keyframes highlightCard {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(79, 70, 229, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(79, 70, 229, 0);
  }
}

.highlight-animation {
  animation: highlightCard 1s ease-in-out;
  animation-iteration-count: 3s;
}
</style>
