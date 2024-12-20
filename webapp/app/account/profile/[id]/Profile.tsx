'use client'

import React from 'react';
import PostCard from "@/app/posts/PostCard";
import ProfileImages from "@/app/account/profile/[id]/ProfileImages";
import {usePostStore} from "@/hooks/usePostStore";
import {useShallow} from "zustand/react/shallow";
import {useLoadingStore} from "@/hooks/useLoadingStore";


type Props = {
    id: string;
}

function Profile({id}: Props) {
    const posts = usePostStore(useShallow((state) =>
        state.posts.filter((post) => post.userId === id))
    );

    const isLoading = useLoadingStore(state => state.isLoading);

    if (isLoading) {
        return <div className={`-mt-40`}>Loading...</div>;
    }

    return (

        <div className={` w-[100%] flex gap-10 h-screen justify-center -mt-40 bg-gray-50`}>
            <div className={`w-[55%] h-screen overflow-y-auto scrollbar-hide`}>

                <ProfileImages/>

                <div className={`flex w-[73%] ml-auto pt-7`}>
                        <span className={`flex justify-start text-black text-2xl font-semibold`}>
                            Vardas Pavarde
                        </span>
                </div>
                <div className={`w-1/2 mt-24 mb-10`}>
                        <span className={`font-semibold text-black text-lg`}>
                            Bio:
                        </span>
                    <span className={`flex w-[100%]  justify-end text-black text-justify`}>
                            Browse through the icons below to find the one you need. The search field supports synonyms—for example,
                            try searching for "hamburger" or "logout."
                        </span>
                </div>

                <div
                    className={`flex  ${posts.length > 0 && 'bg-red-50 border-2 shadow-md border-gray-200'}
                    rounded-t-lg py-3 justify-center`}
                >
                    {
                        posts.length > 0 ? (
                            <span className={`text-black text-2xl font-semibold`}>
                                Posts
                            </span>
                        ) : (
                            <span className={`mt-24 text-black text-2xl font-semibold`}>
                                There are no posts
                            </span>
                        )
                    }


                </div>

                {
                    posts.length > 0 && (
                        <div className={`grid gap-10 pb-32`}>
                            {
                                posts.map(post => <PostCard key={post.id} post={post}/>)
                            }
                        </div>
                    )
                }

            </div>

        </div>

    );
}

export default Profile;