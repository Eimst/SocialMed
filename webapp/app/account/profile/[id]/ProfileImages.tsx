import React, {useState} from 'react';
import Image from "next/image";
import {UserProfile} from "@/types";
import {useUserStore} from "@/hooks/useUserStore";
import Modal from "@/app/components/Modal";
import EditImage from "@/app/account/profile/[id]/EditImage";


type Props = {
    userProfile: UserProfile
}

function ProfileImages({userProfile}: Props) {
    const user = useUserStore(state => state.user)
    const [isModalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleImageUpdate = async () => {
        closeModal();
    };

    return (
        <div className="relative w-[100%] h-2/5 shadow-md">
            <Image
                src={'https://cdn.pixabay.com/photo/2017/01/06/23/04/nature-1959229_1280.jpg'}
                alt="profile"
                fill
                priority
                className="object-cover rounded-b-xl"
                sizes="(max-width: 16px) 100vw, (max-width: 16px) 50vw, 25vw"


            />
            <div className={`absolute bottom-0 left-32 transform -translate-x-1/2 translate-y-1/2 w-64 h-64 group`}>
                <Image
                    src={userProfile.profilePictureUrl}
                    alt="profile"
                    fill
                    priority
                    className={`object-cover rounded-full`}
                    sizes="(max-width: 16px) 100vw, (max-width: 16px) 50vw, 25vw"
                />
                {
                    (user && user.profileId === userProfile.profileId) && (
                        <div
                            className="cursor-pointer absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500 ease-in-out"
                            onClick={openModal}
                        >
                            <span className="text-white text-lg font-semibold"
                            >
                                Edit
                            </span>
                        </div>
                    )
                }

            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <EditImage userId={userProfile.profileId} handleImageUpdate={handleImageUpdate} />
            </Modal>
        </div>
    );
}

export default ProfileImages;