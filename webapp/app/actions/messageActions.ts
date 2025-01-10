import {fetchWrapper} from "@/app/lib/fetchWrapper";


export const getChatHistory = async (userId: string) => {
    return await fetchWrapper.get(`/messages/user/${userId}`)
}

export const postMessage = async (userId: string, message: string) => {
    return await fetchWrapper.post(`/messages/user/${userId}`, {message})
}

export const markMessagesAsRead = async (userId: string) => {
    return await fetchWrapper.put(`/messages/user/${userId}`, {})
}