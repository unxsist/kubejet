<script setup lang="ts">
import AppIcon from "../assets/AppIcon.svg";
</script>
<template>
  <div
    class="title-bar flex items-center h-8 absolute top-0 left-0 right-0 bg-[--n-color] select-none p-2"
    data-tauri-drag-region
  >
    <AppIcon class="h-8 text-white mr-2 animate-spin reverse" />
    <slot />
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
