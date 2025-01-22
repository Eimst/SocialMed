import React, {useCallback, useEffect, useLayoutEffect, useRef} from 'react';
import {UserProfileInfo} from "@/types";
import {
    addUserToActiveChats,
    getChatHistory,
    markMessagesAsRead,
    postMessage
} from "@/app/actions/messageActions";
import toast from "react-hot-toast";
import Message from "@/app/messages/Message";
import WriteMessage from "@/app/messages/WriteMessage";
import {useMessageStore} from "@/hooks/useMessageStore";
import {useShallow} from "zustand/react/shallow";


type Props = {
    friend: UserProfileInfo
}

function Messages({friend}: Props) {

    const messages = useMessageStore(useShallow((state) => state.messagesByUserId[friend.profileId] || []));
    const setMessages = useMessageStore(state => state.setMessagesByUserId)
    const setOpenedMessagesByUserId = useMessageStore(state => state.setOpenedMessagesByUserId)

    const bottomRef = useRef<HTMLDivElement | null>(null);

    const sendMessage = async (message: string) => {
        const response = await postMessage(friend.profileId, message)
        if (response.error)
            toast.error(response.error.message)
    }

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "instant"});
    };

    const removeActiveChats = useCallback(() => {
        const payload = new Blob(
            [JSON.stringify({ userId: friend.profileId, isDelete: true })],
            { type: "application/json" }
        );
        navigator.sendBeacon(`${process.env.NEXT_PUBLIC_BASE_URL}/messages/active-chats`, payload);
    }, [friend.profileId]);

    useEffect(() => {
        const getMessages = async () => {
            const response = await getChatHistory(friend.profileId)

            if (response.error)
                toast.error(response.message)
            else {
                await markMessagesAsRead(friend.profileId)

                setOpenedMessagesByUserId(friend.profileId)
                if (response)
                    setMessages(friend.profileId, response)
                await addActiveChats()
            }
        }
        const addActiveChats = async () => {
            const res = await addUserToActiveChats(friend.profileId)
            if (res.error)
                toast.error(res.error.message)
        }

        getMessages()

        window.addEventListener("unload", removeActiveChats);

        return () => {
            removeActiveChats();
            window.removeEventListener("unload", removeActiveChats);
        };
    }, [friend.profileId, setMessages, setOpenedMessagesByUserId])

    useLayoutEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!messages) {
        return null
    }

    return (
        <div className="flex flex-col h-full px-2">
            <div className="flex-grow">
                {(messages.length > 0  && messages[0]) && (messages.map((message) => (
                    <Message key={message.dateCreated} message={message} />
                )))}
                {/* Dummy div to scroll into */}
                <div ref={bottomRef} />
            </div>
            <div className="sticky bottom-0 z-30 bg-white">
                <WriteMessage sendMessage={sendMessage} />
            </div>
        </div>
    );
}

export default Messages;