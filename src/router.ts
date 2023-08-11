import { createRouter, createWebHistory } from "vue-router";
import PodListing from "./components/PodListing.vue";
import DeploymentListing from "./components/DeploymentListing.vue";
import PodDetails from "./components/pods/PodDetails.vue";
import Drawer from "./components/Drawer.vue";
import {useSettingsStore} from "./stores/SettingsStore.ts";
import Settings from "./components/Settings.vue";
import General from "./components/settings/General.vue";
import About from "./components/settings/About.vue";

const router = createRouter({
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
    },
    {
      name: "Settings",
      path: "/settings",
      component: Settings,
      redirect: "/settings/general",
      children: [
        {
          name: "General",
          path: "general",
          component: General
        },
        {
          name: "About",
          path: "about",
          component: About
        }
      ]
    }
  ],
});

router.beforeEach(async (to) => {
  const settingsStore = useSettingsStore();
  settingsStore.currentRouteName = to.name as string;

  return true
});

export default router;
