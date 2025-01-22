'use client'

import React, {useEffect, useState} from 'react';
import PostCard from "@/app/posts/PostCard";
import ProfileImages from "@/app/account/profile/[id]/ProfileImages";
import {usePostStore} from "@/hooks/usePostStore";
import {useShallow} from "zustand/react/shallow";
import {useUserStore} from "@/hooks/useUserStore";
import {getProfileInfo} from "@/app/actions/userActions";
import toast from "react-hot-toast";
import AvailableFriendActions from "@/app/friends/AvailableFriendActions";
import Modal from "@/app/components/Modal";
import ShowAllFriends from "@/app/friends/ShowAllFriends";
import ProfileSettings from "@/app/account/profile/[id]/ProfileSettings";
import {CustomError} from "@/types";


type Props = {
    id: string;
}

function Profile({id}: Props) {
    const posts = usePostStore(useShallow((state) =>
        state.posts.filter((post) => post.userId === id))
    );

    const user = useUserStore(state => state.user);
    const [nameLastName, setNameLastName] = useState("");

    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    useEffect(() => {
        const getProfileUserInfo = async () => {
            try {
                const data = await getProfileInfo(id)

                if (data.error)
                    throw {message: data.error.message, status: data.error.status} as CustomError;

                setNameLastName(`${data.firstName} ${data.lastName}`);

            } catch (error: unknown) {
                if (error && (error as CustomError).message) {
                    toast.error((error as CustomError).message);
                } else {
                    toast.error("An unexpected error occurred.");
                }
            }

        }
        getProfileUserInfo();
    }, [id]);

    return (

        <div className={` w-[100%] flex gap-10 h-screen justify-center -mt-40 bg-gray-50`}>
            <div className={`w-[55%] h-screen overflow-y-auto scrollbar-hide`}>

                <ProfileImages/>

                <div className={`flex w-[73%] ml-auto pt-7 justify-between`}>
                        <span className={`text-black text-2xl font-semibold`}>
                            {nameLastName}
                        </span>
                    {
                        user && (
                            user.profileId !== id ? (
                                <AvailableFriendActions userId={id}/>
                            ) : (
                                <ProfileSettings/>
                            ))
                    }

                </div>
                <div className={`flex justify-between mt-24 mb-10`}>

                    <div className={`w-1/2`}>
                        <span className={`font-semibold text-black text-lg`}>
                            Bio:
                        </span>
                        <span className={`flex w-[100%]  justify-end text-black text-justify`}>
                            Lorem ipsum odor amet, consectetuer adipiscing elit. Fames justo fames purus integer
                            purus morbi vestibulum parturient. Non pulvinar vestibulum, nascetur efficitur nisl porta.
                            Convallis vivamus eu amet proin habitant faucibus nunc.
                        </span>
                    </div>
                    <div className={`relative h-10`}>
                        <button
                            className={`bg-gradient-to-r from-green-600 via-green-500 to-green-400 focus:outline-none 
                            rounded-lg px-2 py-2 text-center shadow-md border-green-200 text-white
                            transition-all duration-300"`}
                            onClick={openModal}
                        >
                            See all friends
                        </button>
                    </div>

                </div>


                <div
                    className={`flex  ${posts.length > 0 && 'bg-red-50 border-2 shadow-md border-gray-200'}
                    rounded-t-lg py-3 justify-center`}
                >
                    {
                        posts.length > 0 ? (
                            <span className={`text-black text-2xl font-semibold`}>
                                Posts
                            </span>
                        ) : (
                            <span className={`mt-24 text-black text-2xl font-semibold`}>
                                There are no posts
                            </span>
                        )
                    }


                </div>

                {
                    posts.length > 0 && (
                        <div className={`grid gap-10 pb-32`}>
                            {
                                posts.map(post => <PostCard key={post.id} post={post}/>)
                            }
                        </div>
                    )
                }

            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ShowAllFriends userId={id}/>
            </Modal>

        </div>

    );
}

export default Profile;