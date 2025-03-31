<template>
  <div class="space-y-2 mb-4">
    <label class="block text-sm font-medium text-primary">{{ label }}</label>
    <div class="flex">
      <button
        v-for="n in 11"
        :key="n - 1"
        @click="select(n - 1)"
        :class="[
          'w-10 h-10 rounded-full border border-none font-semibold',
          selectedValue === n - 1
            ? 'bg-primary-light text-black border-primary-light'
            : 'text-gray-500 hover:bg-gray-100 hover:border',
        ]"
      >
        {{ n - 1 }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Number,
    default: null,
  },
  label: {
    type: String,
    default: "Select a rating",
  },
});

const emit = defineEmits(["update:modelValue"]);

const selectedValue = computed(() => props.modelValue);
const select = (value) => {
  emit("update:modelValue", value);
};
</script>
