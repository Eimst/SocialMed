import React from 'react';
import User from "@/app/components/User";
import {Comment} from "@/types";
import {formatDate} from "date-fns";
import DeleteComment from "@/app/comments/DeleteComment";
import {normalizeDateString} from "@/app/lib/dateNormalizer";

type Props = {
    comment: Comment
}

function UserComment({comment}: Props) {

    return (
        <div className={`shadow-md pb-4 px-5 rounded-lg`}>
            <div className={`flex gap-2 items-center py-5`}>
                <User user={comment.userProfile}/>
                <DeleteComment comment={comment} />
            </div>
            <div className={`gap-10`}>
                 <span className={`block text-black break-all`}>
                    {comment.text}
                </span>

                <span className={'text-xs'}>
                    {formatDate(new Date(normalizeDateString(comment.dateCreated)), 'PPP HH:mm')}
                </span>

            </div>

        </div>
    );
}

export default UserComment;