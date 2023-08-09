import { createRouter, createWebHistory } from "vue-router";
import PodListing from "./components/PodListing.vue";
import DeploymentListing from "./components/DeploymentListing.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/pods",
    },
    {
      name: "PodListing",
      path: "/pods",
      component: PodListing,
    },
    {
      name: "DeploymentListing",
      path: "/deployments",
      component: DeploymentListing,
    },
  ],
});
