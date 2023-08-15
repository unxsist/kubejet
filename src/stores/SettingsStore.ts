import { defineStore } from "pinia";
import { ref } from "vue";
import {
  exists,
  readTextFile,
  writeTextFile,
  createDir,
  BaseDirectory,
} from "@tauri-apps/api/fs";
import {
  ClusterSettings,
  DefaultClusterSettings,
  DefaultRouteSettings,
  DefaultSettings,
  RouteSettings,
  Settings,
} from "../settings";
import { jsonMapReviver, jsonMapReplacer } from "../utils";

export const useSettingsStore = defineStore("settings", () => {
  const currentRouteName = ref("");
  const settings = ref<Settings>({} as Settings);
  const settingsFile = "settings.json";

  const initialize = async () => {
    if (!(await exists(settingsFile, { dir: BaseDirectory.AppConfig }))) {
      if (!(await exists("", { dir: BaseDirectory.AppConfig }))) {
        await createDir("", { dir: BaseDirectory.AppConfig });
      }

      await writeTextFile(
        settingsFile,
        JSON.stringify(DefaultSettings, jsonMapReplacer),
        { dir: BaseDirectory.AppConfig },
      );
    }

    const file = await readTextFile(settingsFile, {
      dir: BaseDirectory.AppConfig,
    });
    settings.value = JSON.parse(file, jsonMapReviver) as Settings;
  };

  const save = async () => {
    await writeTextFile(
      settingsFile,
      JSON.stringify(settings.value, jsonMapReplacer),
      { dir: BaseDirectory.AppConfig },
    );
  };

  const get = (): Settings => {
    return settings.value;
  };

  const set = (newSettings: Settings) => {
    settings.value = newSettings;
    save();
  };

  const getForRoute = (): RouteSettings => {
    return (
      settings.value.routeSettings.get(currentRouteName.value) ??
      DefaultRouteSettings
    );
  };

  const setForRoute = (routeSettings: RouteSettings) => {
    settings.value.routeSettings.set(currentRouteName.value, routeSettings);
    save();
  };

  const getForCluster = (contextName: string): ClusterSettings => {
    return (
      settings.value.clusterSettings.get(contextName) ?? DefaultClusterSettings
    );
  };

  const setForCluster = (
    contextName: string,
    clusterSettings: ClusterSettings,
  ) => {
    settings.value.clusterSettings.set(contextName, clusterSettings);
    save();
  };

  return {
    initialize,
    get,
    set,
    getForRoute,
    setForRoute,
    getForCluster,
    setForCluster,
    currentRouteName,
  };
});
