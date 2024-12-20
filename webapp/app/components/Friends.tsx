import React from 'react';
import {LiaUserFriendsSolid} from "react-icons/lia";
import Friend from "@/app/components/Friend";
import {Post} from "@/types";

type Props = {
    posts?: Post[]
    setShowFriends: any
}

function Friends({posts, setShowFriends}: Props) {
    return (
        <div className={`border-2 border-gray-50 shadow-md sticky h-[75vh] flex flex-col rounded-lg`}
        >
            <div className={`overflow-y-auto flex-grow rounded-lg scrollbar-hide`}>
                <div className="flex justify-center p-5 shadow-md bg-red-600 sticky top-0 z-50">
                    <h1 className="flex items-center text-3xl text-white gap-2">
                        Friends
                        <span className="flex items-center">
                    <LiaUserFriendsSolid color="white" className="relative top-[3px]"/>
                </span>
                    </h1>
                </div>
                {posts && posts.map((post) => (
                    <Friend key={post.id} user={post.userProfile}/>
                ))}
            </div>

            {/* Sticky Footer */}
            <div className={`bg-red-600 p-2 text-center text-white cursor-pointer`} onClick={() => setShowFriends(false)}>
                Hide
            </div>
        </div>
    );
}

export default Friends;