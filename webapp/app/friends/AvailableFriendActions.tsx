import React, {useEffect} from 'react';
import {getFriendStatus} from "@/app/actions/friendActions";
import AddFriendStatus from "@/app/friends/Status/AddFriendStatus";
import WaitingForConfirmationStatus from "@/app/friends/Status/WaitingForConfirmationStatus";
import FriendStatus from "@/app/friends/Status/FriendStatus";
import NeedToConfirmStatus from "@/app/friends/Status/NeedToConfirmStatus";
import {useFriendStatusStore} from "@/hooks/useFriendStatusStore";


type Props = {
    userId: string;
}

function AvailableFriendActions({userId} : Props) {
    const status = useFriendStatusStore(state => state.statusByUser[userId]);
    const setStatus = useFriendStatusStore(state => state.setStatusByUser);
    useEffect(() => {
        const checkStatus = async () => {
            const data = await getFriendStatus(userId);

            if (data.error)
                setStatus(userId, "")
            else {
                setStatus(userId, data.status)
            }
        }
        checkStatus()
    }, [setStatus, userId])

    switch (status) {
        case "WaitingForConfirmation":
            return (<WaitingForConfirmationStatus userId={userId}/>);

        case "NeedToConfirm":
            return (<NeedToConfirmStatus userId={userId}/>);

        case "Friend":
            return (<FriendStatus userId={userId}/>);

        default:
            return (<AddFriendStatus userId={userId}/>)
    }
}

export default AvailableFriendActions;