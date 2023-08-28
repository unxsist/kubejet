<script setup lang="ts">
import {RouteLocationRaw, useRouter} from "vue-router";
import { NButton, NIcon } from "naive-ui";
import { Dismiss20Filled } from "@vicons/fluent";

const router = useRouter();

const props = withDefaults(
  defineProps<{
    title: string;
    closeRoute?: RouteLocationRaw;
    goBackOnClose?: boolean;
  }>(),
  {
    title: "Drawer",
    closeRoute: "/",
    goBackOnClose: true,
  },
);

const handleClose = () => {
  if (props.goBackOnClose) {
    router.back();
  } else {
    router.push(props.closeRoute);
  }
}
</script>
<template>
  <div class="drawer-header flex items-center justify-between px-4 h-12" data-tauri-drag-region>
    <span class="font-bold">{{ title }}</span>
    <a @click="handleClose">
      <n-button quaternary>
        <n-icon :size="24">
          <Dismiss20Filled />
        </n-icon>
      </n-button>
    </a>
  </div>
</template>

<style scoped>
.drawer-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
}
</style>
