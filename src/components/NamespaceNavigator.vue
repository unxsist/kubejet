<script setup lang="ts">
import { MenuOption, NMenu, NLayout, NLayoutSider, NScrollbar } from "naive-ui";
import { ref, h } from "vue";
import {RouterLink, useRoute, useRouter} from "vue-router";
import { renderIcon } from "../utils";
import { Box24Regular, ArrowClockwise24Filled } from "@vicons/fluent";
import { Key } from "naive-ui/es/menu/src/interface";
import {useContextStore} from "../stores/ContextStore.ts";

const contextStore = useContextStore();
const router = useRouter();
const route = useRoute();
const collapsed = ref(true);

const menuOptions: MenuOption[] = [
  {
    label: 'Pods',
    key: 'PodListing',
    icon: renderIcon(Box24Regular),
  },
  {
    label: 'Deployments',
    key: 'DeploymentListing',
    icon: renderIcon(ArrowClockwise24Filled),
  },
];

const handleRoute = (routeName: Key) => {
  contextStore.clearCrumbs();

  router.push({ name: routeName as string });

  contextStore.addScopeCrumb({
    name: menuOptions.find((option) => option.key === routeName)?.label as string,
    path: {
      name: 'DeploymentListing'
    }
  })
};

</script>
<template>
  <n-layout has-sider>
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :collapsed="collapsed"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <n-menu
        :value="route.name as Key"
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        @update:value="handleRoute"
      />
    </n-layout-sider>
    <n-layout>
      <n-scrollbar>
        <slot />
      </n-scrollbar>
    </n-layout>
  </n-layout>
</template>
