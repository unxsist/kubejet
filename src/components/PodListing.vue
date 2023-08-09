<script setup lang="ts">
import { NDataTable } from "naive-ui";
import { ref } from "vue";
import { V1Pod } from "@kubernetes/client-node";
import { Kubernetes } from "../services/Kubernetes";
import { useContextStore } from "../stores/ContextStore";
import { useNotificationStore } from "../stores/NotificationStore";

const contextStore = useContextStore();
const notificationStore = useNotificationStore();

contextStore.$subscribe(() => {
  getPods();
});

const columns = [
  {
    title: "Name",
    key: "metadata.name",
  },
  {
    title: "Status",
    key: "status.phase",
  },
  {
    title: "Restarts",
    key: "status.containerStatuses[0].restartCount",
  },
  {
    title: "Age",
    key: "metadata.creationTimestamp",
  },
];

const pods = ref<V1Pod[]>();

async function getPods() {
  pods.value = [];
  Kubernetes.getPods(contextStore.currentContext, contextStore.currentNamespace)
    .then((result: V1Pod[]) => {
      pods.value = result;
    })
    .catch((error: any) => {
      notificationStore.add({
        type: "error",
        message: error.message,
        date: new Date(),
      });
    });
}

getPods();
</script>

<template>
  <n-data-table
    :bordered="false"
    :pagination="false"
    :columns="columns"
    :data="pods"
  />
</template>
