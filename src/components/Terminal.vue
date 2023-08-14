<script setup lang="ts">
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';
import {onMounted, ref} from "vue";
import {invoke} from "@tauri-apps/api/tauri";
import { Event, listen } from "@tauri-apps/api/event";


let terminal: Terminal;
const terminalElement = ref<HTMLDivElement>();
const sessionId = ref<string|null>(null);

const writeToTerminal = (ev: Event<string>) => {
  terminal.write(ev.payload)
}

const writeToPty = (data: string) => {
  void invoke("write_to_pty", {
    sessionId: sessionId.value,
    data: data,
  });
}

onMounted(() => {
  invoke('create_tty_session').then(terminalId => {
    sessionId.value = terminalId as string;

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

    terminal.onData(writeToPty);
    listen(`tty_data_${terminalId}`, writeToTerminal);

    terminal.loadAddon(fitAddon);
    terminal.open(terminalElement.value);
    fitAddon.fit();
  })
})

</script>
<template>
  <div>
    <div id="terminal" ref="terminalElement"></div>
  </div>
</template>
