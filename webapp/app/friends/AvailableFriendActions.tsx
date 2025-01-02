import React, {useEffect, useState} from 'react';
import {getFriendStatus} from "@/app/actions/friendActions";
import AddFriendStatus from "@/app/friends/Status/AddFriendStatus";
import WaitingForConfirmationStatus from "@/app/friends/Status/WaitingForConfirmationStatus";
import FriendStatus from "@/app/friends/Status/FriendStatus";
import NeedToConfirmStatus from "@/app/friends/Status/NeedToConfirmStatus";


type Props = {
    userId: string;
}

function AvailableFriendActions({userId} : Props) {
    const [status, setStatus] = useState("")

    useEffect(() => {
        const checkStatus = async () => {
            const data = await getFriendStatus(userId);

            if (data.error)
                setStatus("")
            else {
                setStatus(data.status)
            }
        }
        checkStatus()
    }, [userId])

    switch (status) {
        case "WaitingForConfirmation":
            return (<WaitingForConfirmationStatus userId={userId} setStatus={setStatus}/>);

        case "NeedToConfirm":
            return (<NeedToConfirmStatus userId={userId} setStatus={setStatus}/>);

        case "Friend":
            return (<FriendStatus userId={userId} setStatus={setStatus}/>);

        default:
            return (<AddFriendStatus userId={userId} setStatus={setStatus}/>)
    }
}

export default AvailableFriendActions;