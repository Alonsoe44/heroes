<template>
  <div
    class="relative w-full h-[600px] bg-[#B7C9C5] overflow-hidden rounded-xl"
  >
    <!-- Tower structure (simplified as a tall background image) -->
    <img
      src="../../../assets/skyscraper.png"
      alt="tower"
      class="absolute -top-[600px] left-1/2 transform -translate-x-1/2 w-[1700px] h-auto object-cover opacity-80"
    />

    <!-- Heroes on top of the tower -->
    <div
      class="absolute top-8 left-1/2 flex gap-6 transform -translate-x-1/2 z-10"
    >
      <div
        v-for="(hero, index) in heroes"
        :key="hero.id"
        class="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md"
        :ref="(el) => setHeroRef(el, index)"
      >
        <img
          :src="hero.picture"
          alt="hero"
          class="w-full h-full object-cover"
        />
      </div>
    </div>

    <!-- Villain next to the heroes -->
    <div
      class="absolute top-8 left-1/2 transform -translate-x-40 w-20 h-20 rounded-full overflow-hidden shadow-xl z-20"
      ref="villainEl"
    >
      <img
        src="../../../assets/joker.png"
        alt="villain"
        class="w-full h-full object-cover"
      />
    </div>
    <div
      v-if="showSound"
      class="absolute left-1/2 transform translate-x-40 text-8xl font-extrabold text-black drop-shadow-md z-30"
      :style="{ top: soundY + 'px' }"
    >
      AAAAAHHH!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import gsap from "gsap";

type Hero = {
  id: number;
  name: string;
  picture: string;
};

const props = defineProps<{
  heroes: Hero[];
}>();

const emit = defineEmits<{
  (e: "climbingComplete", winners: Hero[]): void;
}>();

const heroEls = ref<HTMLElement[]>([]);
const villainEl = ref<HTMLElement | null>(null);
const showSound = ref(false);
const soundY = ref(100);

const setHeroRef = (el: HTMLElement | null, index: number) => {
  if (el) heroEls.value[index] = el;
};

onMounted(() => {
  const bumpTl = gsap.timeline({ delay: 0.5 });

  // Bump animation: heroes bounce forward together
  bumpTl.to(heroEls.value, {
    x: 10,
    y: -10,
    duration: 0.3,
    stagger: 0.1,
    ease: "power1.out",
  });

  // Villain reacts and flies off
  bumpTl.to(villainEl.value, {
    x: 200,
    y: 800,
    rotation: 720,
    duration: 0.7,
    ease: "power2.in",
    delay: 0.2,
    onStart: () => {
      showSound.value = true;
      soundY.value = 130;
      gsap.to(soundY, {
        value: 800,
        duration: 0.9,
        ease: "linear",
      });
    },
  });

  // Optional: fade out as he falls
  bumpTl.to(villainEl.value, {
    opacity: 0,
    duration: 0.3,
  });

  // Hide sound effect after fall
  bumpTl.call(() => {
    showSound.value = false;
  });

  // Emit climbingComplete event after 2 seconds
  setTimeout(() => {
    emit("climbingComplete", props.heroes);
  }, 2000);
});
</script>

<style scoped>
img {
  border-radius: 9999px;
}
</style>
