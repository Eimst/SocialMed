import React from 'react';
import User from "@/app/components/User";
import {IoClose} from "react-icons/io5";
import {getDynamicTime, normalizeDateString} from "@/app/lib/dateNormalizer";
import {NotificationType} from "@/types";
import {FaUserAltSlash, FaUserCheck} from "react-icons/fa";
import {removeNotification} from "@/app/actions/notificationActions";
import toast from "react-hot-toast";
import {deleteFriendRequest, updateFriendStatus} from "@/app/actions/friendActions";


type Props = {
    notification: NotificationType;
}

function Notification({notification}: Props) {

    const handleRemoveNotification = async () => {
        const response = await removeNotification(notification.id);
        if (response.error)
            toast.error(response.error.message)
    }

    const handleConfirmClick = async () => {
        const res = await updateFriendStatus(notification.initiator.profileId);

        if (res.error) {
            toast.error(res.error.message)
        } else {
            await handleRemoveNotification();
        }
    }

    const handleRejectClick = async () => {
        const res = await deleteFriendRequest(notification.initiator.profileId);

        if (res.error) {
            toast.error(res.error.message)
        } else {
            await handleRemoveNotification();
        }
    }

    return (
        <div className={`shadow p-3`}>
            <div className={`flex justify-between`}>
                <div className={`flex items-center gap-2`}>
                    <User key={notification.initiator.profileId} user={notification.initiator}/>
                </div>
                <IoClose onClick={handleRemoveNotification} className={`cursor-pointer`}/>
            </div>
            <div className={`flex justify-between mt-2 text-xs`}>
                <div className={`flex gap-3`}>
                    <span>{notification.text}</span>
                    <button
                        onClick={handleConfirmClick}
                    >
                        <FaUserCheck size={15} color={`green`} />
                    </button>
                    <button
                        onClick={handleRejectClick}
                    >
                        <FaUserAltSlash size={15} color={`red`}/>
                    </button>
                </div>
                <span>{getDynamicTime(normalizeDateString(notification.date))}</span>
            </div>
        </div>
    );
}

export default Notification;