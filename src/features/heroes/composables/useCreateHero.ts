import { ref, type Ref } from "vue";
import type Hero from "../interfaces/Hero";
import api from "../../../shared/services/api";
import useHeroStore from "../store/HeroStore";
import { useNotificationStore } from "../../notifications/store/NotificationStore";
import { getFriendlyError } from "../../../shared/services/errors";

type newHero = Omit<Hero, "id">;

const useCreateHero = (): {
  createHero: (newHero: newHero) => Promise<Hero | null>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
} => {
  const { addHero } = useHeroStore();
  const { addNotification } = useNotificationStore();
  const loading = ref(false);
  const error = ref<string | null>(null);

  const createHero = async (newHero: newHero) => {
    loading.value = true;
    error.value = null;

    const [res, err] = await api.post<Hero>("/heroes", newHero);

    if (err) {
      const message = err;
      error.value = err;
      addNotification({
        message: getFriendlyError(message),
        type: "error",
        duration: 3000,
      });
    }
    if (res) {
      addHero(res);
      addNotification({
        message: "Hero created successfully",
        type: "success",
        duration: 3000,
      });
    }
    loading.value = false;

    return res;
  };

  return { createHero, loading, error };
};

export default useCreateHero;
