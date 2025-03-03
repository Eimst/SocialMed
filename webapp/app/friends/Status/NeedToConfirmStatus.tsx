import React from 'react';
import {deleteFriendRequest, updateFriendStatus} from "@/app/actions/friendActions";
import toast from "react-hot-toast";
import {FaUserAltSlash, FaUserCheck} from "react-icons/fa";
import {useNotificationStore} from "@/hooks/useNotificationStore";
import {removeNotification} from "@/app/actions/notificationActions";

type Props = {
    userId: string;
}

function NeedToConfirmStatus({userId}: Props) {
    const notifications = useNotificationStore(state => state.notifications);

    const deleteNotification = async () => {
        const notificationId = notifications.find(x => x.initiator.profileId === userId);

        if (notificationId) {
            const response = await removeNotification(notificationId.id);
            if (response.error)
                toast.error(response.error.message)
        }
    }

    const handleConfirmClick = async () => {
        const res = await updateFriendStatus(userId);

        if (res.error) {
            toast.error(res.error.message);
        } else {
            await deleteNotification()
        }
    }

    const handleRejectClick = async () => {
        const res = await deleteFriendRequest(userId);

        if (res.error) {
            toast.error(res.error.message);
        } else {
            await deleteNotification()
        }
    }

    return (
        <div className={`flex gap-3`}>
            <div className="relative inline-block group">
                <button
                    type="button"
                    className="bg-gradient-to-r from-green-600 via-green-500 to-green-400 hover:bg-gradient-to-bl
                            focus:outline-none rounded-full px-4 py-4 text-center shadow-md border-green-100"
                    onClick={handleConfirmClick}
                >
                    <FaUserCheck size={30}/>
                </button>
                <span
                    className="absolute top-14 left-2 -translate-x-1/2 bg-gray-600 text-white
                            py-1 px-4 rounded-lg opacity-0 text-xs transition-opacity duration-300 group-hover:opacity-100"
                >
                Accept friend request
            </span>
            </div>
            <div className="relative inline-block group">
                <button
                    type="button"
                    className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 hover:bg-gradient-to-bl
                            focus:outline-none rounded-full px-4 py-4 text-center shadow-md border-red-100"
                    onClick={handleRejectClick}
                >
                    <FaUserAltSlash size={30}/>
                </button>
                <span
                    className="absolute top-14 left-2 -translate-x-1/2 bg-gray-600 text-white
                            py-1 px-4 rounded-lg opacity-0 text-xs transition-opacity duration-300 group-hover:opacity-100"
                >
                Reject friend request
            </span>
            </div>
        </div>

    );
}

export default NeedToConfirmStatus;