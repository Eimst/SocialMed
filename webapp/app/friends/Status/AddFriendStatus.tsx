'use client'

import React from 'react';
import {IoPersonAddSharp} from "react-icons/io5";
import {addFriend} from "@/app/actions/friendActions";
import toast from "react-hot-toast";


type Props = {
    userId: string;
    setStatus: (value: string) => void;
}


function AddFriendStatus({userId, setStatus}: Props) {

    const handleAddToFriendsClick = async () => {
        const res = await addFriend(userId);

        if(res.error){
            toast.error(res.error)
        } else {
            setStatus("WaitingForConfirmation")
        }
    }

    return (
        <div className={"relative inline-block group"}>
            <button type="button"
                    className=" bg-gradient-to-r from-red-300 via-red-200
                                    to-pink-100 hover:bg-gradient-to-bl  focus:outline-none
                                    rounded-full px-4 py-4 text-center shadow-md  border-red-100"
                    onClick={handleAddToFriendsClick}
            >
                <IoPersonAddSharp size={30}/>
            </button>
            <span
                className="absolute top-14 left-0 -translate-x-1/2 bg-gray-600 text-white
                            py-1 px-4 rounded-lg opacity-0 text-xs transition-opacity duration-300 group-hover:opacity-100"
            >
                Send friend request
            </span>
        </div>
    );
}

export default AddFriendStatus;