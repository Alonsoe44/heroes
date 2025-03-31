<template>
  <img
    alt="form-bg"
    src="../assets/form-bg.webp"
    class="w-full object-cover object-top h-[100%] absolute top-0 -left-80 opacity-10"
  />
  <div class="p-12 w-full overflow-hidden relative">
    <h2 class="text-2xl font-bold">
      <span class="text-primary">Create</span> your own hero
    </h2>
    <div class="flex md:flex-row flex-col gap-12 z-50">
      <div class="flex flex-col gap-2 mt-4 w-full">
        <div class="flex flex-col gap-2">
          <label class="text-secondary" for="name">Name</label>
          <input
            class="border border-secondary rounded-md p-2"
            type="text"
            id="name"
            autocomplete="off"
            v-model="form.name"
          />
          <PhotoInput v-model="form.picture" />
        </div>
      </div>
      <div class="w-full">
        <h3 class="mt-6">Every hero has it's essence</h3>
        <p class="text-secondary text-sm mb-4">
          Balance its strength, agility, weight,etc.
        </p>
        <NumberSelector v-model="form.attributes.strength" label="Strength" />
        <NumberSelector v-model="form.attributes.agility" label="Agility" />
        <NumberSelector v-model="form.attributes.weight" label="Weight" />
        <NumberSelector v-model="form.attributes.endurance" label="Endurance" />
        <NumberSelector v-model="form.attributes.charisma" label="Charisma" />
      </div>
    </div>
    <button
      class="bg-primary text-white rounded-md p-2 w-full mt-4 transform transition-all duration-200 hover:bg-primary/80 hover:shadow-lg hover:-translate-y-0.5 active:shadow-inner active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      @click="createHeroValidation"
    >
      It's ready!
    </button>
  </div>
</template>
<script setup lang="ts">
import { defineEmits, reactive } from "vue";
import { z } from "zod";
import useCreateHero from "../composables/useCreateHero";
import { useNotificationStore } from "../../notifications/store/NotificationStore";
import NumberSelector from "../../ui/components/NumberSelector.vue";
import PhotoInput from "../../ui/components/PhotoInput.vue";
import { handle } from "../utils/utils";

const { createHero } = useCreateHero();
const { addNotification } = useNotificationStore();

const emit = defineEmits(["success"]);

const form = reactive({
  name: null,
  picture: null,
  attributes: {
    strength: null,
    agility: null,
    weight: null,
    endurance: null,
    charisma: null,
  },
});

const createHeroValidation = async () => {
  const [validation, zodError] = await handle(HeroSchema.parseAsync(form));

  if (zodError) {
    const errors = (zodError as z.ZodError).errors;
    errors.forEach((error) => {
      addNotification({
        message: error.message,
        type: "error",
        duration: 4000,
      });
    });

    return;
  }

  if (validation) {
    const response = await createHero(validation);
    if (response) {
      emit("success", response);
    }
  }
};

const HeroSchema = z.object({
  name: z.string({ invalid_type_error: "Every hero needs a name" }).min(1),
  picture: z
    .string({ invalid_type_error: "A hero without a picture ?" })
    .min(1),
  attributes: z.object({
    strength: z
      .number({
        invalid_type_error: "Even a weakling has *some* strength. Fill it in.",
      })
      .min(0)
      .max(10),
    agility: z
      .number({
        invalid_type_error: "Agility is required, even heroes need to dodge",
      })
      .min(0)
      .max(10),
    weight: z
      .number({
        invalid_type_error: "Missing weight. Ghosts aren't allowed",
      })
      .min(0)
      .max(10),
    endurance: z
      .number({
        invalid_type_error:
          "Endurance is missing. Your hero would die walking up stairs",
      })
      .min(0)
      .max(10),
    charisma: z
      .number({
        invalid_type_error:
          "No charisma? Sounds about right. But you still gotta fill it",
      })
      .min(0)
      .max(10),
  }),
});
</script>
