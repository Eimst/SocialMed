import React, {useEffect, useLayoutEffect, useRef} from 'react';
import {UserProfileInfo} from "@/types";
import {getChatHistory, markMessagesAsRead, postMessage} from "@/app/actions/messageActions";
import toast from "react-hot-toast";
import Message from "@/app/messages/Message";
import WriteMessage from "@/app/messages/WriteMessage";
import {useMessageStore} from "@/hooks/useMessageStore";
import {useShallow} from "zustand/react/shallow";


type Props = {
    friend: UserProfileInfo
}

function Messages({friend}: Props) {

    // const [messages, setMessages] = useState<MessageType[]>()
    const messages = useMessageStore(useShallow((state) => state.messagesByUserId[friend.profileId] || []));
    const addMessage = useMessageStore(state => state.addMessageByUserId)
    const setMessages = useMessageStore(state => state.setMessagesByUserId)
    const setOpenedMessagesByUserId = useMessageStore(state => state.setOpenedMessagesByUserId)

    const bottomRef = useRef<HTMLDivElement | null>(null);


    const sendMessage = async (message: string) => {
        const response = await postMessage(friend.profileId, message)
        if (response.error)
            toast(response.error)
        else {
            addMessage(friend.profileId, response)
        }
    }

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: "instant"});
    };

    useEffect(() => {
        const getMessages = async () => {
            const response = await getChatHistory(friend.profileId)

            if (response.error)
                toast.error(response.message)
            else {
                await markMessagesAsRead(friend.profileId)

                setOpenedMessagesByUserId(friend.profileId)
                setMessages(friend.profileId, response)
            }
        }
        getMessages()
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
                {messages.map((message) => (
                    <Message key={message.dateCreated} message={message} />
                ))}
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