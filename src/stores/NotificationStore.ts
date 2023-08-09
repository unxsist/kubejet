import { defineStore } from "pinia";
import { computed, ref } from "vue";

type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  date: Date;
  message: string;
  type: NotificationType;
}

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref<Notification[]>([]);

  const latest = computed(() => {
    if (notifications.value.length === 0) {
      return null;
    }

    return notifications.value[notifications.value.length - 1];
  });

  function hasRecentNotifications() {
    // if latest notification is not older than 5 seconds
    if (latest.value === null) {
      return false;
    }

    const now = new Date();
    const diff = now.getTime() - latest.value.date.getTime();
    return diff < 3000;
  }

  const chronological = computed(() => {
    return notifications.value.slice().reverse();
  });

  const add = (notification: Notification) => {
    notifications.value.push(notification);
  };

  const addMessage = (message: string, type: NotificationType) => {
    add({
      date: new Date(),
      message: message,
      type: type,
    });
  };

  const error = (message: string) => {
    addMessage(message, "error");
  };

  const success = (message: string) => {
    addMessage(message, "success");
  };

  const warning = (message: string) => {
    addMessage(message, "warning");
  };

  const info = (message: string) => {
    addMessage(message, "info");
  };

  return {
    notifications,
    latest,
    hasRecentNotifications,
    chronological,
    add,
    error,
    success,
    warning,
    info,
  };
});
