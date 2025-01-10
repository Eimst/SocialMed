'use client'

import React, {useEffect, useRef, useState} from 'react';
import {Post} from "@/types";
import {FaHeart, FaRegCommentDots, FaShare} from "react-icons/fa";
import CommentSection from "@/app/comments/CommentSection";
import User from "@/app/components/User";
import AddComment from "@/app/comments/AddComment";
import {formatDate} from "date-fns";
import {useCommentStore} from "@/hooks/useCommentStore";
import DeletePost from "@/app/posts/DeletePost";
import {normalizeDateString} from "@/app/lib/dateNormalizer";


type Props = {
    post: Post
}

function PostCard({post}: Props) {
    const [isCommenting, setCommenting] = useState(false);
    const setComments = useCommentStore(state => state.setCommentsByPost);
    const addCommentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setComments(post.id, post.comments)
    }, [post.comments, post.id, setComments]);

    // useEffect(() => {
    //     if (isCommenting && addCommentRef.current) {
    //         addCommentRef.current.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest",});
    //     }
    // }, [isCommenting]);

    const handleCommentClick = () => {
        setCommenting(!isCommenting);
    };

    return (

        <div className="w-full p-5 border-2 shadow-md rounded-lg text-gray-500 bg-gray-50">

            <div className="flex items-center gap-2">
                <User user={post.userProfile}/>
                <DeletePost post={post}/>
            </div>


            <div className={`-m-5 border-b-2 mt-2 `}>
                <p className="text-md text-gray-900 justify-between p-5">
                    {post.content}
                    <span className={`text-xs block pt-4`}>
                         {formatDate(new Date(normalizeDateString(post.dateCreated)), 'PPP HH:mm')}
                    </span>
                </p>

            </div>

            <div className="grid grid-cols-2 items-center mt-6 mb-8 ">
                <div className="flex justify-start mt-2">
                    <div className={`flex cursor-pointer gap-2`}>
                        <FaHeart size={25} color={"red"}/>
                        <span className={`text-md text-black`}>
                        Like
                    </span>
                    </div>

                </div>
                <div className="flex justify-end mt-2 gap-7">
                    <div className={`flex gap-2 cursor-pointer`}>
                        <FaShare size={25} color={`black`}/>
                        <span className={`text-md text-black`}>
                        Share
                    </span>
                    </div>
                    <button className={`flex gap-2 cursor-pointer`} onClick={handleCommentClick}>
                        <FaRegCommentDots size={25} className={`text-blue-500`}/>
                        <span className={`text-md text-black`}>
                            Comment
                        </span>

                    </button>

                </div>
            </div>

            {isCommenting && (
                <div ref={addCommentRef}  className={`block  -m-5`}>
                    <AddComment postId={post.id} setCommenting={setCommenting}/>
                </div>
            )}

            <div className={`block  -m-5`}>
                <CommentSection postId={post.id}/>
            </div>


        </div>
    );
}

export default PostCard;