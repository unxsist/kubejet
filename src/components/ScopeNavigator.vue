<script setup lang="ts">
import { useContextStore } from "../stores/ContextStore";
import { Kubernetes } from "../services/Kubernetes";
import { NBreadcrumb, NBreadcrumbItem, NPopselect } from "naive-ui";
import { ref } from "vue";
import { useCacheStore } from "../stores/CacheStore";

const contextStore = useContextStore();
const cacheStore = useCacheStore();

const contexts = ref<{ label: string; value: string }[]>([]);
const namespaces = ref<{ label: string; value: string }[]>([]);
const error = ref("");

const loadContexts = () => {
  Kubernetes.getContexts().then((result) => {
    contexts.value = result.map((context) => {
      return {
        label: context,
        value: context,
      };
    });

    loadNamespaces();
  });
};

const loadNamespaces = () => {
  namespaces.value = cacheStore.get("ns_" + contextStore.currentContext) || [];
  error.value = "";
  Kubernetes.getNamespaces(contextStore.currentContext)
    .then((result) => {
      const namespaceOptions = result.map((namespace) => {
        return {
          label: namespace.metadata?.name || "",
          value: namespace.metadata?.name || "",
        };
      });

      namespaces.value = namespaceOptions;
      cacheStore.set("ns_" + contextStore.currentContext, namespaceOptions);
    })
    .catch((reason: string) => {
      error.value = reason;
    });
};

const setContext = (context: string) => {
  contextStore.currentContext = context;
  contextStore.currentNamespace = "";

  loadNamespaces();
};

const setNamespace = (namespace: string) => {
  contextStore.currentNamespace = namespace;
};

loadContexts();
</script>

<template>
  <div>
    <n-breadcrumb>
      <n-breadcrumb-item>
        <n-popselect
          trigger="click"
          placement="bottom-start"
          size="huge"
          :value="contextStore.currentContext"
          :on-update:value="setContext"
          :options="contexts"
          scrollable
        >
          <div class="trigger">
            {{ contextStore.currentContext || "Select context" }}
          </div>
        </n-popselect>
      </n-breadcrumb-item>
      <n-breadcrumb-item v-if="contextStore.currentContext">
        <n-popselect
          trigger="click"
          placement="bottom-start"
          size="huge"
          :value="contextStore.currentNamespace"
          :on-update:value="setNamespace"
          :options="namespaces"
          scrollable
        >
          <div class="trigger">
            {{ contextStore.currentNamespace || "All namespaces" }}
          </div>
          <template #empty>
            <span class="text-white">Loading namespaces...</span>
          </template>
        </n-popselect>
      </n-breadcrumb-item>
    </n-breadcrumb>
  </div>
</template>

<style scoped>
.trigger::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: inherit;
}
</style>
