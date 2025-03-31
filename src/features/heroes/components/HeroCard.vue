<template>
  <div
    class="relative bg-white rounded-xl shadow-md border-1 border-secondary-light flex flex-col items-center justify-center transition-all duration-300"
    :class="$attrs.class"
  >
    <div class="absolute top-2 right-2">
      <KebabMenu @edit="updateHero(hero)" @delete="deleteHeroById(hero.id)" />
    </div>
    <img
      :src="hero.picture"
      alt="hero"
      class="w-[128px] h-[128px] object-cover rounded-xl mt-12"
    />
    <p class="text-center mt-4 mb-4 font-semibold">{{ hero.name }}</p>
  </div>
</template>
<script setup>
import useDeleteHero from "../composables/useDeleteHero";
import useUpdateHero from "../composables/useUpdateHero";
import KebabMenu from "../../ui/components/KebabMenu.vue";

const props = defineProps({
  hero: {
    type: Object,
    required: true,
  },
});
const { deleteHeroById } = useDeleteHero();
const { updateHero } = useUpdateHero();
</script>
