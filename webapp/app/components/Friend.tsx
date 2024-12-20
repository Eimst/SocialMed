import React from 'react';
import {UserProfile} from "@/types";
import MessageIconWithCount from "@/app/components/MessageIconWithCount";
import User from "@/app/components/User";

type Props = {
    user: UserProfile
}

function Friend({user}: Props) {
    return (
        <div className={`flex gap-5 items-center px-3 py-5 shadow-sm`}>
            <User user={user}/>
            <div className={`ml-auto`}>
                <MessageIconWithCount/>
            </div>
        </div>
    );
}

export default Friend;