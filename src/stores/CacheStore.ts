import { defineStore } from "pinia";
import { ref } from "vue";

export const useCacheStore = defineStore("cache", () => {
  const cache = ref<Map<string, any>>(new Map<string, any>());

  const set = (key: string, value: any) => {
    cache.value.set(key, value);
  };

  const get = (key: string) => {
    return cache.value.get(key);
  };

  const forget = (key: string) => {
    cache.value.delete(key);
  };

  return {
    get,
    set,
    forget,
  };
});
