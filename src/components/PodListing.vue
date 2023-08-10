<script setup lang="ts">
import {DataTableColumn, NDataTable} from "naive-ui";
import {onMounted, ref} from "vue";
import { V1Pod } from "@kubernetes/client-node";
import { Kubernetes } from "../services/Kubernetes";
import { useContextStore } from "../stores/ContextStore";
import { useNotificationStore } from "../stores/NotificationStore";
import { useCacheStore } from "../stores/CacheStore.ts";
import {useRouter} from "vue-router";

const router = useRouter();
const contextStore = useContextStore();
const cacheStore = useCacheStore();
const notificationStore = useNotificationStore();

contextStore.$subscribe(() => {
  getPods();
});

const columns : DataTableColumn[] = [
  {
    title: "Name",
    key: "metadata.name",
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
  },
  {
    title: "Status",
    key: "status.phase",
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
  },
  {
    title: "Restarts",
    key: "status.containerStatuses[0].restartCount",
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
    align: "right",
  },
  {
    title: "Age",
    key: "metadata.creationTimestamp",
    ellipsis: {
      tooltip: true,
    },
    resizable: true,
  },
];

const rowProps = (row: V1Pod) => {
  return {
    style: {
      cursor: "pointer",
    },
    onClick: onRowClick.bind(this, row),
  };
};

const pods = ref<V1Pod[]>(cacheStore.get("pods") || []);

async function getPods() {
  Kubernetes.getPods(contextStore.currentContext, contextStore.currentNamespace)
    .then((result: V1Pod[]) => {
      pods.value = result;
      cacheStore.set("pods", result);
    })
    .catch((error: any) => {
      notificationStore.add({
        type: "error",
        message: error.message,
        date: new Date(),
      });
    });
}

onMounted(() => {
  getPods();
});

const onRowClick = (row: V1Pod) => {
  router.push('/pods/' + row.metadata?.name);
};
</script>

<template>
  <n-data-table
    :bordered="false"
    :pagination="false"
    :columns="columns"
    :row-props="rowProps"
    :data="pods"
    size="small"
  />
  <router-view />
</template>