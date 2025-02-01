import React, {useEffect} from 'react';
import {UserProfileInfo} from "@/types";
import MessageIconWithCount from "@/app/friends/MessageIconWithCount";
import User from "@/app/components/User";
import {useMessageStore} from "@/hooks/useMessageStore";
import {getChatPreview} from "@/app/actions/messageActions";
import toast from "react-hot-toast";
import {useShallow} from "zustand/react/shallow";
import {CiUnread} from "react-icons/ci";

type Props = {
    user: UserProfileInfo
    showMessageIcon?: boolean
    setChattingWithFriend?: (chattingWithFriend: UserProfileInfo) => void;
}

function Friend({user, showMessageIcon = true, setChattingWithFriend}: Props) {
    const addMessageByUserId = useMessageStore(state => state.addMessageByUserId)
    const messageByUserId = useMessageStore(useShallow(state => state.messagesByUserId[user.profileId] || []))
    const unreadMessagesCount = useMessageStore(useShallow(state => state.unreadMessagesByUserIdCount[user.profileId]))
    const setUnreadMessagesCount = useMessageStore(state => state.setUnreadMessagesByUserIdCount);


    const handleMessageClick = () => {
        if (setChattingWithFriend) {
            setChattingWithFriend(user)
        }
    }

    useEffect(() => {
        const getPreview = async () => {
            const resp = await getChatPreview(user.profileId)

            if (resp.error)
                toast.error(resp.error.message)
            else if(resp){
                addMessageByUserId(user.profileId, resp.message)
                setUnreadMessagesCount(user.profileId, resp.unreadMessagesCount)
            }
        }
        getPreview()
    }, [user.profileId])

    if (!messageByUserId)
        return null

    return (
        <div className={`px-3 pt-5 shadow-sm pb-3`}>
            <div className={`flex gap-5 items-center`}>
                <User user={user}/>
                {
                    showMessageIcon && (
                        <div className={`ml-auto cursor-pointer`} onClick={handleMessageClick}>
                            <MessageIconWithCount count={unreadMessagesCount}/>
                        </div>
                    )

                }

            </div>
            {
                (showMessageIcon && messageByUserId[0]) && (
                    <div className={`flex items-center justify-between`}>
                        <div
                            className={`text-justify py-2 px-3 mt-2 rounded-lg max-w-[75%] w-fit break-words
                        ${messageByUserId[0].sender.profileId === user.profileId ? " bg-gray-100" : "bg-blue-100"}
                        ${messageByUserId[0].sender.profileId === user.profileId && messageByUserId[0].isRead && "text-gray-500"}`}
                        >
                            {messageByUserId[0].message.length > 55 ? messageByUserId[0].message.slice(0, 55) + "..." : messageByUserId[0].message}
                        </div>
                        <div className={`flex items-center justify-center ml-2`}>
                            {(messageByUserId[0].sender.profileId === user.profileId && !messageByUserId[0].isRead) && (<CiUnread size={25} color={`blue`}/>)}
                        </div>
                    </div>

                )
            }
        </div>

    );
}

export default Friend;