<script setup lang="ts">
import { NCheckbox } from "naive-ui";
import { useSettingsStore } from "../../stores/SettingsStore";
import { ref, watch } from "vue";
import { Settings } from "../../settings.ts";

const settingsStore = useSettingsStore();
const settings = ref<Settings>(settingsStore.get());

watch(
  settings,
  (value) => {
    settingsStore.set(value);
  },
  { deep: true },
);
</script>
<template>
  <div>
    <h3 class="m-0">General Settings</h3>
    <h4>Namespaces</h4>
    <div class="space-y-2">
      <n-checkbox
        v-model:checked="
          settings.generalSettings.loadDataWithoutActiveNamespace
        "
        >Load data without active namespace</n-checkbox
      >
      <n-checkbox
          v-model:checked="
          settings.generalSettings.useLastActiveContextAndNamespace
        "
      >Remember last active context / namespace on application start</n-checkbox
      >
    </div>
  </div>
</template>
