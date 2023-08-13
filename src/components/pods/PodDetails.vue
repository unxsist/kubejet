<script setup lang="ts">
import {useRoute} from "vue-router";
import { NButton } from "naive-ui";
import DrawerHeader from "../DrawerHeader.vue";
import {Command} from "@tauri-apps/api/shell";
import {useContextStore} from "../../stores/ContextStore.ts";

const contextStore = useContextStore();
const route = useRoute();

const openShell = () => {
  const command = new Command("kubectl", ["exec", "--tty", "--stdin", route.params.podName as string, "--context", contextStore.currentContext, "--namespace", contextStore.currentNamespace,  "--", "/bin/bash"]);
  command.on('close', data => {
    console.log(`command finished with code ${data.code} and signal ${data.signal}`)
  });
  command.on('error', error => console.error(`command error: "${error}"`));
  command.stdout.on('data', line => console.log(`command stdout: "${line}"`));
  command.stderr.on('data', line => console.log(`command stderr: "${line}"`));

  command.spawn().then((child) => {
    child.write("ls -la\n");
  })

};
</script>
<template>
  <div>
    <DrawerHeader :title="route.params.podName as string" :close-route="'/pods'" />
    <div class="flex justify-end p-2 space-x-2">
      <n-button size="small">Logs</n-button>
      <n-button size="small" @click="openShell">Shell</n-button>
    </div>
  </div>
</template>
