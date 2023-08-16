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
import { Terminal as TerminalIcon } from '@vicons/carbon'
import PodLogs from "./PodLogs.vue";

const activeTab = ref("overview");
const terminals = ref<{ container: string, initCommand: string[] }[]>([]);
const contextStore = useContextStore();
const route = useRoute();
const pod = ref<V1Pod>({});

onBeforeMount( async () => {
  pod.value = await Kubernetes.getPod(contextStore.currentContext, contextStore.currentNamespace, route.params.podName as string);
})

const createShellForContainer = (container: V1Container) => {
  if (terminals.value.find(t => t.container === container.name)) {
    activeTab.value = container.name;
    return;
  }

  terminals.value.push({
    container: container.name as string,
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
  });

  activeTab.value = container.name;
};

const closeShell = (name: string) => {
  console.log(name);
  const index = terminals.value.findIndex(t => t.container === name);
  terminals.value.splice(index, 1);

  activeTab.value = "containers";
}
</script>
<template>
  <div class="flex flex-col h-full">
    <DrawerHeader
      :title="route.params.podName as string"
      :close-route="'/pods'"
    />
    <div class="flex flex-col p-4">
      <n-statistic label="Age" :value="'3 days'" />
    </div>
    <n-tabs v-model:value="activeTab" type="card" class="flex-grow" pane-class="h-full pt-0" @close="closeShell">
      <template #prefix>
        <div class="w-1"></div>
      </template>
      <n-tab-pane name="overview" tab="Overview">
      </n-tab-pane>
      <n-tab-pane name="containers" tab="Containers">
        <ContainerDetails v-for="container in pod.spec?.containers" :key="container.name" :container="container" @shell-requested="createShellForContainer(container)" />
      </n-tab-pane>
      <n-tab-pane name="logs" tab="Logs">
        <PodLogs :pod-name="pod.metadata?.name"/>
      </n-tab-pane>
      <n-tab-pane v-for="terminal in terminals" :key="terminal.container" display-directive="show" :name="terminal.container" :tab="`Shell: ${terminal.container}`" closable>
        <template #tab>
          <NIcon size="18" class="mr-2"><TerminalIcon /></NIcon> {{ terminal.container }}
        </template>
        <Terminal :init-command="terminal.initCommand" />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>
