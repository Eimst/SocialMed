'use client'

import React from 'react';
import {LiaUserFriendsSolid} from "react-icons/lia";
import Friend from "@/app/friends/Friend";
import {useFriendStore} from "@/hooks/useFriendStore";

type Props = {
    setShowFriends: any
}

function Friends({setShowFriends}: Props) {

    const friends = useFriendStore((state) => state.friends);

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
                {friends.length > 0 ? friends.map((friend) => (
                    <Friend key={friend.userProfileInfo.profileId} user={friend.userProfileInfo}/>
                )) : (<div className={`flex font-semibold text-md justify-center h-1/5 items-center`}>You have no friends</div>)
                }
            </div>

            {/* Sticky Footer */}
            <div className={`bg-red-600 p-2 text-center text-white cursor-pointer`} onClick={() => setShowFriends(false)}>
                Hide
            </div>
        </div>
    );
}

export default Friends;