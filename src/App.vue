<script setup lang="ts">
import { darkTheme, NConfigProvider } from "naive-ui";
import JETTheme from './themes/JET';
import ScopeNavigator from "./components/ScopeNavigator.vue";
import WindowTitleBar from "./components/WindowTitleBar.vue";
import NamespaceNavigator from "./components/NamespaceNavigator.vue";
import NotificationDrawer from "./components/NotificationDrawer.vue";
</script>

<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="JETTheme">
    <div class="relative flex">
      <WindowTitleBar>
        <ScopeNavigator />
      </WindowTitleBar>

      <div class="flex flex-grow mt-12 view-wrapper">
        <NamespaceNavigator>
          <div>
            <router-view />
          </div>
        </NamespaceNavigator>
      </div>
    </div>
    <NotificationDrawer />
  </n-config-provider>
</template>

<style scoped>
.view-wrapper {
  height: calc(100vh - 4.5rem);
}
</style>
