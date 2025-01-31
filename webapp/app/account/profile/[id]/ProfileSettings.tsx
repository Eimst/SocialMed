import React from 'react';
import {IoSettingsSharp} from "react-icons/io5";


type Props = {
    setIsEditingBio: (value: boolean) => void,
    isEditingBio: boolean,
}

function ProfileSettings({setIsEditingBio, isEditingBio}: Props) {
    return (
        <button
            className="bg-gradient-to-r from-gray-300 via-gray-200 to-white
                            focus:outline-none rounded-full px-4 py-4 text-center shadow-md border-gray-700 transition-all duration-300"
            onClick={() => {setIsEditingBio(!isEditingBio)}}
        >
            <IoSettingsSharp size={30}/>
        </button>
    );
}

export default ProfileSettings;