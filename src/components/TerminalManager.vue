<script setup lang="ts">
import { NDrawer, NDrawerContent, NTabs, NTabPane } from "naive-ui";
import {useTerminalStore} from "../stores/TerminalStore";
import Terminal from "./Terminal.vue";

const terminalStore = useTerminalStore();

</script>
<template>
  <div>
    <n-drawer to="#main-viewport" :default-height="100" :show-mask="false" :trap-focus="false" :block-scroll="false" resizable :show="true" placement="bottom">
      <n-drawer-content :header-style="{ display: 'none' }" :body-content-style="{ padding: '0' }">
        <n-tabs placement="top" type="line">
          <n-tab-pane v-for="(terminal, index) in terminalStore.terminals" :key="index" :name="terminal.title" :tab="terminal.title">
            <Terminal />
          </n-tab-pane>
        </n-tabs>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
