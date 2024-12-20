'use client'

import {fetchWrapper} from "@/app/lib/fetchWrapper";
import {Post} from "@/types";


type Props = {
    content: string
    imageUrl: string | null
    userId: string
}

export const getAllPosts : () => Promise<Post[]> = async () => {
    return await fetchWrapper.get('/posts')
}

export const createPost = async (body: Props) => {
    return await fetchWrapper.post('/posts', body)
}

export const getPostsByUserId = async (userId: string) => {
    return await fetchWrapper.get(`/posts/user/${userId}`)
}

export const deletePost = async (id: string) => {
    return await fetchWrapper.del(`/posts/${id}`)
}