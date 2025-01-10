'use client'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;


const getHeaders : (method: string, body: object) => RequestInit = (method: string, body: object) => {
    const headers: RequestInit = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    };

    if (method !== 'GET' && body) {
        headers.body = JSON.stringify(body);
    }

    return headers;
}


const get = async (url: string, body?: object) => {
    let fullUrl = baseUrl + url;
    if (body) {
        const queryString = objectToQueryString(body);
        fullUrl = queryString ? `${fullUrl}?${queryString}` : fullUrl;
    }

    const requestOptions = getHeaders("GET", {})
    const response = await fetch(fullUrl, requestOptions);
    return handleResponse(response);
}

const objectToQueryString = (params: object): string => {
    return Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");
};

const post = async (url: string, body: object) => {

    const requestOptions= getHeaders("POST", body)

    const response = await fetch(baseUrl + url, requestOptions);
    return handleResponse(response);
}

const put = async (url: string, body: object) => {

    const requestOptions = getHeaders("PUT", body)

    const response = await fetch(baseUrl + url, requestOptions);
    return handleResponse(response);
}

const del = async (url: string,) => {

    const requestOptions = getHeaders("DELETE", {})

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
        return {error};
    }
}


export const fetchWrapper = {
    get,
    post,
    del,
    put
}