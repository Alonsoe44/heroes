import { defineStore } from "pinia";
import { ref } from "vue";

export interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substring(2);
    notifications.value.push({
      id,
      ...notification,
      duration: notification.duration || 3000,
    });

    setTimeout(() => {
      removeNotification(id);
    }, notification.duration || 3000);
  };

  const removeNotification = (id: string) => {
    notifications.value = notifications.value.filter((n) => n.id !== id);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
  };
});
