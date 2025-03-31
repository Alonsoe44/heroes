<template>
  <label class="text-secondary" for="name">Image</label>
  <div
    class="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition hover:border-blue-400 h-48 w-96 flex flex-col gap-2 items-center justify-center"
    @dragover.prevent="dragging = true"
    @dragleave.prevent="dragging = false"
    @drop.prevent="handleDrop"
    :class="dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
    @click="triggerFileInput"
  >
    <input
      type="file"
      accept="image/*"
      ref="fileInput"
      class="hidden"
      @change="handleFileChange"
    />

    <div v-if="previewUrl" class="mb-2">
      <img
        :src="previewUrl"
        alt="Preview"
        class="mx-auto h-32 object-contain rounded-xl"
      />
    </div>

    <p v-if="!previewUrl" class="text-gray-600">
      <span class="font-medium">Click to browse</span> or drag & drop an image
      here
    </p>
    <p v-else class="text-gray-600">Upload another image</p>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: String,
});
const emit = defineEmits(["update:modelValue"]);

const fileInput = ref(null);
const previewUrl = ref(props.modelValue || null);
const dragging = ref(false);

const handleFileChange = (e) => {
  const file = e.target.files[0];
  processImage(file);
};

const handleDrop = (e) => {
  dragging.value = false;
  const file = e.dataTransfer.files[0];
  processImage(file);
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const processImage = (file) => {
  if (!file || !file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const targetSize = 128;
      canvas.width = targetSize;
      canvas.height = targetSize;

      const size = Math.min(img.width, img.height);
      const x = (img.width - size) / 2;
      const y = (img.height - size) / 2;

      ctx.clearRect(0, 0, targetSize, targetSize);
      ctx.drawImage(img, x, y, size, size, 0, 0, targetSize, targetSize);

      const croppedBase64 = canvas.toDataURL("image/png");
      emit("update:modelValue", croppedBase64);
      previewUrl.value = croppedBase64;
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
};

watch(
  () => props.modelValue,
  (val) => {
    previewUrl.value = val;
  }
);
</script>
