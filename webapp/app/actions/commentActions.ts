'use client'

import {fetchWrapper} from "@/app/lib/fetchWrapper";


type Props = {
    text: string
    userId: string
    postId: string
}

export const createComment  = async (postId: string, comment: Props ) => {
    return await fetchWrapper.post(`/posts/${postId}/comments`, comment)
}

export const deleteCommentById = async (postId: string, commentId: string) => {
    return await fetchWrapper.del('/posts/' + postId + '/comments/' + commentId)
}