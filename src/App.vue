<script setup lang="ts">
import { darkTheme, NConfigProvider } from "naive-ui";
import JETTheme from './themes/JET';
import ScopeNavigator from "./components/ScopeNavigator.vue";
import WindowTitleBar from "./components/WindowTitleBar.vue";
import NamespaceNavigator from "./components/NamespaceNavigator.vue";
import NotificationDrawer from "./components/NotificationDrawer.vue";
import {computed, ref} from "vue";
import SettingsTitleBar from "./components/SettingsTitleBar.vue";
import {WebviewWindow} from "@tauri-apps/api/window";
import {useRoute} from "vue-router";

const route = useRoute();
const settingsOpen = ref(false);

const isSettings = computed(() => {
  return route.matched.some((record) => record.name === 'Settings');
});

const openSettings = () => {
  settingsOpen.value = true;

  const settingsView = new WebviewWindow('Settings', {
    url: '/settings',
    alwaysOnTop: true,
    decorations: false,
    resizable: false,
    center: true,
    fullscreen: false,
    transparent: true,
  });

  settingsView.listen('tauri://close-requested', () => {
    settingsView.close();
    settingsOpen.value = false;
  });
}
</script>

<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="JETTheme">
    <div v-if="settingsOpen" data-tauri-drag-region class="absolute top-0 bottom-0 left-0 right-0 bg-black opacity-75 z-[9999] rounded-[10px]"></div>

    <div class="relative flex">
      <WindowTitleBar v-if="!isSettings" @open-settings="openSettings">
        <ScopeNavigator />
      </WindowTitleBar>
      <SettingsTitleBar v-if="isSettings">
        <span>Settings</span>
      </SettingsTitleBar>

      <div class="flex flex-grow mt-12 view-wrapper" :class="{ 'is-settings': isSettings }">
        <NamespaceNavigator v-if="!isSettings">
          <div>
            <router-view />
          </div>
        </NamespaceNavigator>
        <div v-if="isSettings">
          <router-view />
        </div>
      </div>
    </div>
    <NotificationDrawer v-if="!isSettings" />
  </n-config-provider>
</template>

<style scoped>
.view-wrapper {
  height: calc(100vh - 4.5rem);
}

.view-wrapper.is-settings {
  height: calc(100vh - 3rem);
}
</style>
