<template>
  <div
    class="w-full h-full bg-white rounded-xl shadow-md border border-secondary-light mb-4 mr-4 flex flex-col items-center justify-center p-4"
  >
    <img
      :src="hero.picture"
      alt="hero"
      class="w-[128px] h-[128px] bg-blue-400 object-cover rounded-full"
    />
    <p class="text-center font-bold mt-2 text-lg">{{ hero.name }}</p>

    <p v-if="hero.totalScore !== undefined" class="text-gray-600 text-sm">
      Score: {{ hero.totalScore }}
    </p>

    <div v-if="hero.rank && hero.rank <= 3" class="text-3xl mt-1">
      <span v-if="hero.rank === 1">🥇</span>
      <span v-else-if="hero.rank === 2">🥈</span>
      <span v-else-if="hero.rank === 3">🥉</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type Hero from "../interfaces/Hero";

type MaybeRankedHero = Hero & {
  totalScore?: number;
  rank?: number;
};

const props = defineProps<{
  hero: MaybeRankedHero;
}>();
</script>
