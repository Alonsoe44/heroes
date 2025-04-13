<template>
  <div class="relative w-full h-[600px]">
    <!-- Transition overlay with text -->
    <div
      class="absolute inset-0 transition-all duration-500 z-50"
      :class="[
        isTransitioning ? 'bg-white/90' : 'bg-transparent',
        isTransitioning ? 'opacity-100' : 'opacity-0',
      ]"
    >
      <div
        v-if="isTransitioning"
        class="absolute inset-0 flex items-center justify-center"
      >
        <div
          class="text-6xl font-black text-primary transform transition-transform duration-500"
          :class="[
            isTransitioning ? 'translate-x-0' : 'translate-x-full',
            isTransitioning ? 'opacity-100' : 'opacity-0',
          ]"
        >
          {{ transitionTexts[transitionIndex] }}
        </div>
      </div>
    </div>

    <!-- Animation components -->
    <component
      :is="currentAnimation"
      v-if="!isTransitioning"
      :heroes="props.heroes"
      @climbingComplete="handleAnimationComplete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted } from "vue";
import ClimbingAnimation from "./ClimbingAnimation.vue";
import TellingJokeAnimation from "./TellingJokeAnimation.vue";

interface Hero {
  id: number;
  name: string;
  picture: string;
}

const props = defineProps<{
  heroes: Hero[];
}>();

const emit = defineEmits<{
  (e: "climbingComplete", winners: Hero[]): void;
}>();

const animations = [
  { component: ClimbingAnimation, duration: 5000 },
  { component: TellingJokeAnimation, duration: 5000 },
];

const transitionTexts = ["CLIMBING TIME!", "JOKE TIME!"];

const currentIndex = ref(0);
const currentAnimation = shallowRef(animations[0].component);
const isTransitioning = ref(true); // Start with transition
const transitionIndex = ref(0);

const handleAnimationComplete = (winners: Hero[]) => {
  emit("climbingComplete", winners);

  isTransitioning.value = true;

  transitionIndex.value = (transitionIndex.value + 1) % transitionTexts.length;
  setTimeout(() => {
    currentIndex.value = (currentIndex.value + 1) % animations.length;
    currentAnimation.value = animations[currentIndex.value].component;

    setTimeout(() => {
      isTransitioning.value = false;
    }, 1000);
  }, 1000);
};

onMounted(() => {
  // Start with transition, then begin animation
  setTimeout(() => {
    isTransitioning.value = false;
  }, 1000);
});
</script>

<style scoped>
.text-primary {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
