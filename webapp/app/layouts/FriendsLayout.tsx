'use client';

import React, {useEffect, useRef, useState} from 'react';
import {useFriendStore} from '@/hooks/useFriendStore';
import {LiaUserFriendsSolid} from 'react-icons/lia';
import Friends from '@/app/friends/Friends';
import {useUserStore} from "@/hooks/useUserStore";
import {getAllFriendsByUserId} from "@/app/actions/friendActions";
import {useLoadingStore} from "@/hooks/useLoadingStore";
import UpdateNewsBoard from "@/app/components/UpdateNewsBoard";
import Image from "next/image";
import {useMessageStore} from "@/hooks/useMessageStore";
import {MessageType} from "@/types";
import {useShallow} from "zustand/react/shallow";


export default function FriendsLayout({children}: { children: React.ReactNode }) {
    const setFriends = useFriendStore((state) => state.setFriends);
    const isOpen = useFriendStore((state) => state.isOpen);
    const setOpen = useFriendStore((state) => state.setOpen);
    const user = useUserStore((state) => state.user);
    const isLoading = useLoadingStore(state => state.isLoading);
    const chattingWithFriend = useFriendStore((state) => state.chattingWithFriend);
    const messages = useMessageStore(
        useShallow((state) => chattingWithFriend ? state.messagesByUserId[chattingWithFriend.profileId] || [] : [])
    );
    const lastMessages = chattingWithFriend
        ? useMessageStore.getState().messagesByUserId[chattingWithFriend.profileId] || []
        : [];

    const [newMessage, setNewMessage] = useState<MessageType | undefined>(lastMessages[lastMessages.length - 1] ?? undefined);
    const newMessageRef = useRef<MessageType | undefined>(lastMessages[lastMessages.length - 1] ?? undefined);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const unreadMessagesCount = useMessageStore(useShallow(state => state.unreadMessagesByUserIdCount[chattingWithFriend?.profileId ?? ""] ?? 0))

    useEffect(() => {
        const getFriends = async (userId: string) => {
            try {
                const data = await getAllFriendsByUserId(userId)
                if (data.error)
                    throw data.error

                setFriends(data)
            } catch {
            }
        }

        if (user) {
            getFriends(user.profileId);
        }
    }, [setFriends, user]);

    useEffect(() => {
        const checkForNewMessage = () => {
            if (!chattingWithFriend || messages.length === 0)
                return;

            const lastMessage = messages[messages.length - 1];
            if (!newMessageRef.current || newMessageRef.current?.dateCreated !== lastMessage.dateCreated) {
                setNewMessage(lastMessage);
                newMessageRef.current = lastMessage;
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }

                timeoutRef.current = setTimeout(() => {
                    setNewMessage(undefined);
                }, 10000);
            } else {
                setNewMessage(undefined);
            }
        }
        checkForNewMessage();

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };

    }, [chattingWithFriend, messages]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="relative w-full h-full">

            {
                <div className="w-[20%] fixed top-[10%] lef-0 pl-5 text-justify z-49 justify-end">
                    <UpdateNewsBoard/>
                </div>
            }

            {children}

            {
                user && (isOpen ? (
                    <div className="w-[20%] fixed bottom-0 right-2 z-49 justify-end">
                        <Friends setShowFriends={setOpen}/>
                    </div>
                ) : (
                    <button
                        className={`bg-red-600 rounded-full fixed bottom-5 right-5 z-49 p-3`}
                        onClick={() => {
                            setOpen(true)
                        }}
                    >
                        <div className="w-[45px] h-[45px] flex items-center justify-center">
                            {chattingWithFriend ? (
                                <>
                                    {(newMessage && newMessage.receiver.profileId === user.profileId) && (
                                        <div
                                            className="absolute left-0 -translate-x-1/2 w-max max-w-[150px] px-3 py-1 text-xs text-black bg-gray-200 rounded-lg shadow-md z-40"
                                            style={{top: `-${Math.min(20 + newMessage.message.length / 2, 80)}px`}}
                                        >
                                            <span>
                                                {newMessage.message.length > 90 ? `${newMessage.message.slice(0, 90)}...` : newMessage.message}
                                            </span>
                                        </div>
                                    )}
                                    <div className={`absolute w-full h-full`}>
                                        <Image
                                            src={chattingWithFriend.profilePictureUrl}
                                            alt="profilePicture"
                                            fill
                                            priority
                                            className="object-cover rounded-full"
                                            sizes="(max-width: 16px) 100vw, (max-width: 16px) 50vw, 25vw"

                                        />
                                    </div>

                                    <div className={`absolute -top-1 -right-1 bg-red-600 text-white px-1.5 rounded-full`}>
                                        {unreadMessagesCount > 0 && (unreadMessagesCount)}
                                    </div>
                                    <div className={`absolute -bottom-3 bg-gray-200 py-1 px-2 shadow rounded-full text-xs font-semibold text-black`}>
                                        {chattingWithFriend.firstName}
                                    </div>

                                </>
                            ) : (
                                <LiaUserFriendsSolid color="white" size={45}/>
                            )}
                        </div>

                    </button>

                ))
            }

        </div>
    );
}
