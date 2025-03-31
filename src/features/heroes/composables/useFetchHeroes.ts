import { ref, onMounted, computed, type ComputedRef, type Ref } from "vue";
import api from "../../../shared/services/api";
import useHeroStore from "../store/HeroStore";
import type Hero from "../interfaces/Hero";
import { useNotificationStore } from "../../notifications/store/NotificationStore";
import { getFriendlyError } from "../../../shared/services/errors";

export function useFetchHeroes(): {
  heroes: ComputedRef<Hero[]>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
} {
  const store = useHeroStore();
  const { addNotification } = useNotificationStore();
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchHeroes = async () => {
    loading.value = true;
    error.value = null;

    const [res, err] = await api.get<Hero[]>("/heroes");

    if (err) {
      error.value = err;
      const message = err;
      addNotification({
        message: getFriendlyError(message),
        type: "error",
        duration: 3000,
      });
    }

    if (res) store.setHeroes(res);

    loading.value = false;
  };

  onMounted(fetchHeroes);

  return {
    heroes: computed(() => store.heroes),
    loading,
    error,
  };
}

export default useFetchHeroes;
