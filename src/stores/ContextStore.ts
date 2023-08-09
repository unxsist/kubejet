import { defineStore } from "pinia";
import { ref } from "vue";

export const useContextStore = defineStore("context", () => {
  const currentContext = ref<string>("");
  const currentNamespace = ref<string>("");

  return { currentContext, currentNamespace };
});
