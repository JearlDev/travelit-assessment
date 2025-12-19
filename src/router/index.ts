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
    // Route validation
    beforeEnter: (to: any) => {
      // Validate username parameter
      const username = to.params.username;
      if (
        !username ||
        typeof username !== "string" ||
        username.trim().length < 1
      ) {
        return { name: "Home" };
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
