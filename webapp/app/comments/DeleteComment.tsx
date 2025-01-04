import React from 'react';
import {deleteCommentById} from "@/app/actions/commentActions";
import toast from "react-hot-toast";
import {useUserStore} from "@/hooks/useUserStore";
import {IoTrashOutline} from "react-icons/io5";
import {Comment, CustomError} from '@/types'

type Props = {
    comment: Comment
}

function DeleteComment({comment}: Props) {
    const user = useUserStore(state => state.user);

    // const deleteComment = useCommentStore(state => state.deleteCommentByPost);
    let showDeleteButton = false;

    if (user?.profileId === comment.userId)
        showDeleteButton = true;

    const onDelete = async () => {
        try {
            const res = await deleteCommentById(comment.postId, comment.id);

            if (res.error)
                throw { message: res.error.message, status: res.error.status } as CustomError;

            // deleteComment(comment.postId, comment.id)
            toast.success('Comment was deleted');
        } catch (error: unknown) {
            if (error && (error as CustomError).message) {
                toast.error((error as CustomError).message);
            } else {
                toast.error("An unexpected error occurred.");
            }
        }
    }

    return (
        <>
            {
                showDeleteButton && (
                    <button className={`ml-auto text-red-500`} onClick={onDelete}>
                        <IoTrashOutline size={25}/>
                    </button>
                )
            }
        </>
    );
}

export default DeleteComment;