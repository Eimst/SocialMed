'use client'

import React from 'react';

import {AiOutlineLogout} from "react-icons/ai";
import {UserProfileInfo} from "@/types";
import {logout} from "@/app/actions/userActions";
import ProfileImage from "@/app/components/ProfileImage";
import {SpeedDial, SpeedDialAction} from "@mui/material";
import {useRouter} from "next/navigation";


type Props = {
    user: UserProfileInfo
}

function UserActions({user}: Props) {
    const router = useRouter();

    const signOut = async () => {
        await logout()
    }

    return (
        <div>
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                icon={
                    <ProfileImage imageUrl={user.profilePictureUrl} />
                }
                direction="left"
                sx={{
                    transform: 'scale(1.1)',
                    marginRight: 1
                }}
                onClick={() => router.push(`/account/profile/${user.profileId}`)}
            >

                <SpeedDialAction
                    key={'logout'}
                    icon={<AiOutlineLogout className="h-8 w-8" />}
                    tooltipTitle={`Sign out`}
                    sx={{
                        transform: 'scale(1.1)',
                    }}
                    onClick={signOut}
                />
            </SpeedDial>
        </div>
    );
}

export default UserActions;