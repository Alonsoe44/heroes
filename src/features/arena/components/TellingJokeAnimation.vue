<template>
  <div
    class="relative w-full h-[600px] flex justify-around items-end overflow-hidden"
  >
    <img
      src="../../../assets/bar.png"
      alt="Arena background"
      class="absolute inset-0 w-full h-full object-cover rounded-xl"
    />
    <div class="absolute inset-0 bg-black/30"></div>

    <!-- Sliding HAHAHA Texts -->
    <div
      v-for="(_, index) in haList"
      :key="index"
      class="sliding-text absolute left-full whitespace-nowrap text-9xl font-black text-white"
      :style="{ top: `${20 + index * 15}%` }"
      :ref="(el) => setTextRef(el, index)"
    >
      HAHAHAHAHA
    </div>

    <div
      v-for="(hero, index) in heroes"
      :key="hero.id"
      class="relative w-40 h-40"
    >
      <!-- Hero Circle -->
      <div
        class="hero-circle w-32 h-32 rounded-full bg-white overflow-hidden border-4 border-primary shadow-lg absolute left-1/2 bottom-0 transform -translate-x-1/2"
        :ref="(el) => setHeroRef(el, index)"
      >
        <img
          :src="hero.picture"
          alt="hero"
          class="w-full h-full object-cover scale-110"
        />
      </div>

      <!-- Speech Bubble -->
      <div
        v-if="showBubble[index]"
        class="speech-bubble absolute left-1/2 bottom-36 transform -translate-x-1/2"
      >
        {{ jokes[index] }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import gsap from "gsap";

const props = defineProps<{
  heroes: { id: number; name: string; picture: string }[];
}>();

const emit = defineEmits<{
  (
    e: "climbingComplete",
    winners: { id: number; name: string; picture: string }[]
  ): void;
}>();

const jokes = [
  "Why did the dev go broke? Because he used up all his cache!",
  "404 joke not found.",
  "To understand recursion, you must first understand recursion.",
];

const heroEls = ref<HTMLElement[]>([]);
const textEls = ref<HTMLElement[]>([]);
const showBubble = ref([false, false, false]);
const haList = ref([0, 1, 2]);

const setHeroRef = (el: HTMLElement | null, index: number) => {
  if (el) heroEls.value[index] = el;
};

const setTextRef = (el: HTMLElement | null, index: number) => {
  if (el) textEls.value[index] = el;
};

let textTweens: gsap.core.Tween[] = [];

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

  props.heroes.forEach((_, i) => {
    const heroEl = heroEls.value[i];

    tl.to(heroEl, { y: -20, scale: 1.1, duration: 0.3 }, i * 0.6);
    tl.call(() => (showBubble.value[i] = true), null, i * 0.6 + 0.3);
    tl.to(heroEl, { y: 0, scale: 1, duration: 0.3 }, i * 0.6 + 1);
    tl.call(
      () => {
        showBubble.value[i] = false;
      },
      null,
      i * 0.6 + 1.3
    );
  });

  textEls.value.forEach((el, i) => {
    const tween = gsap.to(el, {
      x: "-300%",
      duration: 3,
      delay: i * 0.8,
      ease: "none",
      repeat: -1,
      repeatDelay: 1,
      onUpdate() {
        const t = gsap.utils.wrap(
          0,
          Math.PI * 2,
          performance.now() * 0.005 + i
        );
        const yOffset = Math.sin(t) * 5;
        const rotation = Math.sin(t * 2) * 3;
        gsap.set(el, { y: yOffset, rotation });
      },
    });
    textTweens.push(tween);
  });

  // Emit completion after 3 seconds
  setTimeout(() => {
    emit("climbingComplete", props.heroes);
  }, 3000);
});

onUnmounted(() => {
  textTweens.forEach((tween) => tween.kill());
});
</script>

<style scoped>
.speech-bubble {
  background: white;
  padding: 10px 14px;
  border-radius: 16px;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  max-width: 180px;
  text-align: center;
  font-size: 14px;
  animation: pop-in 0.3s ease-out;
}

@keyframes pop-in {
  0% {
    transform: scale(0.5) translateY(-20px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.sliding-text {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 10;
  will-change: transform;
}
</style>
