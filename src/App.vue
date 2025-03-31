<script setup lang="ts">
import background from "./assets/background.webp";
import NotificationContainer from "./features/notifications/components/NotificationContainer.vue";
</script>
<template>
  <img
    :src="background"
    alt="logo"
    class="w-full h-auto absolute top-0 left-0 -z-10"
  />
  <router-view />
  <NotificationContainer />
</template>
