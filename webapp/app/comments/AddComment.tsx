'use client'

import React, {useState} from 'react';
import {Button} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import {createComment} from "@/app/actions/commentActions";
import toast from "react-hot-toast";
import ContentForm from "@/app/components/ContentForm";
import {useCommentStore} from "@/hooks/useCommentStore";
import {useUserStore} from "@/hooks/useUserStore";

type Props = {
    postId: string
    setCommenting: any
}

function AddComment({postId, setCommenting}: Props) {
    const [content, setContent] = useState("");
    const addComments = useCommentStore(state => state.addCommentByPost);
    const user = useUserStore(state => state.user);

    const [isEmojiActive, setIsEmojiActive] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            if (!user) {
                throw new Error("Must be logged in to comment");
            }

            const newComment = {
                text: content,
                postId: postId,
                userId: user.profileId
            }

            const createdComment = await createComment(postId, newComment);

            if (createdComment.error) {
                throw createdComment.error
            }
            setContent('');
            setCommenting(false);
            addComments(postId, createdComment);

        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    const addEmoji = (emoji: { native: string }) => {
        setContent(content + emoji.native);
    };

    return (
        <div className={`w-full bg-gray-100 border-y-2 pb-5`}>
            <span className={`flex text-lg text-black justify-center pt-3 pb-2`}>
                Write a comment
            </span>
            <div className={`px-5`}>
                <form onSubmit={handleSubmit}>
                    <div className={`relative`}>
                        <ContentForm
                            content={content}
                            handleChange={handleChange}
                            addEmoji={addEmoji}
                            isEmojiActive={isEmojiActive}
                            placeholder={"Write a comment..."}
                            setIsEmojiActive={setIsEmojiActive}
                        />

                    </div>
                    <div className={`flex justify-end py-3 gap-10`}>

                        <Button variant="contained" size="small" type={"submit"} endIcon={<SendIcon/>}
                                className={`text-xs`}>
                            <span className={`mt-0.5`}>Comment</span>
                        </Button>
                    </div>
                </form>


            </div>


        </div>
    );
}

export default AddComment;