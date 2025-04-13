<template>
  <div
    class="relative h-[600px] w-full mt-8 overflow-hidden bg-gray-100 rounded-xl"
  >
    <!-- Background -->
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

    <!-- Height Counter -->
    <div
      class="absolute left-8 top-72 z-30 text-8xl font-black text-black"
      ref="heightCounter"
    >
      <span ref="counterDisplay">0</span> F
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
  // Animate background
  gsap.fromTo(
    backgroundImage.value,
    { y: "0%" },
    {
      y: "66.67%",
      duration: 2,
      ease: "power1.inOut",
    }
  );

  // Animate counter
  gsap.fromTo(
    counterDisplay.value,
    { innerText: "0" },
    {
      innerText: "300",
      duration: 2,
      ease: "power1.inOut",
      snap: { innerText: 10 }, // Snap to multiples of 10
      onUpdate: () => {
        if (counterDisplay.value) {
          // Add leading zeros
          const value = counterDisplay.value.innerText;
          counterDisplay.value.innerText = value.padStart(3, "0");
        }
      },
    }
  );

  // Animate heroes
  heroElements.value.forEach((el) => {
    gsap.set(el, { y: 0 });
  });

  const climbers = heroElements.value.map((el) => {
    const delay = gsap.utils.random(0, 0.2);

    return gsap.to(el, {
      keyframes: [
        {
          x: gsap.utils.random(-15, 15),
          y: "-=200",
          duration: 0.5,
          scale: 1.2,
        },
        {
          x: gsap.utils.random(15, -15),
          y: "-=200",
          duration: 0.5,
          scale: 1.1,
        },
        {
          x: gsap.utils.random(-25, 25),
          y: "-=250",
          duration: 0.7,
          scale: 1.15,
        },
        {
          x: 0,
          y: "-=250",
          duration: 0.4,
          scale: 1,
        },
      ],
      ease: "power1.inOut",
      delay,
    });
  });

  Promise.all(climbers).then(() => {
    emit("climbingComplete", props.heroes);
  });
};

onMounted(() => {
  startAnimation();
});
</script>

<style scoped>
.hero-circle {
  transform: translateY(0);
  will-change: transform;
}

/* Counter styles */
span {
  font-family: "Arial Black", sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-feature-settings: "tnum";
  letter-spacing: -2px;
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

/* Gradient overlay */
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
</style>
