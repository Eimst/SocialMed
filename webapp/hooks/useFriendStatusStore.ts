import { create } from 'zustand'
import {FriendStatusType} from "@/types";

type State = {
    statusByUser: Record<string, FriendStatusType>;
}

type Actions = {
    setStatusByUser: (userId: string, status: FriendStatusType) => void;
}

const initialState: State = {
    statusByUser: {}
}

export const useFriendStatusStore = create<State & Actions>((set) => ({
    ...initialState,

    setStatusByUser: (userId, status) => set(({
        statusByUser: {
            [userId]: status,
        },
    })),
}))