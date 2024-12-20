import React from 'react';
import ProfileImage from "@/app/components/ProfileImage";
import {UserProfile} from "@/types";


type Props = {
    user: UserProfile
}

function User({user} : Props) {
    return (
        <>
            <ProfileImage imageUrl={"https://cdn.pixabay.com/photo/2022/11/10/07/15/portrait-7582123_1280.jpg"}/>
            <div
                className="font-medium leading-none text-gray-900 hover:text-indigo-600 transition duration-500 ease-in-out">
                <a href="">
                    {user.firstName} {user.lastName} 
                </a>
            </div>
        </>
    );
}

export default User;