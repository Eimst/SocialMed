import React, {useState} from 'react';
import {UserProfile} from "@/types";
import {updateProfileBio} from "@/app/actions/userActions";
import toast from "react-hot-toast";

type Props = {
    userProfile: UserProfile
    setIsBioEditing: (value: boolean) => void
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | undefined>>;
}

function EditBio({userProfile, setIsBioEditing, setUserProfile}: Props) {
    const [bio, setBio] = useState(userProfile.bio || "");

    const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBio(e.target.value); // Update local state
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const resp = await updateProfileBio(userProfile.profileId, bio);
        if (resp.error)
            toast.error(resp.error.message);
        else {
            setUserProfile((prev) => prev ? ({
                ...prev,
                bio,
            }) : undefined);
            setIsBioEditing(false);
            toast.success('Bio updated successfully!');
        }
    }

    const handleOnCancel = () => {
        setIsBioEditing(false);
    }

    return (
        <form onSubmit={handleSubmit}>
             <textarea value={bio}
                       className={`flex w-[100%]  justify-end min-h-32 text-black text-justify border-0 p-1 rounded-md focus:ring-0`}
                       onChange={handleBioChange}
             />
            <div className={`flex justify-between `}>
                <button
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    onClick={handleOnCancel}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Update
                </button>
            </div>

        </form>

    );
}

export default EditBio;