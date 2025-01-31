import React from 'react';
import ProfileImage from "@/app/components/ProfileImage";
import {UserProfileInfo} from "@/types";
import Link from "next/link";


type Props = {
    user: UserProfileInfo;
}

function User({user}: Props) {
    return (
        <>
            <ProfileImage
                imageUrl={user.profilePictureUrl}/>
            <div
                className="font-medium leading-none text-gray-900 hover:text-indigo-600 transition duration-500 ease-in-out">
                <Link href={`/account/profile/${user.profileId}`}>
                    {user.firstName} {user.lastName}
                </Link>
            </div>
        </>
    );
}

export default User;