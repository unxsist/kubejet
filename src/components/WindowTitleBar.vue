<script setup lang="ts">
import { Settings24Regular } from "@vicons/fluent";
import { NIcon } from "naive-ui";
import AppIcon from "../assets/AppIcon.svg";

const emit = defineEmits(["open-settings"]);
</script>
<template>
  <div
    class="title-bar flex items-center h-8 absolute top-0 left-0 right-0 bg-[--n-color] select-none p-2"
    data-tauri-drag-region
  >
    <AppIcon class="h-8 text-white mr-2 animate-spin reverse" />
    <slot />
    <n-icon size="20" class="ml-auto" @click="emit('open-settings')">
      <Settings24Regular class="text-white" />
    </n-icon>
  </div>
</template>

<style scoped>
.title-bar {
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
}

.reverse {
  animation-direction: reverse;
  animation-duration: 10s;
}
</style>
