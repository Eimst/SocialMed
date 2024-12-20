import { create } from 'zustand'
import {Comment} from "@/types";


type State = {
    commentsByPost: Record<string, Comment[]>;
}

type Actions = {
    setCommentsByPost: (postId: string, data: Comment[]) => void;
    addCommentByPost: (postId: string, data: Comment) => void;
    deleteCommentByPost: (postId: string, commentId: string) => void;
}

const initialState: State = {
    commentsByPost: {}
}


export const useCommentStore = create<State & Actions>((set) => ({
    ...initialState,

    setCommentsByPost: (postId, comments) => set((state) => ({
        commentsByPost: {
            ...state.commentsByPost,
            [postId]: comments, // Replace all comments for a specific post
        },
    })),

    addCommentByPost: (postId, comment) => set((state) => ({
        commentsByPost: {
            ...state.commentsByPost,
            [postId]: [comment, ...state.commentsByPost[postId]],
        },
    })),

    deleteCommentByPost: (postId, commentId) => set((state) => ({
        commentsByPost: {
            ...state.commentsByPost,
            [postId]: state.commentsByPost[postId].filter((comment) => comment.id !== commentId)
        },
    }))
}));