<template>
  <div
    class="w-full h-full perspective-1000"
    @mouseenter="isFlipped = true"
    @mouseleave="isFlipped = false"
  >
    <div
      class="relative w-full h-full transition-transform duration-500 transform-style-3d"
      :class="{ 'rotate-y-180': isFlipped }"
    >
      <!-- Front of Card -->
      <div
        class="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-md border border-secondary-light flex flex-col items-center justify-center p-10 overflow-hidden"
      >
        <!-- Background Image with blur -->
        <div class="absolute inset-0 w-full h-full">
          <img
            :src="hero.picture"
            alt="background"
            class="w-full h-full object-cover opacity-10 blur-sm"
          />
          <!-- Gradient overlay -->
          <div class="absolute inset-0 bg-white/50"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 flex flex-col items-center gap-4">
          <p class="font-bold text-lg">{{ hero.name }}</p>

          <img
            :src="hero.picture"
            alt="hero"
            class="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-white"
          />

          <p v-if="hero.totalScore !== undefined" class="text-gray-600 text-sm">
            Score: {{ hero.totalScore }}
          </p>

          <div v-if="hero.rank && hero.rank <= 3" class="text-9xl">
            <span v-if="hero.rank === 1">🥇</span>
            <span v-else-if="hero.rank === 2">🥈</span>
            <span v-else-if="hero.rank === 3">🥉</span>
          </div>
        </div>
      </div>

      <!-- Back of Card -->
      <div
        class="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-md border border-secondary-light rotate-y-180 overflow-hidden"
      >
        <!-- Background Image with blur -->
        <div class="absolute inset-0 w-full h-full">
          <img
            :src="hero.picture"
            alt="background"
            class="w-full h-full object-cover opacity-20 blur-sm"
          />
          <!-- Gradient overlay -->
          <div class="absolute inset-0 bg-white/50"></div>
        </div>

        <!-- Content -->
        <div class="relative h-full flex flex-col p-10">
          <p class="font-bold text-lg z-20">{{ hero.name }}</p>
          <p class="font-medium text-sm text-gray-400 z-20">Attributes</p>

          <!-- Chart container -->
          <div class="flex-1 relative z-20 mt-4">
            <canvas ref="radarChart" class="w-full h-full"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type Hero from "../interfaces/Hero";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

type MaybeRankedHero = Hero & {
  totalScore?: number;
  rank?: number;
};

const props = defineProps<{
  hero: MaybeRankedHero;
}>();

const isFlipped = ref(false);
const radarChart = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const createRadarChart = () => {
  if (!radarChart.value) return;

  const ctx = radarChart.value.getContext("2d");
  if (!ctx) return;

  // Destroy existing chart if it exists
  if (chart) {
    chart.destroy();
  }

  const attributes = props.hero.attributes;
  const data = {
    labels: ["Strength", "Agility", "Weight", "Endurance", "Charisma"],
    datasets: [
      {
        label: "Attributes",
        data: [
          attributes.strength,
          attributes.agility,
          attributes.weight,
          attributes.endurance,
          attributes.charisma,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgb(54, 162, 235)",
        pointBackgroundColor: "rgb(54, 162, 235)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(54, 162, 235)",
      },
    ],
  };

  const config = {
    type: "radar" as const,
    data: data,
    options: {
      scales: {
        r: {
          beginAtZero: true,
          max: 10,
          ticks: {
            stepSize: 2,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      maintainAspectRatio: false,
    },
  };

  chart = new Chart(ctx, config);
};

onMounted(() => {
  createRadarChart();
});

watch(
  () => props.hero,
  () => {
    createRadarChart();
  },
  { deep: true }
);
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
