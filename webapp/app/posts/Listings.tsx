'use client'

import React from 'react';
import PostCard from "@/app/posts/PostCard";
import AddPost from "@/app/posts/AddPost";
import {usePostStore} from "@/hooks/usePostStore";


function Listings() {
    const posts = usePostStore(state => state.posts);

    return (
        <div className={`w-[100%] flex gap-10 h-screen justify-center scrollbar-hide bg-gray-50`}>
            <div className={`w-[55%] overflow-y-auto scrollbar-hide `}>
                <div
                    className={` items-center pt-10 pb-16 `}>
                    <AddPost/>

                </div>
                <div
                    className={`flex border-2 border-gray-200 bg-red-50 
                    rounded-t-lg py-3 shadow-md justify-center`}
                >
                    <span className={`text-black text-2xl font-semibold`}>
                        Posts
                    </span>

                </div>

                <div className={`grid gap-10 pb-32`}>
                    {
                        posts.map(post => <PostCard key={post.id} post={post}/>)
                    }
                </div>

            </div>

        </div>
    );

}

export default Listings;