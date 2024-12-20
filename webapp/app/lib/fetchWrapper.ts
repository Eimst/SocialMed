'use client'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:7001/api';

const get = async (url: string) => {
    const requestOptions: RequestInit = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    };

    const response = await fetch(baseUrl + url, requestOptions);
    return handleResponse(response);
}

const post = async (url: string, body: object) => {

    const requestOptions: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body)
    };

    const response = await fetch(baseUrl + url, requestOptions);
    return handleResponse(response);
}

const del = async (url: string,) => {

    const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    };

    const response = await fetch(baseUrl + url, requestOptions);
    return handleResponse(response);
}

async function handleResponse(response: Response) {
    const text = await response.text();
    let data;
    try {
        data = text && JSON.parse(text);
    }
    catch {
        data = text;
    }

    if (response.ok) {
        return data || response.status;
    } else {
        const error = {
            status: response.status,
            message: typeof data === 'string' ? data : response.statusText,
        }
        console.log(error);
        return {error};
    }
}


export const fetchWrapper = {
    get,
    post,
    del
}