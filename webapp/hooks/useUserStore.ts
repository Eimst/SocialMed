'use client'

import { create } from 'zustand'
import {UserProfileInfo} from "@/types";


type State = {
    user: UserProfileInfo | null;
}

type Actions = {
    setUser: (data: UserProfileInfo | null) => void;
}

const initialState: State = {
    user: null
}


export const useUserStore = create<State & Actions>((set) => ({
    ...initialState,

    setUser: (data) => set({ user: data })
}))