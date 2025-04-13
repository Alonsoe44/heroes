<template>
  <div class="min-h-screen p-8">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-8">
      <HeroTitle />
      <router-link
        v-if="someoneWon"
        to="/"
        class="text-white bg-primary px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-300"
      >
        Go Back
      </router-link>
    </div>

    <!-- Main Arena Container -->
    <div class="relative mb-12">
      <div
        class="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden flex flex-col"
      >
        <img
          src="../assets/banner2.webp"
          alt="arena"
          class="absolute top-0 left-0 w-full h-full object-cover motion-safe:animate-pulse opacity-50"
        />

        <!-- Climbing Arena -->

        <AnimationSequence
          v-if="showClimb"
          :heroes="selectedHeroes"
          @allSequencesComplete="handleAllSequencesComplete"
        />
        <!-- Selected Heroes Grid -->
        <div v-else class="grid grid-cols-3 gap-8 h-[600px] mb-8">
          <div
            v-for="hero in selectedHeroes"
            :key="hero.id"
            class="h-full arena-slot"
          >
            <div class="h-full w-full">
              <HeroDetailCard :hero="hero" />
            </div>
          </div>
          <div
            v-for="i in MAX_HEROES - selectedHeroes.length"
            :key="`empty-${i}`"
            class="border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center h-full bg-white z-10"
          >
            <span class="text-gray-400 text-lg">Select a hero</span>
          </div>
        </div>

        <!-- Battle Button Container -->
        <div
          v-if="selectedHeroes.length === MAX_HEROES && !someoneWon"
          class="flex justify-center mt-auto"
        >
          <EpicButton
            v-if="!showClimb"
            variant="battle"
            size="lg"
            @click="startBattle"
          >
            Start battle
          </EpicButton>
        </div>
      </div>
    </div>

    <!-- Available Heroes Grid -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <!-- Climbing Arena Overlay -->

      <div
        v-for="hero in availableHeroes"
        :key="hero.id"
        class="h-[500px] transform transition-all duration-300 hover:scale-105 cursor-pointer"
        @click="selectHero(hero)"
        :data-hero-id="hero.id"
      >
        <div class="h-full w-full">
          <HeroDetailCard :hero="hero" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type Hero from "../features/heroes/interfaces/Hero";
import HeroDetailCard from "../features/heroes/components/HeroDetailCard.vue";
import useFetchHeroes from "../features/heroes/composables/useFetchHeroes";
import HeroTitle from "../features/ui/components/HeroTitle.vue";
import { getFinalRanking } from "../features/heroes/utils/utils";
import EpicButton from "../features/ui/components/EpicButton.vue";
import AnimationSequence from "../features/arena/components/AnimationSequence.vue";
import { nextTick } from "vue";
import gsap from "gsap";
import confetti from "canvas-confetti";

const showClimb = ref(false);

const startBattle = () => {
  showClimb.value = true;
};

const handleAllSequencesComplete = () => {
  someoneWon.value = true;
  showClimb.value = false;
  const rankedHeroes = getFinalRanking(selectedHeroes.value);
  selectedHeroes.value = rankedHeroes;

  // Multiple confetti bursts
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ["star"],
    colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
  };

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ["star"],
    });

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ["circle"],
    });
  }

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);

  // Left side burst
  confetti({
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.7 },
  });

  // Right side burst
  confetti({
    particleCount: 50,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.7 },
  });

  // Center burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
};

const selectHero = async (hero: Hero) => {
  if (selectedHeroes.value.length >= MAX_HEROES) return;

  // Get original element
  const originalEl = document.querySelector(`[data-hero-id="${hero.id}"]`);
  if (!originalEl) return;

  const rect = originalEl.getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

  // Clone
  const clone = originalEl.cloneNode(true) as HTMLElement;
  clone.style.position = "absolute";
  clone.style.top = `${rect.top + scrollTop}px`;
  clone.style.left = `${rect.left + scrollLeft}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.zIndex = "999";
  clone.style.pointerEvents = "none";
  clone.style.transition = "none";
  document.body.appendChild(clone);

  // TEMP add a dummy hero just to measure the slot position
  const dummyHero = { ...hero, isDummy: true };
  selectedHeroes.value.push(dummyHero);
  await nextTick();

  // Find the drop target
  const targetIndex = selectedHeroes.value.findIndex(
    (h) => h.id === hero.id || h.isDummy
  );
  const targetEl = document.querySelectorAll(".arena-slot")[targetIndex];
  if (!targetEl) {
    selectedHeroes.value.pop(); // Remove dummy
    clone.remove();
    return;
  }

  const targetRect = targetEl.getBoundingClientRect();

  // Remove dummy before actual insert
  selectedHeroes.value.pop();

  // Animate the clone
  gsap.to(clone, {
    top: `${targetRect.top + scrollTop}px`,
    left: `${targetRect.left + scrollLeft}px`,
    width: `${targetRect.width}px`,
    height: `${targetRect.height}px`,
    duration: 0.3,
    ease: "power2.inOut",
    onComplete: () => {
      clone.remove();

      // Now add the real hero
      const heroWithFlag = { ...hero, isNew: true };
      selectedHeroes.value.push(heroWithFlag);

      // Clear isNew flag
      setTimeout(() => {
        const index = selectedHeroes.value.findIndex((h) => h.id === hero.id);
        if (index !== -1) {
          selectedHeroes.value[index] = { ...heroWithFlag, isNew: false };
        }
      }, 500);
    },
  });
};

const MAX_HEROES = 3;
const { heroes } = useFetchHeroes();
const selectedHeroes = ref<(Hero & { isNew?: boolean })[]>([]);
const someoneWon = ref(false);

const availableHeroes = computed(() =>
  heroes.value.filter(
    (hero) => !selectedHeroes.value.some((h) => h.id === hero.id)
  )
);
</script>

<style scoped>
@keyframes fly-in {
  0% {
    opacity: 0;
    transform: translateY(100px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fly-in {
  animation: fly-in 0.5s ease-out forwards;
}
</style>
