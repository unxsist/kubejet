<script setup lang="ts">
import {V1Container} from "@kubernetes/client-node";

defineProps<{
  container: V1Container
}>()

const emit = defineEmits(['shell-requested'])
</script>
<template>
  <div>
    {{ container.name }} - {{ container.image }} <button @click="emit('shell-requested')">Shell</button>
  </div>
</template>
