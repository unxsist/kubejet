<script setup lang="ts">
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';
import {onMounted, ref} from "vue";
import {invoke} from "@tauri-apps/api/tauri";
import { Event, listen } from "@tauri-apps/api/event";


let terminal: Terminal;
const terminalElement = ref<HTMLDivElement>();

const writeToTerminal = (ev: Event<string>) => {
  terminal.write(ev.payload)
}

const writeToPty = (data: string) => {
  void invoke("async_write_to_pty", {
    data,
  });
}

onMounted(() => {
  const fitAddon = new FitAddon();
  terminal = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    fontFamily: "monospace",
    theme: {
      background: "#000000",
      foreground: "#ffffff",
    },
  });
  terminal.loadAddon(fitAddon);
  terminal.open(terminalElement.value);
  fitAddon.fit();

  terminal.onData(writeToPty);
  listen("data", writeToTerminal);
})

</script>
<template>
  <div>
    <div id="terminal" ref="terminalElement"></div>
  </div>
</template>
