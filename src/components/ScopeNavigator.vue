<script setup lang="ts">
import { useContextStore } from "../stores/ContextStore";
import {Kubernetes, KubernetesError} from "../services/Kubernetes";
import ScopeNavigatorNamespaceOption from "./ScopeNavigatorNamespaceOption.vue";
import {NBreadcrumb, NBreadcrumbItem, NPopselect, SelectOption} from "naive-ui";
import {computed, h, ref} from "vue";
import { useCacheStore } from "../stores/CacheStore";
import {useNotificationStore} from "../stores/NotificationStore.ts";
import {useSettingsStore} from "../stores/SettingsStore.ts";

const contextStore = useContextStore();
const notificationStore = useNotificationStore();
const settingsStore = useSettingsStore();
const cacheStore = useCacheStore();

const contexts = ref<{ label: string; value: string }[]>([]);
const namespaces = ref<{ label: string; value: string }[]>([]);

const sortedNamespaces = computed(() => {
  const favorites = settingsStore.getForCluster(contextStore.currentContext).favoriteNamespaces;

  return namespaces.value.slice().sort((a, b) => {
    if (favorites.includes(a.value) && !favorites.includes(b.value)) {
      return -1;
    } else if (!favorites.includes(a.value) && favorites.includes(b.value)) {
      return 1;
    } else if (favorites.includes(a.value) && favorites.includes(b.value)) {
      return b.label.localeCompare(a.label);
    } else {
      return a.label.localeCompare(b.label);
    }
  });
})

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

  const favorites = settingsStore.getForCluster(contextStore.currentContext).favoriteNamespaces;
  if (favorites.length > 0) {
    setNamespace(favorites[0]);
  }

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
    .catch((error: KubernetesError) => {
        notificationStore.error(`Failed to load namespaces: ${error.message}`)
    });
};

const renderNamespaceOption = (option: SelectOption) => {
  return h(
    ScopeNavigatorNamespaceOption,
    {
      context: contextStore.currentContext,
      namespace: option.value as string
    }
  );
}

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
          :options="sortedNamespaces"
          :render-label="renderNamespaceOption"
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
