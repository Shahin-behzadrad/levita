import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NotificationState {
  isRead: boolean;
  setRead: (isRead: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      isRead: false,
      setRead: (isRead) => set({ isRead }),
    }),
    {
      name: "notification-storage",
    }
  )
);
