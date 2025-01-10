import React from 'react';
import {UserProfileInfo} from "@/types";
import MessageIconWithCount from "@/app/friends/MessageIconWithCount";
import User from "@/app/components/User";

type Props = {
    user: UserProfileInfo
    showMessageIcon?: boolean
    setChattingWithFriend?: (chattingWithFriend: UserProfileInfo) => void;
}

function Friend({user, showMessageIcon = true, setChattingWithFriend}: Props) {

    const handleMessageClick = () => {
        if (setChattingWithFriend) {
            setChattingWithFriend(user)
        }
    }

    return (
        <div className={`flex gap-5 items-center px-3 py-5 shadow-sm`}>
            <User user={user}/>
            {
                showMessageIcon && (
                    <div className={`ml-auto cursor-pointer`} onClick={handleMessageClick}>
                        <MessageIconWithCount/>
                    </div>
                )
            }

        </div>
    );
}

export default Friend;