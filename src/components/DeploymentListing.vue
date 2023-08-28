<script setup lang="ts">
import { NDataTable } from "naive-ui";
import { ref } from "vue";
import {V1Deployment} from "@kubernetes/client-node";
import {Kubernetes, SelectorOptions} from "../services/Kubernetes";
import { useContextStore } from "../stores/ContextStore";
import { useNotificationStore } from "../stores/NotificationStore";
import {useSettingsStore} from "../stores/SettingsStore.ts";
import {useRouter} from "vue-router";

const router = useRouter();
const settingsStore = useSettingsStore();
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

  if (
      contextStore.currentNamespace == "" &&
      !settingsStore.get().generalSettings.loadDataWithoutActiveNamespace
  ) {
    return;
  }

  Kubernetes.getDeployments(
    contextStore.currentContext,
    contextStore.currentNamespace,
  )
    .then((result: V1Deployment[]) => {
      deployments.value = result;
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

const rowProps = (row: V1Deployment) => {
  return {
    style: {
      cursor: "pointer",
    },
    onClick: onRowClick.bind(this, row),
  };
};


const onRowClick = (row: V1Deployment) => {
  router.push({
    name: "PodListing",
    params: {
      labelSelector: `app=${row.metadata?.name}`
    },
  });
  contextStore.addScopeCrumb({
    name: row.metadata?.name || '',
    path: {
      name: 'PodListing',
      params: {
        labelSelector: `app=${row.metadata?.name}`
      },
    }
  })
};
</script>

<template>
  <n-data-table
    :bordered="false"
    :pagination="false"
    :columns="columns"
    :data="deployments"
    :row-props="rowProps"
  />
</template>
