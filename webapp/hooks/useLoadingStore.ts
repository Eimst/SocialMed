'use client'

import { create } from 'zustand'


type State = {
    isLoading: boolean
}

type Actions = {
    setLoading: (data: boolean) => void;
}

const initialState: State = {
    isLoading: true
}


export const useLoadingStore = create<State & Actions>((set) => ({
    ...initialState,

    setLoading: (data) => set({ isLoading: data })
}))