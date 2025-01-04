import React from 'react';
import {IoTrashOutline} from "react-icons/io5";
import {useUserStore} from "@/hooks/useUserStore";
import toast from "react-hot-toast";
import {deletePost} from "@/app/actions/postActions";
import {CustomError, Post} from "@/types";

type Props = {
    post: Post;
}

function DeletePost({post}: Props) {
    const user = useUserStore(state => state.user);

    // const removePost = usePostStore(state => state.removePost)
    let showDeleteButton = false;

    if(user?.profileId === post.userId)
        showDeleteButton = true;

    const onDelete = async () => {
        try {
            const res = await deletePost(post.id);

            if (res.error)
                throw { message: res.error.message, status: res.error.status } as CustomError;

            // removePost(post.id);
            toast.success('Post was deleted');
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
            {showDeleteButton && (
                <button className={`ml-auto text-red-500`} onClick={onDelete}>
                    <IoTrashOutline size={25}/>
                </button>
            )}
        </>
    );
}

export default DeletePost;