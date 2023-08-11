<script setup lang="ts">
import { NDrawer, NDrawerContent } from "naive-ui";
import {useRouter} from "vue-router";
import {useSettingsStore} from "../stores/SettingsStore.ts";
import {ref} from "vue";

const router = useRouter();
const settings = useSettingsStore();

const drawerWidth = ref<number>(settings.getForRoute('drawer_width') ?? 500);

const persistDrawerWidth = (width: number) => {
  settings.setForRoute('drawer_width', width);
};
</script>
<template>
  <n-drawer :show="true" :default-width="drawerWidth" :show-mask="false" :placement="'right'" mask-closable close-on-esc resizable @on-esc="router.back" @update-width="persistDrawerWidth">
    <n-drawer-content :header-style="{ display: 'none' }" :body-content-style="{ padding: '0' }" title="Stoner" :native-scrollbar="false">
      <router-view />
    </n-drawer-content>
  </n-drawer>
</template>
