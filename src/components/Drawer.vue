<script setup lang="ts">
import { NDrawer, NDrawerContent } from "naive-ui";
import { useRouter } from "vue-router";
import { useSettingsStore } from "../stores/SettingsStore";
import {computed, onBeforeMount, ref} from "vue";
import { RouteSettings } from "../settings.ts";
import {getCurrent, LogicalSize, currentMonitor} from '@tauri-apps/api/window'

const window = getCurrent();

const router = useRouter();
const settings = useSettingsStore();

const windowSize = ref<LogicalSize | null>(null);
const routeSettings = ref<RouteSettings>(settings.getForRoute());

const persistDrawerWidth = (width: number) => {
  routeSettings.value.drawerWidth = width;
  settings.setForRoute(routeSettings.value);
};

const safeDrawerWidth = computed(() => {
  if (windowSize.value === null) {
    return routeSettings.value.drawerWidth ?? 500;
  }

  return Math.min(windowSize.value.width - 100, routeSettings.value.drawerWidth ?? 500);
});

onBeforeMount(async() => {
  const monitor = await currentMonitor();
  windowSize.value = (await window.innerSize()).toLogical(monitor?.scaleFactor ?? 1)

  await window.onResized(async ({ payload: size }) => {
    const monitor = await currentMonitor();
    windowSize.value = size.toLogical(monitor?.scaleFactor ?? 1)
  });
});
</script>
<template>
  <n-drawer
    :show="true"
    :default-width="routeSettings.drawerWidth ?? 500"
    :show-mask="false"
    :placement="'right'"
    :style="{ maxWidth: `${safeDrawerWidth}px` }"
    mask-closable
    close-on-esc
    resizable
    @on-esc="router.back"
    @update-width="persistDrawerWidth"
  >
    <n-drawer-content
      :header-style="{ display: 'none' }"
      :body-content-style="{ padding: '0', height: '100%', maxHeight: '100%' }"
      title="Stoner"
      :native-scrollbar="false"
    >
      <router-view />
    </n-drawer-content>
  </n-drawer>
</template>
