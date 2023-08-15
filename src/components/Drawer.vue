<script setup lang="ts">
import { NDrawer, NDrawerContent } from "naive-ui";
import { useRouter } from "vue-router";
import { useSettingsStore } from "../stores/SettingsStore";
import { ref } from "vue";
import { RouteSettings } from "../settings.ts";

const router = useRouter();
const settings = useSettingsStore();

const routeSettings = ref<RouteSettings>(settings.getForRoute());

const persistDrawerWidth = (width: number) => {
  routeSettings.value.drawerWidth = width;
  settings.setForRoute(routeSettings.value);
};
</script>
<template>
  <n-drawer
    :show="true"
    :default-width="routeSettings.drawerWidth ?? 500"
    :show-mask="false"
    :placement="'right'"
    mask-closable
    close-on-esc
    resizable
    @on-esc="router.back"
    @update-width="persistDrawerWidth"
  >
    <n-drawer-content
      :header-style="{ display: 'none' }"
      :body-content-style="{ padding: '0' }"
      title="Stoner"
      :native-scrollbar="false"
    >
      <router-view />
    </n-drawer-content>
  </n-drawer>
</template>
