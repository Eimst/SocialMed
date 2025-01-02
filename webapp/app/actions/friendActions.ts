import {fetchWrapper} from "@/app/lib/fetchWrapper";


export const getAllFriendsByUserId = (userId: string) => {
    return fetchWrapper.get(`/friends/${userId}`)
}

export const addFriend = (userId: string) => {
    return fetchWrapper.post(`/friends/request/${userId}`, {})
}

export const getFriendStatus = (userId: string) => {
    return fetchWrapper.get(`/friends/${userId}/status/`)
}

export const deleteFriendRequest = (userId: string) => {
    return fetchWrapper.del(`/friends/request/${userId}`)
}

export const deleteFriendStatus = (userId: string) => {
    return fetchWrapper.del(`/friends/${userId}`)
}

export const updateFriendStatus = (userId: string) => {
    return fetchWrapper.put('/friends/request/' + userId, {})
}