'use client'

import React from 'react';
import {LiaUserFriendsSolid} from "react-icons/lia";
import Friend from "@/app/friends/Friend";
import {useFriendStore} from "@/hooks/useFriendStore";
import {IoCaretBack} from "react-icons/io5";
import {useMessageStore} from "@/hooks/useMessageStore";
import ScrollableChat from "@/app/messages/ScrollableChat";

type Props = {
    setShowFriends: (showFriends: boolean) => void;
}

function Friends({setShowFriends}: Props) {
    const friends = useFriendStore((state) => state.friends);
    const setChattingWithFriend = useFriendStore(state => state.setChattingWithFriend);
    const chattingWithFriend = useFriendStore(state => state.chattingWithFriend);
    const setOpenedMessagesByUserId = useMessageStore(state => state.setOpenedMessagesByUserId)

    return (
        <div className={`border-2 border-gray-50 shadow-md h-[75vh] flex flex-col rounded-lg`}>
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-red-600 shadow-md rounded-t-md -mx-0.5">
                <div className="flex justify-center p-5">
                    {
                        chattingWithFriend ? (
                            <h1 className={`flex items-center text-3xl text-white cursor-pointer`}
                                onClick={() => {
                                    setChattingWithFriend(null)
                                    setOpenedMessagesByUserId(null)
                                }}
                            >
                                <span className="flex items-center">
                                    <IoCaretBack color="white" className="relative top-[1px]"/>
                                </span>
                                Back
                            </h1>
                        ) : (
                            <h1 className="flex items-center text-3xl text-white gap-2">
                                Friends
                                <span className="flex items-center">
                                    <LiaUserFriendsSolid color="white" className="relative top-[3px]"/>
                                </span>
                            </h1>
                        )
                    }
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow overflow-y-auto scrollbar-hide">
                {chattingWithFriend ? (
                    <ScrollableChat chattingWithFriend={chattingWithFriend}/>
                ) : (
                    friends.length > 0 ? friends.map((friend) => (
                        <Friend key={friend.userProfileInfo.profileId} user={friend.userProfileInfo}
                                setChattingWithFriend={setChattingWithFriend}/>
                    )) : (
                        <div className="flex font-semibold text-md justify-center h-1/5 items-center">
                            You have no friends
                        </div>
                    )
                )}
            </div>

            {/* Sticky Footer */}
            <div className={`bg-red-600 p-2 text-center text-white cursor-pointer`}
                 onClick={() => setShowFriends(false)}>
                Hide
            </div>
        </div>
    );
}


export default Friends;