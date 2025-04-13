<template>
  <div
    class="relative h-[600px] w-full mt-8 overflow-hidden bg-gray-100 rounded-xl"
  >
    <!-- Background (Race track road) -->
    <div class="absolute inset-0 overflow-hidden">
      <img
        src="../../../assets/racetrack.png"
        alt="racetrack"
        ref="backgroundImage"
        class="absolute w-full h-full object-cover opacity-60"
      />
    </div>

    <!-- Race Lanes (heroes start at bottom and run toward horizon) -->
    <div
      ref="raceTrack"
      class="absolute inset-0 z-10 flex justify-around items-end px-4 race-track"
    >
      <div
        v-for="(hero, index) in heroes"
        :key="hero.id"
        class="hero-runner relative"
        :ref="(el) => setHeroRef(el, index)"
      >
        <div
          class="w-24 h-24 rounded-full bg-white overflow-hidden border-4 border-primary shadow-lg"
        >
          <img
            :src="hero.picture"
            alt="hero"
            class="w-full h-full object-cover scale-110"
          />
        </div>
      </div>
    </div>

    <!-- Distance Counter -->
    <div
      class="absolute left-8 top-8 z-30 text-8xl font-black text-black"
      ref="distanceCounter"
    >
      <span ref="counterDisplay">000</span> km
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type Hero from "@/features/heroes/interfaces/Hero";
import gsap from "gsap";

const props = defineProps<{
  heroes: Hero[];
}>();

const emit = defineEmits<{
  (e: "climbingComplete", winners: Hero[]): void;
}>();

const heroElements = ref<HTMLElement[]>([]);
const backgroundImage = ref<HTMLImageElement | null>(null);
const counterDisplay = ref<HTMLElement | null>(null);

const setHeroRef = (el: HTMLElement | null, index: number) => {
  if (el) heroElements.value[index] = el;
};

const startAnimation = () => {
  // Animate background (simulate camera zoom into horizon)
  gsap.fromTo(
    backgroundImage.value,
    { scale: 1 },
    {
      scale: 1.2,
      duration: 2,
      ease: "power1.inOut",
    }
  );

  // Animate counter (from 0 to 200)
  gsap.fromTo(
    counterDisplay.value,
    { innerText: "0" },
    {
      innerText: "200",
      duration: 2,
      ease: "power1.inOut",
      snap: { innerText: 5 },
      onUpdate: () => {
        if (counterDisplay.value) {
          const value = counterDisplay.value.innerText;
          counterDisplay.value.innerText = value.padStart(3, "0");
        }
      },
    }
  );

  // Animate heroes running toward the horizon (center top and disappear)

  const raceTrack = document.querySelector(".race-track");
  const centerX = raceTrack
    ? raceTrack.clientWidth / 2 - 48
    : window.innerWidth / 2 - 48;
  const destinationY = -300;

  const runners = heroElements.value.map((el, i) => {
    const initialX = el.getBoundingClientRect().left;
    const deltaX = centerX - initialX;

    return gsap.to(el, {
      x: deltaX * -0.4,
      y: destinationY,
      scale: 0,
      opacity: 0,
      duration: 2,
      ease: "power1.inOut",
    });
  });

  Promise.all(runners).then(() => {
    emit("climbingComplete", props.heroes);
  });
};

onMounted(() => {
  startAnimation();
});
</script>

<style scoped>
.hero-runner {
  will-change: transform;
}

span {
  font-family: "Arial Black", sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-feature-settings: "tnum";
  letter-spacing: -2px;
}
</style>
