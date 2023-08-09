<script setup lang="ts">
import {Notification} from "../stores/NotificationStore";
import {formatISO9075} from "date-fns";

withDefaults(defineProps<{
  notification: Notification
  fixed?: boolean
}>(), {
  fixed: false
});

const emit = defineEmits(["click"]);
</script>

<template>
  <div
      :class="{
      'bg-green-300 text-green-800': notification.type == 'success',
      'bg-yellow-300 text-yellow-800': notification.type == 'warning',
      'bg-red-300 text-red-800': notification.type == 'error',
      'bg-blue-300 text-blue-800': notification.type == 'info',
      'py-0 h-6 truncate inline': fixed
    }"
      class="flex items-center p-2 text-xs"
      @click="emit('click')"
  >
    <span :class="{ 'truncate': fixed }">[{{ formatISO9075(notification.date) }}] {{ notification.message }}</span>
  </div>
</template>
