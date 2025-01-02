import { create } from 'zustand'
import {Friend} from "@/types";


type State = {
    isOpen: boolean
    friends: Friend[]
}

type Actions = {
    setOpen: (data: boolean) => void;
    setFriends: (friends: Friend[]) => void;
    addFriend: (friend: Friend) => void;
    removeFriend: (userId: string) => void;

}

const initialState: State = {
    isOpen: false,
    friends: []
}


export const useFriendStore = create<State & Actions>((set) => ({
    ...initialState,

    setOpen: (data) => set({ isOpen: data }),

    setFriends: (friends) => set({friends: friends}),

    addFriend: (friend) => set((state) => {
        return {friends: [friend, ...state.friends]}
    }),

    removeFriend: (userId) => set((state) => ({
        friends: state.friends.filter((friend) => friend.userProfileInfo.profileId !== userId) ?? []
    }))

}))