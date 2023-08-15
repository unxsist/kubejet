<script setup lang="ts">
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { FitAddon } from "xterm-addon-fit";
import { onMounted, ref } from "vue";
import { invoke } from "@tauri-apps/api/tauri";
import { Event, listen } from "@tauri-apps/api/event";

let terminal: Terminal;
let fitAddon: FitAddon;
const terminalElement = ref<HTMLDivElement>();
const sessionId = ref<string | null>(null);

const props = defineProps<{ initCommand: string[] }>();

const writeToTerminal = (ev: Event<string>) => {
  terminal.write(ev.payload);
};

const writeToPty = (data: string) => {
  void invoke("write_to_pty", {
    sessionId: sessionId.value,
    data: data,
  });
};

const fitToScreen = () => {
  fitAddon.fit();
};

defineExpose({
  fitToScreen,
});

onMounted(() => {
  fitAddon = new FitAddon();
  terminal = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    fontFamily: "monospace",
    theme: {
      background: "#000000",
      foreground: "#ffffff",
    },
  });

  terminal.onData(writeToPty);

  terminal.loadAddon(fitAddon);
  terminal.open(terminalElement.value);
  fitAddon.fit();
});

invoke("create_tty_session", { initCommand: props.initCommand }).then(
  (terminalId) => {
    sessionId.value = terminalId as string;
    listen(`tty_data_${terminalId}`, writeToTerminal);
  },
);
</script>
<template>
  <div id="terminal" ref="terminalElement" class="h-full overflow-hidden"></div>
</template>
