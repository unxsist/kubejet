<script setup lang="ts">
import { NTabs, NTab } from "naive-ui";
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";

const router = useRouter()
const route = useRoute()

const activeTab = ref(route.path);

const to = (path: string) => {
  router.push(path)
}
</script>
<template>
  <div class="flex h-full">
    <n-tabs v-model:value="activeTab" type="line" placement="left" class="w-auto h-full settings-tabs" @update-value="console.log">
      <n-tab name="/settings/general" @click="to('/settings/general')">General</n-tab>
      <n-tab name="/settings/about" @click="to('/settings/about')">About</n-tab>
    </n-tabs>
    <div class="p-4">
      <router-view />
    </div>
  </div>
</template>
<style>
.settings-tabs .n-tabs-nav-scroll-content {
  height: 100%;
}
.settings-tabs .n-tabs-nav-scroll-content .n-tabs-tab:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
.settings-tabs .n-tabs-nav-scroll-content .n-tabs-tab__label {
  width: 150px;
  margin: 5px 0;
}
</style>
