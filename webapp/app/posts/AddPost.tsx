import React, {useState} from 'react';

import toast from "react-hot-toast";
import {createPost} from "@/app/actions/postActions";
import ContentForm from "@/app/components/ContentForm";
import {IoEarthSharp} from "react-icons/io5";
import {Button} from "@mui/material";
import {useUserStore} from "@/hooks/useUserStore";
import {CustomError} from "@/types";


function AddPost() {
    const [content, setContent] = useState("");
    const [isEmojiActive, setIsEmojiActive] = useState(false);
    // const addPost = usePostStore(state => state.addPost)
    const user = useUserStore(state => state.user);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            if (!user) {
                throw new Error("Must be logged in to post");
            }

            if(!content || content.trim() === ""){
                throw new Error("Post cannot be empty");
            }

            const newPost = {
                content: content,
                imageUrl: null,
                userId: user.profileId
            }

            const createdPost = await createPost(newPost);

            if (createdPost.error) {
                throw { message: createdPost.error.message, status: createdPost.error.status } as CustomError;
            }
            setContent('');
            setIsEmojiActive(false);
            // addPost(createdPost)

        } catch (error: unknown) {
            toast.dismiss()
            if (error && (error as CustomError).message) {
                toast.error((error as CustomError).message);
            } else if ((error as Error).message){
                toast.error((error as Error).message);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    const addEmoji = (emoji: { native: string }) => {
        setContent(content + emoji.native);
    };

    return (
        <div className={`p-5 bg-gray-50 rounded-lg shadow-md border-2 border-gray-100 mt-5`}>
            <h2 className={`flex justify-center text-xl text-black font-semibold mb-5`}>
                Share what&apos;s on your mind
            </h2>
            <div className={`rounded-lg`}>
                <form onSubmit={handleSubmit}>
                    <div className={`relative`}>
                        <ContentForm
                            isEmojiActive={isEmojiActive}
                            content={content}
                            handleChange={handleChange}
                            addEmoji={addEmoji}
                            setIsEmojiActive={setIsEmojiActive}
                            placeholder={"Write a post..."}/>
                    </div>

                    <div className={`flex justify-end py-3 gap-10`}>

                        <Button variant="contained" size="small" type={"submit"} endIcon={<IoEarthSharp size={20}/>}
                                className={`text-xs`}>
                            <span className={`mt-0.5`}>Post</span>
                        </Button>
                    </div>
                </form>

            </div>

        </div>
    );
}

export default AddPost;