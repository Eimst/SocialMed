import { create } from 'zustand'


type State = {
    isOpen: boolean
}

type Actions = {
    setOpen: (data: boolean) => void;
}

const initialState: State = {
    isOpen: false
}


export const useFriendStore = create<State & Actions>((set) => ({
    ...initialState,

    setOpen: (data) => set({ isOpen: data })
}))