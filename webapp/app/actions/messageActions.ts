import {fetchWrapper} from "@/app/lib/fetchWrapper";


export const getChatHistory = async (userId: string, date?: string ) => {
    const params = date ? `?cursor=${date}` : "";
    return await fetchWrapper.get(`/messages/user/${userId}${params}`);
}

export const postMessage = async (userId: string, message: string) => {
    return await fetchWrapper.post(`/messages/user/${userId}`, {message})
}

export const markMessagesAsRead = async (userId: string) => {
    return await fetchWrapper.put(`/messages/user/${userId}`, {})
}

export const getChatPreview = async (userId: string) => {
    return await fetchWrapper.get(`/messages/user/${userId}/preview`)
}

export const addUserToActiveChats = async (userId: string) => {
    return await fetchWrapper.post(`/messages/active-chats`, {userId: userId, isDelete: false})
}
