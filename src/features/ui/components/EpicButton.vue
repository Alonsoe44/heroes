<template>
  <button
    :class="[
      'epic-button group relative px-12 py-6 text-xl font-bold text-white rounded-2xl',
      'transform transition-all duration-300',
      'hover:scale-105 hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]',
      'active:scale-95',
      'overflow-hidden',
      variant === 'battle'
        ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
        : '',
      variant === 'success'
        ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
        : '',
      variant === 'danger' ? 'bg-gradient-to-r from-red-600 to-rose-600' : '',
      size === 'lg' ? 'px-12 py-6 text-xl' : '',
      size === 'md' ? 'px-8 py-4 text-lg' : '',
      size === 'sm' ? 'px-6 py-3 text-base' : '',
    ]"
    @click="$emit('click')"
  >
    <!-- Animated background effect -->
    <div
      :class="[
        'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        variant === 'battle'
          ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
          : '',
        variant === 'success'
          ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
          : '',
        variant === 'danger' ? 'bg-gradient-to-r from-red-500 to-rose-500' : '',
      ]"
    ></div>

    <!-- Pulse effect -->
    <div
      class="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 animate-ping"
    ></div>

    <!-- Sparkle effects -->
    <div
      :class="[
        'absolute -inset-1 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200',
        variant === 'battle'
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
          : '',
        variant === 'success'
          ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
          : '',
        variant === 'danger' ? 'bg-gradient-to-r from-red-600 to-rose-600' : '',
      ]"
    ></div>

    <!-- Button content -->
    <span class="relative flex items-center justify-center gap-2">
      <span v-if="leftIcon">{{ leftIcon }}</span>
      <slot>Button Text</slot>
      <span v-if="rightIcon">{{ rightIcon }}</span>
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: "battle" | "success" | "danger";
  size?: "sm" | "md" | "lg";
  leftIcon?: string;
  rightIcon?: string;
}

withDefaults(defineProps<Props>(), {
  variant: "battle",
  size: "lg",
  leftIcon: "",
  rightIcon: "",
});

defineEmits<{
  (e: "click"): void;
}>();
</script>

<style scoped>
.epic-button {
  animation: pulse 2s infinite;
  box-shadow: 0 0 15px rgba(79, 70, 229, 0.3),
    inset 0 0 15px rgba(79, 70, 229, 0.3);
}

.epic-button:hover {
  animation: none;
  box-shadow: 0 0 30px rgba(79, 70, 229, 0.6),
    inset 0 0 20px rgba(79, 70, 229, 0.6);
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes shine {
  from {
    -webkit-mask-position: 150%;
  }
  to {
    -webkit-mask-position: -50%;
  }
}

.epic-button:hover::before {
  content: "";
  position: absolute;
  top: -100%;
  left: -100%;
  height: 300%;
  width: 300%;
  background: linear-gradient(
    45deg,
    transparent 30%,
    rgba(255, 255, 255, 0.8) 40%,
    rgba(255, 255, 255, 0.9) 50%,
    rgba(255, 255, 255, 0.8) 60%,
    transparent 70%
  );
  transform: rotate(45deg);
  animation: shine 3s infinite;
}
</style>
