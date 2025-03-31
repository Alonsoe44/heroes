import { ref, type Ref } from "vue";
import type Hero from "../interfaces/Hero";
import api from "../../../shared/services/api";
import useHeroStore from "../store/HeroStore";
import { useNotificationStore } from "../../notifications/store/NotificationStore";
import { getFriendlyError } from "../../../shared/services/errors";

const useUpdateHero = (): {
  updateHero: (updatedHero: Hero) => Promise<Hero | null>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
} => {
  const error = ref<string | null>(null);
  const loading = ref(false);
  const { updateHero: updateHeroStore } = useHeroStore();
  const { addNotification } = useNotificationStore();

  const updateHero = async (updatedHero: Hero): Promise<Hero | null> => {
    error.value = null;
    loading.value = true;

    const [res, err] = await api.put<Hero>(
      `/heroes/${updatedHero.id}`,
      updatedHero
    );

    if (err) {
      error.value = err;
      addNotification({
        message: getFriendlyError(err),
        type: "error",
        duration: 3000,
      });
    }

    if (res) {
      updateHeroStore(updatedHero.id, res);
      addNotification({
        message: "Hero updated successfully",
        type: "success",
        duration: 3000,
      });
    }

    loading.value = false;
    return res;
  };

  return {
    updateHero,
    loading,
    error,
  };
};

export default useUpdateHero;
