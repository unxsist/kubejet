<script setup lang="ts">
import AppIcon from "../assets/AppIcon.svg";
</script>
<template>
  <div
    class="flex items-center h-8 absolute top-0 left-0 right-0 bg-green-400 select-none p-2"
    data-tauri-drag-region
  >
    <AppIcon class="h-8 text-white mr-2" />
    <slot />
  </div>
</template>
