<template>
  <div class="relative inline-block text-left" ref="menuRef">
    <button
      @click="toggleMenu"
      class="p-2 rounded-full hover:bg-gray-100 bg-black/5 focus:outline-none"
    >
      <EllipsisVertical class="w-5 h-5" />
    </button>

    <div
      v-if="open"
      class="absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg border-secondary-light border-1 focus:outline-none"
    >
      <div class="py-1">
        <button
          @click="edit"
          class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
        >
          Edit
        </button>
        <button
          @click="del"
          class="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { EllipsisVertical } from "lucide-vue-next";
import { ref, defineEmits } from "vue";

const emit = defineEmits(["edit", "delete"]);
const open = ref(false);
const toggleMenu = () => {
  open.value = !open.value;
};

const edit = () => {
  open.value = false;
  emit("edit");
};

const del = () => {
  open.value = false;
  emit("delete");
};

const menuRef = ref(null);
onClickOutside(menuRef, () => {
  open.value = false;
});
</script>
