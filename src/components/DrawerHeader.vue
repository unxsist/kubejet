<script setup lang="ts">
import { RouteLocationRaw } from "vue-router";
import { NButton, NIcon } from "naive-ui";
import { Dismiss20Filled } from "@vicons/fluent";

withDefaults(
  defineProps<{
    title: string;
    closeRoute: RouteLocationRaw;
  }>(),
  {
    title: "Drawer",
    closeRoute: "/",
  },
);
</script>
<template>
  <div class="drawer-header flex items-center justify-between px-4 h-12" data-tauri-drag-region>
    <span class="font-bold">{{ title }}</span>
    <router-link :to="closeRoute">
      <n-button quaternary>
        <n-icon :size="24">
          <Dismiss20Filled />
        </n-icon>
      </n-button>
    </router-link>
  </div>
</template>

<style scoped>
.drawer-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
}
</style>
