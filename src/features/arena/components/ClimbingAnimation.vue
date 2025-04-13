<template>
  <div
    class="relative h-[600px] w-full mt-8 overflow-hidden bg-gray-100 rounded-xl"
  >
    <!-- Animated Background - Ajustado para empezar desde la base -->
    <div class="absolute inset-0 overflow-hidden">
      <img
        src="../../../assets/skyscraper.png"
        alt="skyscraper"
        ref="backgroundImage"
        class="absolute w-full h-[300%] object-cover opacity-70"
        style="bottom: 0; transform: translateY(0%)"
      />
    </div>

    <!-- Race Track -->
    <div
      ref="raceTrack"
      class="relative z-10 grid grid-cols-3 gap-4 h-full items-end px-4"
    >
      <div
        v-for="(hero, index) in heroes"
        :key="hero.id"
        class="flex justify-center relative"
      >
        <div
          class="hero-circle w-24 h-24 rounded-full bg-white overflow-hidden border-4 border-primary shadow-lg"
          :ref="(el) => setHeroRef(el, index)"
        >
          <img
            :src="hero.picture"
            alt="hero"
            class="w-full h-full object-cover scale-125"
          />
        </div>
      </div>
    </div>

    <!-- Dynamic Height Markers -->
    <div
      class="absolute left-4 top-0 bottom-0 z-20 pointer-events-none h-full overflow-hidden"
      ref="markersContainer"
    >
      <div class="relative h-[300%]" ref="markersWrapper" style="bottom: 0">
        <div
          v-for="n in 30"
          :key="n"
          class="parallax-floor text-black text-4xl font-black opacity-0 absolute"
          :style="`bottom: ${(n - 1) * 3.33}%`"
        >
          {{ n * 10 }}F
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
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
const markersContainer = ref<HTMLElement | null>(null);
const markersWrapper = ref<HTMLElement | null>(null);

const setHeroRef = (el: HTMLElement | null, index: number) => {
  if (el) heroElements.value[index] = el;
};

const startClimbing = () => {
  // Animate background - Start showing the base and move downward
  gsap.fromTo(
    backgroundImage.value,
    { y: "0%" }, // Start showing the base
    {
      y: "66.67%", // Move downward (positive value)
      duration: 2,
      ease: "power1.inOut",
    }
  );

  // Animate floor markers - Synchronized with background
  gsap.fromTo(
    markersWrapper.value,
    { y: "0%" },
    {
      y: "66.67%", // Move downward (positive value)
      duration: 2,
      ease: "power1.inOut",
    }
  );

  gsap.to(".parallax-floor", {
    opacity: 1,
    duration: 0.1,
    stagger: {
      each: 0.05,
      from: "end",
    },
  });

  // Animate heroes - Mantener la dirección hacia arriba
  heroElements.value.forEach((el) => {
    gsap.set(el, { y: 0 });
  });

  const climbers = heroElements.value.map((el, i) => {
    const delay = gsap.utils.random(0, 0.2);

    return gsap.to(el, {
      keyframes: [
        {
          x: gsap.utils.random(-15, 15),
          y: "-=200",
          duration: 0.3,
          scale: 1.2,
        },
        {
          x: gsap.utils.random(15, -15),
          y: "-=200",
          duration: 0.3,
          scale: 1.1,
        },
        {
          x: gsap.utils.random(-25, 25),
          y: "-=250",
          duration: 0.4,
          scale: 1.15,
        },
        {
          x: 0,
          y: "-=250",
          duration: 0.4,
          scale: 1,
        },
      ],
      ease: "power2.inOut",
      delay,
    });
  });

  Promise.all(climbers).then(() => {
    emit("climbingComplete", props.heroes);
  });
};

defineExpose({ startClimbing });
</script>

<style scoped>
.hero-circle {
  transform: translateY(0);
  will-change: transform;
}

.parallax-floor {
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.5);
  font-family: "Arial Black", sans-serif;
  transform: translateY(0);
  will-change: transform, opacity;
}

.hero-circle img {
  animation: motionBlur 0.3s infinite;
}

@keyframes motionBlur {
  0% {
    filter: blur(0px);
  }
  50% {
    filter: blur(1px);
  }
  100% {
    filter: blur(0px);
  }
}

/* Optional: Add a subtle gradient overlay */
.relative::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.2), transparent);
  pointer-events: none;
  z-index: 1;
}

/* Asegurar que el contenedor del fondo mantenga la proporción */
.skyscraper-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* Ajustar la imagen para que se vea completa */
.skyscraper-container img {
  width: 100%;
  height: 300%;
  object-fit: cover;
  object-position: bottom;
}
</style>
