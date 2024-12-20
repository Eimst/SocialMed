'use client'

import React from 'react';
import UserComment from "@/app/comments/UserComment";
import {useCommentStore} from "@/hooks/useCommentStore";
import {useShallow} from "zustand/react/shallow";

type Props = {
    postId: string;
}

function CommentSection({postId}: Props) {
    const comments = useCommentStore(useShallow((state) => state.commentsByPost[postId] || []));


    return (
        <div className={``}>

            {
                comments.length > 0 && (
                    <>
                        <div className={`flex justify-start text-md text-black  bg-blue-100 py-2 shadow-md`}>
                            <span className={`block px-5`}>
                                 Comments
                             </span>
                        </div>

                        <div className={``}>
                            {
                                comments.map(x => <UserComment key={x.id} comment={x}/>)
                            }
                        </div>
                        {
                            comments.length > 3 && (
                                <div className={`flex justify-start text-md text-black  bg-blue-100 py-2 shadow-md`}>
                                    <span className={`block px-5`}>
                                        Show all comments
                                    </span>
                                </div>
                            )
                        }
                    </>
                )
            }


        </div>
    );
}

export default CommentSection;