import { create } from 'zustand'
import {Post} from "@/types";


type State = {
    posts: Post[];
}

type Actions = {
    setPosts: (posts: Post[]) => void;
    addPost: (post: Post) => void;
    removePost: (id: string) => void;
}

const initialState: State = {
    posts: []
}

export const usePostStore = create<State & Actions>((set) => ({
    ...initialState,

    setPosts: (posts) => set({posts: posts}),

    addPost: (post) => set((state) => ({
        posts: [post, ...state.posts],
    })),

    removePost: (id: string) => set((state) => ({
        posts: state.posts.filter((post) => post.id !== id),
    })),
}))