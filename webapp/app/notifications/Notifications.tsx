import React from 'react';
import Notification from "@/app/notifications/Notification";
import {NotificationType} from "@/types";

type Props = {
    notifications: NotificationType[];
}

function Notifications({notifications}: Props) {

    return (
        <div className={`absolute bg-white min-h-16 min-w-96 max-h-96 right-0 shadow-md rounded-md ${
            notifications.length === 0 ? "flex items-center justify-center" : "overflow-y-auto"
        }`}>

            {
                notifications.length > 0 ? notifications.map((notification) => (
                    <Notification key={notification.id} notification={notification}/>
                )) : (
                    <div className={`font-semibold`}>You have no notifications</div>
                )
            }
        </div>

    );
}

export default Notifications;