<script setup lang="ts">
import {useRoute} from "vue-router";
import DrawerHeader from "../DrawerHeader.vue";

const route = useRoute();

</script>
<template>
  <div>
    <DrawerHeader :title="route.params.podName as string" :close-route="'/pods'" />
  </div>
</template>
