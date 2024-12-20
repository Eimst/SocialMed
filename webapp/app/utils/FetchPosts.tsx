'use client'

import React, {useEffect} from 'react';
import {getAllPosts} from "@/app/actions/postActions";
import {usePostStore} from "@/hooks/usePostStore";
import toast from "react-hot-toast";
import {useLoadingStore} from "@/hooks/useLoadingStore";

function FetchPosts() {
    const setPosts = usePostStore(state => state.setPosts);
    const setLoading = useLoadingStore(state => state.setLoading);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getAllPosts();
                setPosts(data);

            } catch (error: any) {
                toast.error(error.message);

            } finally {
                setLoading(false);
            }
        };
        fetchPosts()
    }, [setPosts]);

    return (
        <></>
    );
}

export default FetchPosts;