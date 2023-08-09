<script setup lang="ts">
import {NDrawer, NDrawerContent} from "naive-ui";
import {useNotificationStore} from "../stores/NotificationStore";
import {ref} from "vue";
import NotificationDrawerMessage from './NotificationDrawerMessage.vue';

const notificationStore = useNotificationStore();
const open = ref(false)
const updateKey = ref(0)

setInterval(() => {
  updateKey.value++;
}, 1000)
</script>

<template>
  <div>
    <NotificationDrawerMessage
      v-if="notificationStore.hasRecentNotifications() && notificationStore.latest"
      :key="updateKey"
      :notification="notificationStore.latest"
      :fixed="true"
      @click="open = true"
    />
    <div
      v-else
      class="no-new-messages flex items-center px-2 text-xs h-6 text-gray-700"
      @click="open = true"
    >
      No new messages ({{ notificationStore.notifications.length }} in total)
    </div>
    <n-drawer v-model:show="open" placement="bottom" resizable>
      <n-drawer-content :native-scrollbar="false" body-content-style="padding: 0;" closable>
        <template #header>
          <div>Messages</div>
        </template>
        <div class="space-y-1">
          <div
            v-for="(notification, index) in notificationStore.chronological"
            :key="index"
          >
            <NotificationDrawerMessage :notification="notification" />
          </div>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<style scoped>
.no-new-messages {
  background: rgb(24, 24, 28);
  border-top: 1px solid rgba(255, 255, 255, 0.09);
}

.no-new-messages:hover {
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  color: #fff;
}
</style>
