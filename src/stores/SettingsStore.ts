import { defineStore } from "pinia";
import { ref } from "vue";

import { exists, readTextFile, writeTextFile, createDir, BaseDirectory } from '@tauri-apps/api/fs'

export const useSettingsStore = defineStore("settings", () => {
    const currentRouteName = ref("");
    const settings = ref<Map<string, any>>(new Map<string, any>());
    const settingsFile = 'settings.json'

    const initialize = async () => {
        if (!await exists(settingsFile, {dir: BaseDirectory.AppConfig})) {
            if (!await exists('', {dir: BaseDirectory.AppConfig})) {
                await createDir('', {dir: BaseDirectory.AppConfig})
            }

            await writeTextFile(
                settingsFile,
                JSON.stringify({}),
                { dir: BaseDirectory.AppConfig }
            );
        }

        const file = await readTextFile(settingsFile, { dir: BaseDirectory.AppConfig });
        settings.value = new Map<string, any>(Object.entries(JSON.parse(file)));
    }

    const save = async () => {
        await writeTextFile(
            settingsFile,
            JSON.stringify(Object.fromEntries(settings.value)),
            { dir: BaseDirectory.AppConfig }
        );
    }

    const set = (key: string, value: any) => {
        settings.value.set(key, value);
        save()
    }

    const get = (key: string) => {
        return settings.value.get(key);
    }

    const getForRoute = (key: string) => {
        return get(`routes.${currentRouteName.value}.${key}`);
    }

    const setForRoute = (key: string, value: any) => {
        set(`routes.${currentRouteName.value}.${key}`, value);
    }

    return { initialize, set, get, getForRoute, setForRoute, currentRouteName }
});
