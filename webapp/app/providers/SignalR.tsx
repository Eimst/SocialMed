'use client'

import {ReactNode, useCallback, useEffect, useRef} from 'react';
import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import {usePostStore} from "@/hooks/usePostStore";
import {Comment, Friend, MessageType, NotificationType, Post} from "@/types";
import {useCommentStore} from "@/hooks/useCommentStore";
import {useMessageStore} from "@/hooks/useMessageStore";
import {useUserStore} from "@/hooks/useUserStore";
import {useNotificationStore} from "@/hooks/useNotificationStore";
import {useFriendStore} from "@/hooks/useFriendStore";
import {useFriendStatusStore} from "@/hooks/useFriendStatusStore";

type Props = {
    children: ReactNode
    notifyUrl: string
}

function SignalR({children, notifyUrl}: Props) {
    const connection = useRef<HubConnection | null>(null);
    const addPost = usePostStore(state => state.addPost);
    const deletePost = usePostStore(state => state.removePost);
    const addComment = useCommentStore(state => state.addCommentByPost);
    const deleteComment = useCommentStore(state => state.deleteCommentByPost);
    const addMessage = useMessageStore(state => state.addMessageByUserId);
    const markAsRead = useMessageStore(state => state.markAsRead);
    const user = useUserStore(state => state.user);
    const addNotification = useNotificationStore(state => state.addNotification);
    const removeNotification = useNotificationStore(state => state.removeNotification);
    const addFriend = useFriendStore(state => state.addFriend);
    const removeFriend = useFriendStore(state => state.removeFriend);
    const setStatus = useFriendStatusStore(state => state.setStatusByUser)
    const setChattingWithFriend = useFriendStore(state => state.setChattingWithFriend);
    const setActiveChats = useMessageStore(state => state.setActiveChats)
    const setUnreadMessagesByUserIdCount = useMessageStore(state => state.setUnreadMessagesByUserIdCount)
    const markPreviewAsRead = useMessageStore(state => state.markPreviewAsRead)

    const handlePostCreated = useCallback((post: Post) => {
        addPost(post);
    }, [addPost]);

    const handlePostDeleted = useCallback((postId: string) => {
        deletePost(postId);
    }, [deletePost]);

    const handleCommentCreated = useCallback((comment: Comment) => {
        addComment(comment.postId, comment);
    }, [addComment]);

    const handleCommentDeleted = useCallback((commentId: string, postId: string) => {
        deleteComment(postId, commentId);
    }, [deleteComment]);

    const handleMessageCreated = useCallback((message: MessageType) => {
        const currentUser = useUserStore.getState().user;
        if (currentUser && message.sender.profileId === currentUser.profileId)
            addMessage(message.receiver.profileId, message)
        else
            addMessage(message.sender.profileId, message)
    }, [addMessage]);

    const handleMarkAsRead = useCallback((userId: string) => {
        markAsRead(userId);
    }, [markAsRead]);

    const handleAddNotification = useCallback((notification: NotificationType | string) => {
        if (typeof notification === "string") {
            setStatus(notification, "WaitingForConfirmation")
        } else {
            setStatus(notification.initiator.profileId, "NeedToConfirm")
            addNotification(notification);
        }
    }, [addNotification, setStatus]);

    const handleRemoveNotification = useCallback((id: string) => {
        removeNotification(id);
    }, [removeNotification]);

    const handleNewFriend = useCallback((friend: Friend) => {
        setStatus(friend.userProfileInfo.profileId, "Friend")
        addFriend(friend);
    }, [addFriend, setStatus]);

    const handleRemoveFriend = useCallback((id: string) => {
        setStatus(id, "")
        removeFriend(id);
        if(useFriendStore.getState().chattingWithFriend?.profileId === id){
            setChattingWithFriend(null)
        }
    }, [removeFriend, setStatus]);

    const handleRemoveFriendRequest = useCallback((id: string) => {
        setStatus(id, "")
        const notif = useNotificationStore.getState().notifications.find(x => x.initiator.profileId === id);
        if (notif)
            removeNotification(notif.id)
    }, [removeNotification, setStatus]);

    const handleActiveChatsChanged = useCallback((userIds: string[]) => {
        setActiveChats(userIds)
        userIds.map(id => {
            setUnreadMessagesByUserIdCount(id, 0)
            markPreviewAsRead(id)
        })
    }, [markPreviewAsRead, setActiveChats, setUnreadMessagesByUserIdCount]);

    useEffect(() => {

        const initializeConnection = async () => {

            if (connection.current?.state === "Connected" || connection.current?.state === "Connecting" || connection.current?.state === "Reconnecting") {
                return;
            }

            connection.current = new HubConnectionBuilder()
                .withUrl(notifyUrl)
                .withAutomaticReconnect()
                .configureLogging(LogLevel.None)
                .build();

            connection.current.on('NewPostCreated', handlePostCreated);
            connection.current.on('PostDeleted', handlePostDeleted);
            connection.current.on('NewCommentCreated', handleCommentCreated);
            connection.current.on('CommentDeleted', handleCommentDeleted);
            connection.current.on('MessageCreated', handleMessageCreated);
            connection.current.on('MessageRead', handleMarkAsRead);
            connection.current.on('FriendRequestReceived', handleAddNotification);
            connection.current.on('NotificationDeleted', handleRemoveNotification);
            connection.current.on('FriendRequestAccepted', handleNewFriend);
            connection.current.on('FriendDeleted', handleRemoveFriend);
            connection.current.on('FriendRequestDeleted', handleRemoveFriendRequest);
            connection.current.on('ActiveChatsChanged', handleActiveChatsChanged);

            try {
                await connection.current.start();
            } catch (error) {
                console.error('Error starting SignalR connection:', error);
            }
        }

        initializeConnection();

        return () => {
            const cleanUp = async () => {
                if (connection.current) {
                    connection.current.off('NewPostCreated', handlePostCreated);
                    connection.current.off('PostDeleted', handlePostDeleted);
                    connection.current.off('NewCommentCreated', handleCommentCreated);
                    connection.current.off('CommentDeleted', handleCommentDeleted);
                    connection.current.off('MessageCreated', handleMessageCreated);
                    connection.current.off('MessageRead', handleMarkAsRead);
                    connection.current.off('FriendRequestReceived', handleAddNotification);
                    connection.current.off('NotificationDeleted', handleRemoveNotification);
                    connection.current.off('FriendRequestAccepted', handleNewFriend);
                    connection.current.off('FriendDeleted', handleRemoveFriend);
                    connection.current.off('FriendRequestDeleted', handleRemoveFriendRequest);
                    connection.current.off('ActiveChatsChanged', handleActiveChatsChanged);

                    try {
                        if (connection.current.state !== "Disconnected") {
                            await connection.current.stop();
                        }
                    } catch (error) {
                        console.error('Error during SignalR cleanup:', error);
                    }
                }
            };
            cleanUp()
        }

    }, []);

    useEffect(() => {

        const sendMessageWithConnectionIdentity = async () => {
            if (connection.current?.state === "Connected") {
                await connection.current?.send("IdentifyConnection", {});
            }
        }
        sendMessageWithConnectionIdentity()
    }, [connection.current?.connectionId, user]);

    return (
        children
    );
}

export default SignalR;