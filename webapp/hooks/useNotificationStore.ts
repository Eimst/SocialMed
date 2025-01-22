import { create } from 'zustand'
import {NotificationType} from "@/types";


type State = {
    notifications: NotificationType[];
}

type Actions = {
    setNotifications: (notifications: NotificationType[]) => void;
    addNotification: (notifications: NotificationType) => void;
    removeNotification: (id: string) => void;
}

const initialState: State = {
    notifications: []
}

export const useNotificationStore = create<State & Actions>((set) => ({
    ...initialState,

    setNotifications: (notifications) => set({notifications: notifications}),

    addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
    })),

    removeNotification: (id: string) => set((state) => ({
        notifications: state.notifications.filter((notification) => notification.id !== id),
    })),
}))