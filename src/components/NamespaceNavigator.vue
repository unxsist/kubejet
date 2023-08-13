<script setup lang="ts">
import { MenuOption, NMenu, NLayout, NLayoutSider, NScrollbar } from "naive-ui";
import {ref, h, onMounted} from "vue";
import { RouterLink, useRoute } from "vue-router";
import { renderIcon } from "../utils";
import { Box24Regular, ArrowClockwise24Filled } from "@vicons/fluent";
import {Key} from "naive-ui/es/menu/src/interface";

const route = useRoute();
const emit = defineEmits(['mounted']);
const collapsed = ref(true);

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "PodListing",
          },
        },
        {
          default: () => "Pods",
        },
      ),
    key: "PodListing",
    icon: renderIcon(Box24Regular),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "DeploymentListing",
          },
        },
        {
          default: () => "Deployments",
        },
      ),
    key: "DeploymentListing",
    icon: renderIcon(ArrowClockwise24Filled),
  },
];

onMounted(() => {
  emit('mounted');
});

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
      />
    </n-layout-sider>
    <n-layout>
      <n-scrollbar>
        <slot />
      </n-scrollbar>
    </n-layout>
  </n-layout>
</template>
