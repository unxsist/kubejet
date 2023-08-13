import {defineStore} from "pinia";
import {ref} from "vue";
import {invoke} from "@tauri-apps/api/tauri";

export interface Terminal {
    identifier: string;
    title: string;
}

export const useTerminalStore = defineStore("terminal", () => {
    const terminals = ref<Terminal[]>([{identifier: 'pod-1234-abc', title: "Logs for pod"}]);

    const createTerminal = async (title: string, command: string): Promise<Terminal> => {
        const identifier: string = await invoke("create_terminal", {title: title, command: command});
        const terminal = {identifier: identifier, title: title};
        terminals.value.push(terminal);
        return terminal;
    }

    return { terminals, createTerminal }
});
