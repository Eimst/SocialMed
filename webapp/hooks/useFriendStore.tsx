import {create} from 'zustand'
import {Friend, UserProfileInfo} from "@/types";


type State = {
    isOpen: boolean
    friends: Friend[]
    chattingWithFriend: UserProfileInfo | null
}

type Actions = {
    setOpen: (data: boolean) => void;
    setFriends: (friends: Friend[]) => void;
    addFriend: (friend: Friend) => void;
    removeFriend: (userId: string) => void;
    setChattingWithFriend: (friend: UserProfileInfo | null) => void;
}

const initialState: State = {
    isOpen: false,
    friends: [],
    chattingWithFriend: null,
}


export const useFriendStore = create<State & Actions>((set) => ({
    ...initialState,

    setOpen: (data) => set({isOpen: data}),

    setFriends: (friends) => set({friends: friends}),

    addFriend: (friend) => set((state) => {
        return {friends: [friend, ...state.friends]}
    }),

    removeFriend: (userId) => set((state) => ({
        friends: state.friends.filter((friend) => friend.userProfileInfo.profileId !== userId) ?? []
    })),

    setChattingWithFriend: (friend) => set({chattingWithFriend: friend}),

}))