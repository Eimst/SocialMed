'use client'

import {fetchWrapper} from "@/app/lib/fetchWrapper";

export const getAllNotifications = async () => {
    return await fetchWrapper.get('/notifications')
}

export const removeNotification = async (id: string) => {
    return await fetchWrapper.del(`/notifications/${id}`)
}