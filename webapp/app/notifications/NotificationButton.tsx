import React, {useEffect, useState} from 'react';
import Notifications from "@/app/notifications/Notifications";
import {IoNotifications} from "react-icons/io5";
import {useNotificationStore} from "@/hooks/useNotificationStore";
import {getAllNotifications} from "@/app/actions/notificationActions";
import toast from "react-hot-toast";

function NotificationButton() {
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const setNotifications = useNotificationStore(state => state.setNotifications)
    const notifications = useNotificationStore(state => state.notifications);

    useEffect(() => {
        const getNotifications = async () => {
            const response = await getAllNotifications()
            if (response.error)
                toast.error(response.error.message)
            else {
                setNotifications(response)
            }
        }
        getNotifications();
    }, [setNotifications]);

    return (
        <div className={`mt-2 relative mr-4`} >
            <div className={`cursor-pointer`} onClick={() => setIsNotifOpen(!isNotifOpen)}>
                <IoNotifications size={50} color={'black'}/>
                <div className={`absolute h-5 w-5 top-1/4 text-center left-1/3 pr-1 text-white font-semibold`}>
                    {notifications.length > 0 && (notifications.length)}
                </div>
            </div>

            {isNotifOpen && (
                <Notifications notifications={notifications} />
            )}
        </div>
    );
}

export default NotificationButton;