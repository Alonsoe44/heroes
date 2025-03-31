import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/HomePage.vue";
import Arena from "./pages/ArenaPage.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "Home", component: Home },
    { path: "/arena", name: "Arena", component: Arena },
  ],
});
