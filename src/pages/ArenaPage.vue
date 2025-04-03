<template>
  <div class="mt-10 mx-10 flex justify-between">
    <HeroTitle />
    <button
      v-if="listMain.length === MAX_HEROES && !someoneWon"
      class="text-white bg-primary px-4 py-2 rounded-xl hover:bg-indigo-700 transition w-60 text-center mt-4 h-10"
      @click="startBattle"
    >
      Start Battle
    </button>
    <div v-else-if="someoneWon">
      <router-link
        to="/"
        class="text-white bg-primary px-4 py-2 rounded-xl hover:bg-indigo-700 transition w-60 text-center mt-4 h-10"
      >
        Go Back
      </router-link>
    </div>
  </div>
  <div class="flex gap-8 p-8">
    <VueDraggable
      v-model="listSidebar"
      class="flex flex-col gap-2 p-4 w-1/5 h-[700px] rounded-xl shadow-md border-1 border-secondary-light overflow-auto items-center"
      animation="150"
      ghost-class="ghost"
      group="heroes"
      :disabled="someoneWon"
    >
      <HeroCard v-for="hero in listSidebar" :key="hero.name" :hero="hero" />
    </VueDraggable>

    <VueDraggable
      v-model="listMain"
      class="flex gap-12 p-8 w-3/4 h-[700px] rounded-xl overflow-hidden relative"
      animation="150"
      ghost-class="ghost"
      group="heroes"
      @add="onAdd"
      :disabled="someoneWon"
    >
      <img
        src="../assets/banner2.webp"
        alt="arena"
        class="absolute top-0 left-0 w-full h-full object-cover -z-10 motion-safe:animate-pulse opacity-90"
      />
      <div v-for="hero in listMain" :key="hero.id" class="w-1/3 h-full">
        <HeroDetailCard :hero="hero" />
      </div>

      <div
        v-if="listMain.length === 0"
        class="text-5xl text-black mt-[30%] font-bold"
      >
        Drop up to 3 heroes here
      </div>
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { VueDraggable } from "vue-draggable-plus";
import type Hero from "../features/heroes/interfaces/Hero";
import HeroCard from "../features/heroes/components/HeroCard.vue";
import HeroDetailCard from "../features/heroes/components/HeroDetailCard.vue";
import type { RankedHero } from "../interfaces/RankedHero";
import useFetchHeroes from "../features/heroes/composables/useFetchHeroes";
import HeroTitle from "../features/ui/components/HeroTitle.vue";
import { getFinalRanking } from "../features/heroes/utils/utils";
const MAX_HEROES = 3;

const { heroes } = useFetchHeroes();
const listMain = ref<(Hero | RankedHero)[]>([]);
const someoneWon = ref(false);

const listSidebar = computed(() =>
  heroes.value.filter(
    (hero) => !listMain.value.some((h) => h.name === hero.name)
  )
);

const startBattle = () => {
  someoneWon.value = true;
  const rankedHeroes = getFinalRanking(listMain.value as Hero[]);
  listMain.value = rankedHeroes;
};

function onAdd() {
  if (listMain.value.length > MAX_HEROES) {
    listMain.value.splice(MAX_HEROES);
  }
}
</script>

<style scoped>
.ghost {
  opacity: 0.4;
}
</style>
