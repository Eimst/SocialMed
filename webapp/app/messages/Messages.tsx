import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
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
    isAtBottom: boolean
    isAtTop: boolean
}

function Messages({friend, isAtBottom, isAtTop}: Props) {

    const messages = useMessageStore(useShallow((state) => state.messagesByUserId[friend.profileId] || []));
    const setMessages = useMessageStore(state => state.setMessagesByUserId)
    const setOpenedMessagesByUserId = useMessageStore(state => state.setOpenedMessagesByUserId)
    const addMessagesToBackByUserId = useMessageStore(state => state.addMessagesToBackByUserId)
    const [totalMessagesCount, setTotalMessagesCount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [firstLoad, setFirstLoad] = useState<boolean>(true);

    const bottomRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const checkpointRef = useRef<HTMLDivElement | null>(null);
    const lastSeenMessageRef = useRef<string | null>(null);

    const sendMessage = async (message: string) => {
        const response = await postMessage(friend.profileId, message)
        if (response.error)
            toast.error(response.error.message)
    }

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "instant"});
    };

    const scrollToCheckpoint = () => {
        checkpointRef.current?.scrollIntoView({ behavior: "instant"});
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
                toast.error(response.error.message)
            else {
                await markMessagesAsRead(friend.profileId)

                setOpenedMessagesByUserId(friend.profileId)
                if (response) {
                    setMessages(friend.profileId, response.messages)
                    setTimeout(() => setFirstLoad(false), 1);
                }
                setTotalMessagesCount(response.totalMessagesCount)
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

    useEffect(() => {
        if (messages.length < 10 || messages.length >= totalMessagesCount || loading || !isAtTop)
            return;

        const fetchMoreMessages = async () => {
            setLoading(true);
            lastSeenMessageRef.current = messages[0]?.dateCreated;

            const response = await getChatHistory(friend.profileId, messages[0]?.dateCreated);

            if (response.error) {
                toast.error(response.error.message);
            } else if (response.messages.length > 0) {
                addMessagesToBackByUserId(friend.profileId, response.messages);
                setTimeout(() => scrollToCheckpoint(), 1);
            }
            setTimeout(() => setLoading(false), 50);
        };

        fetchMoreMessages()
    }, [isAtTop]);

    useLayoutEffect(() => {
        if (messages.length <= 10) {
            scrollToBottom();
        } else if (isAtBottom) {
            scrollToBottom();
        }
    }, [messages]);

    if (firstLoad) {
        return null
    }

    return (
        <div className="flex flex-col h-full px-2">
            <div className="flex-grow">
                {messages.length >= 10 && <div ref={observerRef} className="bg-red-400" />}
                {(messages.length > 0  && messages[0]) && (messages.map((message) => (
                    <div key={message.dateCreated}>
                        <Message message={message} />
                        {message.dateCreated === lastSeenMessageRef.current && <div ref={checkpointRef} className=" bg-blue-400" />}
                    </div>
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