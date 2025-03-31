import { defineStore } from "pinia";
import { ref } from "vue";
import type Hero from "../interfaces/Hero";

const useHeroStore = defineStore("hero", () => {
  const heroes = ref<Hero[]>([]);

  const setHeroes = (newHeroes: Hero[]) => {
    heroes.value = newHeroes;
  };

  const addHero = (hero: Hero) => {
    heroes.value.push(hero);
  };

  const deleteHero = (heroId: string) => {
    heroes.value = heroes.value.filter((hero) => hero.id !== heroId);
  };

  const updateHero = (heroId: string, hero: Hero) => {
    const index = heroes.value.findIndex((hero) => hero.id === heroId);
    if (index !== -1) {
      heroes.value[index] = hero;
    }
  };

  return { heroes, addHero, setHeroes, deleteHero, updateHero };
});

export default useHeroStore;
