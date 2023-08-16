<script setup lang="ts">
import { NPopselect, NButton, NLog } from 'naive-ui'
import {Child, Command} from '@tauri-apps/api/shell'
import {useContextStore} from "../../stores/ContextStore";
import {computed, nextTick, onMounted, onUnmounted, ref, watchEffect} from "vue";

const contextStore = useContextStore();

const logComponent = ref<typeof NLog | null>(null);
const logs = ref<string[]>([]);
let logProcess : Child | null = null;

const logsSince = ref<string>("5m");
const logsSinceOptions = [
  {
    label: 'Live Tail',
    value: 'live'
  },
  {
    label: '5 minutes',
    value: '5m'
  },
  {
    label: '10 minutes',
    value: '10m'
  },
  {
    label: '15 minutes',
    value: '15m'
  },
  {
    label: '30 minutes',
    value: '30m'
  },
  {
    label: '1 hour',
    value: '1h'
  },
  {
    label: '2 hours',
    value: '2h'
  },
  {
    label: '3 hours',
    value: '3h'
  },
  {
    label: '6 hours',
    value: '6h'
  },
  {
    label: '12 hours',
    value: '12h'
  },
  {
    label: '24 hours',
    value: '24h'
  },
  {
    label: 'All Logs',
    value: 'all'
  }
]

const props = defineProps<{
  podName: string;
}>();

const initCommand = computed(() => {
  const initCommandArgs = [
    "logs",
    "--context",
    contextStore.currentContext,
    "--namespace",
    contextStore.currentNamespace
  ];

  if (logsSince.value !== "live" && logsSince.value !== "all") {
    initCommandArgs.push("--since=" + logsSince.value)
  }

  if (logsSince.value === "live") {
    initCommandArgs.push("--follow")
  }

  initCommandArgs.push(props.podName)

  return initCommandArgs;
});

const initLogOutput = async () => {
  logs.value = [];

  const command = new Command("kubectl", initCommand.value);

  command.stdout.on('data', (data) => {
    logs.value.push(data);

    logComponent.value?.scrollTo({ position: 'bottom', slient: true })
  });

  const child = await command.spawn();
  logProcess = child;
}

onMounted(() => {
  initLogOutput();
});

onUnmounted(() => {
  if (logProcess) {
    logProcess.kill();
  }
});
</script>
<template>
  <div class="p-4">
    <div class="flex items-center space-x-2 mb-4">
      <span>Logs since: </span>
      <n-popselect v-model:value="logsSince" :options="logsSinceOptions" @update:value="initLogOutput">
        <n-button>{{ logsSince }}</n-button>
      </n-popselect>
    </div>
    <n-log ref="logComponent" line-height="1.5" :lines="logs" class="max-h-[300px]"></n-log>
  </div>
</template>
