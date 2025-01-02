import React, {useEffect, useState} from 'react';
import {getAllFriendsByUserId} from "@/app/actions/friendActions";
import Friend from "@/app/friends/Friend";
import {Friend as FriendType} from "@/types";

type Props = {
    userId: string;
}

function ShowAllFriends({userId}: Props) {
    const [friends, setFriends] = useState<FriendType[]>([]);

    useEffect(() => {
        const getFriends = async () => {
            try {
                const data = await getAllFriendsByUserId(userId)
                if (data.error)
                    throw data.error

                setFriends(data)
            } catch (error: any) {
                console.log(error)
            }
        }
        getFriends();
    }, [setFriends]);

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Friends</h1>

            {friends.length > 0 ? friends.map((friend) => (
                <div className={`-mx-3 overflow-y-auto`} key={friend.userProfileInfo.profileId}>
                    <Friend key={friend.userProfileInfo.profileId} user={friend.userProfileInfo}
                            showMessageIcon={false}/>
                </div>
            )) : (<span>User have no friends</span>)}

        </div>
    );
}

export default ShowAllFriends;