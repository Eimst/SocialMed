'use client'

import {create} from 'zustand'
import {MessageType} from "@/types";
import {markMessagesAsRead} from "@/app/actions/messageActions";


type State = {
    messagesByUserId: Record<string, MessageType[]>;
    openedMessagesByUserId: string | null;
    unreadMessagesByUserIdCount: Record<string, number>;
    activeChats: string[];
}

type Actions = {
    setMessagesByUserId: (userId: string, messages: MessageType[]) => void;
    addMessageByUserId: (userId: string, message: MessageType) => void;
    setOpenedMessagesByUserId: (userId: string | null) => void;
    markAsRead: (userId: string) => void;
    addUnreadMessagesByUserIdCount: (userId: string) => void;
    setUnreadMessagesByUserIdCount: (userId: string, count: number) => void;
    setActiveChats: (activeChats: string[]) => void;
    markPreviewAsRead: (userId: string) => void;
}

const initialState: State = {
    messagesByUserId: {},
    openedMessagesByUserId: null,
    unreadMessagesByUserIdCount: {},
    activeChats: []
}


export const useMessageStore = create<State & Actions>((set, get) => ({
    ...initialState,

    setMessagesByUserId: (userId, data) => set(state => ({
        messagesByUserId: {
            ...state.messagesByUserId,
            [userId]: data
        }
    })),

    addMessageByUserId: (userId, message) => {
        const {openedMessagesByUserId} = get();

        if (openedMessagesByUserId === userId) {
            markMessagesAsRead(userId).then();
            set(state => ({
                messagesByUserId: {
                    ...state.messagesByUserId,
                    [userId]: [...(Array.isArray(state.messagesByUserId[userId]) ? state.messagesByUserId[userId] : []), message],
                },
            }));
        } else {
            set(state => ({
                messagesByUserId: {
                    ...state.messagesByUserId,
                    [userId]: [message],
                },
            }))
            if (!get().activeChats.includes(userId))
                get().addUnreadMessagesByUserIdCount(userId)
            else
                get().markPreviewAsRead(userId)
        }
    },

    setOpenedMessagesByUserId: (userId: string | null) => set(() => ({
        openedMessagesByUserId: userId
    })),

    markAsRead(userId: string) {
        const {openedMessagesByUserId} = get();

        if (openedMessagesByUserId === userId) {
            set(state => ({
                messagesByUserId: {
                    ...state.messagesByUserId,
                    [userId]: state.messagesByUserId[userId]?.map(msg =>
                        (!msg.isRead && msg.receiver.profileId === userId) ? {...msg, isRead: true} : msg
                    ),
                }
            }))
        }
    },

    markPreviewAsRead(userId: string) {
        const {openedMessagesByUserId} = get();
        if (openedMessagesByUserId !== userId) {
            set(state => ({
                messagesByUserId: {
                    ...state.messagesByUserId,
                    [userId]: state.messagesByUserId[userId]?.map(msg => ({
                        ...msg,
                        isRead: true
                    }))
                }
            }));
        }
    },

    addUnreadMessagesByUserIdCount: (userId) => set((state) => ({
        unreadMessagesByUserIdCount: {
            ...state.unreadMessagesByUserIdCount,
            [userId]: (state.unreadMessagesByUserIdCount[userId] || 0) + 1
        },
    })),

    setUnreadMessagesByUserIdCount: (userId, count) => set((state) => ({
        unreadMessagesByUserIdCount: {
            ...state.unreadMessagesByUserIdCount,
            [userId]: count,
        },
    })),

    setActiveChats: (activeChats: string[]) => set(({activeChats: activeChats}))

}))