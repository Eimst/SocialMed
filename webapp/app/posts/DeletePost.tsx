import React from 'react';
import {IoTrashOutline} from "react-icons/io5";
import {useUserStore} from "@/hooks/useUserStore";
import toast from "react-hot-toast";
import {usePostStore} from "@/hooks/usePostStore";
import {deletePost} from "@/app/actions/postActions";
import {Post} from "@/types";

type Props = {
    post: Post;
}

function DeletePost({post}: Props) {
    const user = useUserStore(state => state.user);

    const removePost = usePostStore(state => state.removePost)
    let showDeleteButton = false;

    if(user?.profileId === post.userId)
        showDeleteButton = true;

    const onDelete = async () => {
        try {
            const res = await deletePost(post.id);

            if (res.error)
                throw res.error;

            removePost(post.id);
            toast.success('Post was deleted');
        } catch (error: any) {
            toast.error(error.message);
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