<script setup lang="ts">
import { NDataTable } from "naive-ui";
import { ref } from "vue";
import { V1Deployment } from "@kubernetes/client-node";
import { Kubernetes } from "../services/Kubernetes";
import { useContextStore } from "../stores/ContextStore";
import { useNotificationStore } from "../stores/NotificationStore";

const contextStore = useContextStore();
const notificationStore = useNotificationStore();

contextStore.$subscribe(() => {
  getDeployments();
});

const columns = [
  {
    title: "Name",
    key: "metadata.name",
  },
  {
    title: "Age",
    key: "metadata.creationTimestamp",
  },
];

const deployments = ref<V1Deployment[]>();

async function getDeployments() {
  deployments.value = [];
  Kubernetes.getDeployments(
    contextStore.currentContext,
    contextStore.currentNamespace,
  )
    .then((result: V1Deployment[]) => {
      deployments.value = result;
      console.log(deployments.value);
    })
    .catch((error: any) => {
      notificationStore.add({
        type: "error",
        message: error.message,
        date: new Date(),
      });
    });
}

getDeployments();
</script>

<template>
  <n-data-table
    :bordered="false"
    :pagination="false"
    :columns="columns"
    :data="deployments"
  />
</template>
