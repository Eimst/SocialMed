import React from 'react';
import {deleteFriendRequest} from "@/app/actions/friendActions";
import toast from "react-hot-toast";
import {FaUserAltSlash} from "react-icons/fa";


type Props = {
    userId: string;
}

function WaitingForConfirmationStatus({userId}: Props) {

    const handleCancelClick = async () => {
        const res = await deleteFriendRequest(userId);

        if (res.error) {
            toast.error(res.error.message)
        }
    }

    return (
        <div className="relative inline-block group">
            <button
                type="button"
                className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 hover:bg-gradient-to-bl
                            focus:outline-none rounded-full px-4 py-4 text-center shadow-md border-red-100"
                onClick={handleCancelClick}
            >
                <FaUserAltSlash size={30}/>
            </button>
            <span
                className="absolute top-14 left-0 -translate-x-1/2 bg-gray-600 text-white
                            py-1 px-4 rounded-lg opacity-0 text-xs transition-opacity duration-300 group-hover:opacity-100"
            >
                Cancel friend request
            </span>
        </div>
    );
}

export default WaitingForConfirmationStatus;