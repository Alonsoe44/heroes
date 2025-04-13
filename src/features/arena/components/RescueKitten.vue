<template>
  <div
    class="relative w-full h-[600px] bg-[#C7E2E0] overflow-hidden rounded-xl"
  >
    <!-- Background -->
    <img
      src="../../../assets/three.png"
      alt="tree with kitten"
      class="absolute w-full h-full object-cover opacity-70"
    />

    <!-- Kitten on the tree -->
    <div
      ref="kittenEl"
      class="absolute top-16 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-[#C7E2E0] border-4 border-white shadow-md z-20 flex items-center justify-center rounded-full"
    >
      <img
        src="../../../assets/kitten.png"
        alt="kitten"
        class="w-full h-full object-cover rounded-full"
      />
    </div>

    <!-- Heroes at bottom -->
    <div
      class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-6 z-10"
    >
      <div
        v-for="(hero, index) in heroes"
        :key="hero.id"
        class="w-24 h-24 rounded-full overflow-hidden shadow-lg"
        :ref="(el) => setHeroRef(el, index)"
      >
        <img
          :src="hero.picture"
          :alt="hero.name"
          class="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import gsap from "gsap";
import type Hero from "../../heroes/interfaces/Hero";

const props = defineProps<{
  heroes: Hero[];
}>();

const emit = defineEmits<{
  (e: "climbingComplete", winners: Hero[]): void;
}>();

const heroEls = ref<(HTMLElement | null)[]>([]);
const kittenEl = ref<HTMLElement | null>(null);

const setHeroRef = (el: HTMLElement | null, index: number) => {
  if (el) heroEls.value[index] = el;
};

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: "power1.inOut" } });

  // Heroes jump up toward the kitten
  tl.to(heroEls.value, {
    y: -150,
    scale: 1.1,
    duration: 0.6,
    stagger: 0.2,
  });

  // Kitten jumps down to heroes
  tl.to(kittenEl.value, {
    y: 250,
    rotation: 360,
    duration: 1.2,
    ease: "bounce.out",
  });

  // Heroes return to ground
  tl.to(heroEls.value, {
    y: 0,
    scale: 1,
    duration: 0.4,
    stagger: 0.2,
  });

  // Optional: kitten snuggles into the middle hero
  tl.to(kittenEl.value, {
    x: -90,
    scale: 0.8,
    duration: 0.4,
    ease: "back.out(1.7)",
    onComplete: () => {
      // Emit the event with all heroes as winners
      emit("climbingComplete", props.heroes);
    },
  });
});
</script>
