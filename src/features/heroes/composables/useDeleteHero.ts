import { ref, type Ref } from "vue";
import api from "../../../shared/services/api";
import { useNotificationStore } from "../../notifications/store/NotificationStore";
import useHeroStore from "../store/HeroStore";
import { getFriendlyError } from "../../../shared/services/errors";

interface SuccessResponse {
  done: true;
}

const useDeleteHero = (): {
  deleteHeroById: (heroId: string) => Promise<SuccessResponse | null>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
} => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const { deleteHero } = useHeroStore();
  const { addNotification } = useNotificationStore();

  const deleteHeroById = async (
    heroId: string
  ): Promise<SuccessResponse | null> => {
    error.value = null;
    loading.value = true;
    deleteHero(heroId);

    const [res, err] = await api.delete<SuccessResponse>(`/heroes/${heroId}`);
    if (err) {
      error.value = err;
      addNotification({
        message: getFriendlyError(err),
        type: "error",
        duration: 3000,
      });
    }

    if (res) {
      addNotification({
        message: "Hero deleted successfully",
        type: "success",
        duration: 3000,
      });
    }

    loading.value = false;
    return res;
  };

  return { deleteHeroById, error, loading };
};

export default useDeleteHero;
