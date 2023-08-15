<script setup lang="ts">
import { useRoute } from "vue-router";
import { NStatistic, NTabs, NTabPane, NIcon } from "naive-ui";
import DrawerHeader from "../DrawerHeader.vue";
import { useContextStore } from "../../stores/ContextStore";
import {onBeforeMount, ref} from "vue";
import {V1Container, V1Pod} from "@kubernetes/client-node";
import {Kubernetes} from "../../services/Kubernetes";
import ContainerDetails from "./ContainerDetails.vue";
import Terminal from "../Terminal.vue";
import { Terminal3270 } from '@vicons/carbon'

const terminals = ref<{ title: string, initCommand: string[] }[]>([]);
const contextStore = useContextStore();
const route = useRoute();
const pod = ref<V1Pod>({});

onBeforeMount( async () => {
  pod.value = await Kubernetes.getPod(contextStore.currentContext, contextStore.currentNamespace, route.params.podName as string);
})

// const spawnShellTerminal = () => {
//   terminalStore.createTerminal(route.params.podName as string, [
//     "kubectl",
//     "exec",
//     "--tty",
//     "--stdin",
//     route.params.podName as string,
//     "--context",
//     contextStore.currentContext,
//     "--namespace",
//     contextStore.currentNamespace,
//     "--",
//     "/bin/bash",
//   ]);
// };

const createShellForContainer = (container: V1Container) => {
  terminals.value.push({
    title: container.name as string,
    initCommand: [
      "kubectl",
      "exec",
      "--tty",
      "--stdin",
      route.params.podName as string,
      "--context",
      contextStore.currentContext,
      "--namespace",
      contextStore.currentNamespace,
      "-c",
      container.name as string,
      "--",
      "/bin/bash",
    ]
  })
};
</script>
<template>
  <div>
    <DrawerHeader
      :title="route.params.podName as string"
      :close-route="'/pods'"
    />
    <div class="flex flex-col p-4">
      <n-statistic label="Age" :value="'3 days'" />
    </div>
    <n-tabs type="card">
      <template #prefix>
        <div class="w-1"></div>
      </template>
      <n-tab-pane name="overview" tab="Overview">
      </n-tab-pane>
      <n-tab-pane name="containers" tab="Containers">
        <ContainerDetails v-for="container in pod.spec?.containers" :key="container.name" :container="container" @shell-requested="createShellForContainer(container)" />
      </n-tab-pane>
      <n-tab-pane name="logs" tab="Logs">
      </n-tab-pane>
      <n-tab-pane v-for="terminal in terminals" :key="terminal.title" display-directive="show" :name="terminal.title" :tab="`Shell: ${terminal.title}`" closable>
        <template #tab>
          <NIcon size="10"><Terminal3270 /></NIcon> {{ terminal.title }}
        </template>
        <Terminal :init-command="terminal.initCommand" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
