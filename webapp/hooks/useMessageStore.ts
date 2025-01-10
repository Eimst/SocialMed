'use client'

import {create} from 'zustand'
import {MessageType} from "@/types";
import {markMessagesAsRead} from "@/app/actions/messageActions";


type State = {
    messagesByUserId: Record<string, MessageType[]>;
    openedMessagesByUserId: string | null;
}

type Actions = {
    setMessagesByUserId: (userId: string, messages: MessageType[]) => void;
    addMessageByUserId: (userId: string, message: MessageType) => void;
    setOpenedMessagesByUserId: (userId: string | null) => void;
    markAsRead: (userId: string) => void;
}

const initialState: State = {
    messagesByUserId: {},
    openedMessagesByUserId: null
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
            set(state =>  ({
                messagesByUserId: {
                    ...state.messagesByUserId,
                    [userId]: [message],
                },
            }))
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
                        (!msg.isRead && msg.receiver.profileId === userId)? { ...msg, isRead: true } : msg
                    ),
                }
            }))
        }
    }

}))