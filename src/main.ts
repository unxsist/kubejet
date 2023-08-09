import devtools from "@vue/devtools";
import { createApp } from "vue";

import { createPinia } from "pinia";
import router from "./router";
import { useContextStore } from "./stores/ContextStore";
import { Kubernetes } from "./services/Kubernetes";
import { useNotificationStore } from "./stores/NotificationStore";

import "./styles.css";
import "vfonts/IBMPlexMono.css";
import App from "./App.vue";

if (process.env.NODE_ENV === "development") {
  devtools.connect("http://localhost", 8098);
}

const pinia = createPinia();
const app = createApp(App).use(router).use(pinia);


const contextStore = useContextStore();
const notificationStore = useNotificationStore();

Kubernetes.getCurrentContext()
  .then((context) => {
    contextStore.currentContext = context;
  })
  .finally(() => {
    notificationStore.info("Welcome to kubejet!");
    app.mount("#app");
  });
