<script setup lang="ts">
import { NIcon } from "naive-ui";
import { Star16Regular, Star16Filled } from "@vicons/fluent";
import {useSettingsStore} from "../stores/SettingsStore";
import {computed} from "vue";

const settingsStore = useSettingsStore();

const props = defineProps<{
  context: string;
  namespace: string;
}>();

const isFavorite = computed(() => {
  const favorites = settingsStore.get(`${props.context}.namespace_favorites`) || [];

  return favorites.includes(props.namespace);
});

const updateFavorite = () => {
  let favorites = settingsStore.get(`${props.context}.namespace_favorites`) || [];

  if (isFavorite.value) {
    favorites = favorites.filter((favorite: string) => favorite !== props.namespace);
  } else {
    favorites.push(props.namespace);
  }

  settingsStore.set(`${props.context}.namespace_favorites`, favorites);
};

</script>
<template>
  <div class="flex items-center justify-between w-full">
    <n-icon size="20" class="group mr-2" @click.stop="updateFavorite">
      <Star16Regular :class="{ 'block group-hover:hidden': !isFavorite, 'hidden': isFavorite }" />
      <Star16Filled :class="{ 'block': isFavorite, 'hidden group-hover:block': !isFavorite }" />
    </n-icon> <span>{{ namespace }}</span>
  </div>
</template>
