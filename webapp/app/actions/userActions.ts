'use client'

import {fetchWrapper} from "@/app/lib/fetchWrapper";
import {FieldValues} from "react-hook-form";
import {useUserStore} from "@/hooks/useUserStore";
import toast from "react-hot-toast";


export const getUserInfo = async () => {
    const data = await fetchWrapper.get('/account/info');

    if (!data.error && !data.profileId) {
        useUserStore.getState().setUser(null);
        return null;
    } else if (!data.error) {
        useUserStore.getState().setUser(data);
    }

    return data;
}


export const register = async (data: FieldValues) => {
    return await fetchWrapper.post('/account/register', data,)
}

export const login = async (data: FieldValues) => {
    const res = await fetchWrapper.post('/account/login?useCookies=true', data)

    if (!res.error) {
        await getUserInfo()
    }
    return res
}

export const logout = async () => {
    const res = await fetchWrapper.post('/account/logout', {})

    if (res.error) {
        toast.error(res.error.message)
    } else {
        useUserStore.getState().setUser(null);
    }
}

export const getProfileInfo = async (userId: string) => {
    return await fetchWrapper.get('/account/user-info/' + userId);
}