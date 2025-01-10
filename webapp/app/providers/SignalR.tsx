'use client'

import {ReactNode, useCallback, useEffect, useRef} from 'react';
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {usePostStore} from "@/hooks/usePostStore";
import {Post, Comment, MessageType} from "@/types";
import {useCommentStore} from "@/hooks/useCommentStore";
import {useMessageStore} from "@/hooks/useMessageStore";

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
        addMessage(message.sender.profileId, message)
    }, [addMessage]);

    const handleMarkAsRead = useCallback((userId: string) => {
        markAsRead(userId);
    }, [markAsRead]);

    useEffect(() => {
        if (!connection.current) {
            connection.current = new HubConnectionBuilder()
                .withUrl(notifyUrl)
                .withAutomaticReconnect()
                .build()

            connection.current.start()
                .then(() => 'Connected to notificationHub')
                .catch(console.error);

            connection.current.on('NewPostCreated', handlePostCreated);
            connection.current.on('PostDeleted', handlePostDeleted);
            connection.current.on('NewCommentCreated', handleCommentCreated);
            connection.current.on('CommentDeleted', handleCommentDeleted);
            connection.current.on('MessageCreated', handleMessageCreated);
            connection.current.on('MessageRead', handleMarkAsRead);

            return () => {
                connection.current?.off('NewPostCreated', handlePostCreated);
                connection.current?.off('PostDeleted', handlePostDeleted);
                connection.current?.off('NewCommentCreated', handleCommentCreated);
                connection.current?.off('CommentDeleted', handleCommentDeleted);
                connection.current?.off('MessageCreated', handleMessageCreated);
                connection.current?.off('MessageRead', handleMarkAsRead);
            }
        }
    }, [handleCommentCreated, handleCommentDeleted, handleMessageCreated, handlePostCreated, handlePostDeleted, notifyUrl]);

    return (
        children
    );
}

export default SignalR;