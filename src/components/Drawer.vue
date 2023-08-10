<script setup lang="ts">
import { NDrawer, NDrawerContent } from "naive-ui";
import {useRouter} from "vue-router";

const router = useRouter();
</script>
<template>
  <n-drawer :show="true" default-width="500" :show-mask="false" :placement="'right'" mask-closable close-on-esc resizable @on-esc="router.back">
    <n-drawer-content :header-style="{ display: 'none' }" :body-content-style="{ padding: '0' }" title="Stoner" :native-scrollbar="false">
      <router-view />
    </n-drawer-content>
  </n-drawer>
</template>
