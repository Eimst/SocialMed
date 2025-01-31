import {fetchWrapper} from "@/app/lib/fetchWrapper";

export const postLike = async (postId: string) => {
    return await fetchWrapper.post(`/posts/${postId}/likes`, {})
}

export const deleteLike = async (postId: string, likeId: string) => {
    return await fetchWrapper.del(`/posts/${postId}/likes/${likeId}`)
}