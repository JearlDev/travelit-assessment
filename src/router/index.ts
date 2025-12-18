import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Repositories from "../views/Repositories.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/repositories/:username",
    name: "Repositories",
    component: Repositories,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
