import { defineStore } from "pinia";
import { ref } from "vue";
import {RouteLocationRaw} from "vue-router";

export class ScopeCrumb {
  constructor(public name: string, public path: RouteLocationRaw) {}
}

export const useContextStore = defineStore("context", () => {
  const currentContext = ref<string>("");
  const currentNamespace = ref<string>("");
  const crumbs = ref<ScopeCrumb[]>([]);

  const addScopeCrumb = (ScopeCrumb: ScopeCrumb) => {
    crumbs.value.push(ScopeCrumb);
  }

  const removeScopeCrumb = (ScopeCrumb: ScopeCrumb) => {
    crumbs.value.splice(crumbs.value.indexOf(ScopeCrumb), 1);
  }

  const clearCrumbs = () => {
    crumbs.value = [];
  }

  return { currentContext, currentNamespace, crumbs, addScopeCrumb, removeScopeCrumb, clearCrumbs };
});
