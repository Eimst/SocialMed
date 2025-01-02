import React from 'react';
import {deleteFriendStatus} from "@/app/actions/friendActions";
import toast from "react-hot-toast";
import {FaUserAltSlash, FaUserFriends} from "react-icons/fa";
import {useFriendStore} from "@/hooks/useFriendStore";


type Props = {
    userId: string;
    setStatus: any;
}

function FriendStatus({userId, setStatus}: Props) {

    const removeFriend = useFriendStore(state => state.removeFriend)

    const handleDeleteClick = async () => {
        const res = await deleteFriendStatus(userId);

        if (res.error) {
            toast.error(res.error)
        } else {
            setStatus("")
            removeFriend(userId);
        }
    }

    return (
        <div className="relative inline-block group">
            <button
                type="button"
                className="bg-gradient-to-r from-green-600 via-green-500 to-green-400 group-hover:from-red-600 group-hover:via-red-500 group-hover:to-red-400
                            focus:outline-none rounded-full px-4 py-4 text-center shadow-md border-green-100 transition-all duration-300"
                onClick={handleDeleteClick}
            >
                <span className="group-hover:hidden">
                    <FaUserFriends size={30} />
                </span>
                <span className="hidden group-hover:block">
                    <FaUserAltSlash size={30}/>
                </span>

            </button>
            <span
                className="absolute top-14 left-0 -translate-x-1/2 bg-gray-600 text-white
                            py-1 px-4 rounded-lg opacity-0 text-xs transition-opacity duration-500 group-hover:opacity-100"
            >
                Remove from friends
            </span>
        </div>
    );
}

export default FriendStatus;