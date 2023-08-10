import { createRouter, createWebHistory } from "vue-router";
import PodListing from "./components/PodListing.vue";
import DeploymentListing from "./components/DeploymentListing.vue";
import PodDetails from "./components/pods/PodDetails.vue";
import Drawer from "./components/Drawer.vue";

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
      children: [
        {
          name: "PodDetails",
          path: ":podName",
          component: Drawer,
          children: [
            {
              name: "PodDetails",
              path: "",
              component: PodDetails,
            }
          ]
        }
      ]
    },
    {
      name: "DeploymentListing",
      path: "/deployments",
      component: DeploymentListing,
    }
  ],
});
