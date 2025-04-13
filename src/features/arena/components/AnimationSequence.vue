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
          class="text-4xl font-bold transform transition-transform duration-500"
          :class="[
            isTransitioning ? 'translate-x-0' : 'translate-x-full',
            isTransitioning ? 'opacity-100' : 'opacity-0',
          ]"
        >
          {{ transitionTexts[transitionIndex] }}
        </div>
      </div>
    </div>

    <!-- Animation components with transition -->
    <Transition name="slide" mode="out-in">
      <component
        :is="currentAnimation"
        v-if="!isTransitioning"
        :key="currentIndex"
        :heroes="props.heroes"
        @climbingComplete="handleAnimationComplete"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted } from "vue";
import ClimbingAnimation from "./ClimbingAnimation.vue";
import TellingJokeAnimation from "./TellingJokeAnimation.vue";
import ThrowVillainAnimation from "./ThrowVillainAnimation.vue";
import Run200km from "./Run200km.vue";
import RescueKitten from "./RescueKitten.vue";

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
  (e: "allSequencesComplete"): void;
}>();

const animations = [
  { component: ClimbingAnimation, duration: 5000 },
  { component: TellingJokeAnimation, duration: 5000 },
  { component: ThrowVillainAnimation, duration: 5000 },
  { component: Run200km, duration: 5000 },
  { component: RescueKitten, duration: 5000 },
];

const transitionTexts = [
  "Climbing the skyscraper",
  "Comedy time",
  "Throw the villain",
  "Big race 200km",
  "Rescue the kitten",
];

const currentIndex = ref(0);
const currentAnimation = shallowRef(animations[0].component);
const isTransitioning = ref(true); // Start with transition
const transitionIndex = ref(0);

const handleAnimationComplete = (winners: Hero[]) => {
  emit("climbingComplete", winners);

  // Check if we've completed all sequences
  if (currentIndex.value === animations.length - 1) {
    emit("allSequencesComplete");
    return; // Skip transition and end the sequence
  }

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

.slide-enter-active,
.slide-leave-active {
  transition: all 0.6s ease;
}
.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
