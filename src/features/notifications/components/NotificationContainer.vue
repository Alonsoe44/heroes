<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
    <TransitionGroup name="notification">
      <div
        v-for="notification in store.notifications"
        :key="notification.id"
        :class="[
          'px-4 py-2 rounded-lg shadow-lg max-w-sm transform transition-all duration-300',
          {
            'border-green-500 bg-white border-1 text-black':
              notification.type === 'success',
            'border-red-500 bg-white border-1 text-black':
              notification.type === 'error',
            'border-blue-500 bg-white border-1 text-black':
              notification.type === 'info',
          },
        ]"
      >
        {{ notification.message }}
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from "../store/NotificationStore";

const store = useNotificationStore();
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
