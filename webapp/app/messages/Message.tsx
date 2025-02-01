import React from 'react';
import {MessageType} from "@/types";
import {useUserStore} from "@/hooks/useUserStore";
import {getDynamicTime} from "@/app/lib/dateNormalizer";
import {CiUnread} from "react-icons/ci";

type Props = {
    message: MessageType
}

function Message({message}: Props) {
    const user = useUserStore(state => state.user)

    const time = getDynamicTime(message.dateCreated);

    return (
        user && (
            user?.profileId === message.sender.profileId ? (
                <div className={`my-2`}>
                    <div className={`py-2 px-3 text-end bg-blue-100 rounded-lg max-w-[75%] w-fit ml-auto`}>
                        <p className={`text-justify break-words`}>{message.message}</p>
                    </div>
                    <div className={`flex text-xs w-fit ml-auto px-1 pt-1 pb-2 gap-1`}>
                        {time} {!message.isRead && <CiUnread size={17} color={'blue'}/>}

                    </div>
                </div>
            ) : (
                <div className={`my-2`}>
                    <div className={`py-2 px-3 text-end bg-gray-100 rounded-lg max-w-[75%] w-fit`}>
                        <p className={`text-justify break-words`}>{message.message}</p>
                    </div>
                    <div className={`text-xs w-fit px-1 pt-1 pb-2 gap-1`}>
                        {time}
                    </div>
                </div>
            )
        )
    )
}

export default Message;