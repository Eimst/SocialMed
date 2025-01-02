'use client';

import React, {useEffect} from 'react';
import {useFriendStore} from '@/hooks/useFriendStore';
import {LiaUserFriendsSolid} from 'react-icons/lia';
import Friends from '@/app/friends/Friends';
import {useUserStore} from "@/hooks/useUserStore";
import {getAllFriendsByUserId} from "@/app/actions/friendActions";
import {useLoadingStore} from "@/hooks/useLoadingStore";

export default function FriendsLayout({children}: { children: React.ReactNode }) {
    const setFriends = useFriendStore((state) => state.setFriends);
    const isOpen = useFriendStore((state) => state.isOpen);
    const setOpen = useFriendStore((state) => state.setOpen);
    const user = useUserStore((state) => state.user);
    const isLoading = useLoadingStore(state => state.isLoading);

    useEffect(() => {
        const getFriends = async (userId: string) => {
            try {
                const data = await getAllFriendsByUserId(userId)
                if (data.error)
                    throw data.error

                setFriends(data)
            } catch (error: any) {
                console.log(error)
            }
        }

        if (user) {
            getFriends(user.profileId);
        }
    }, [setFriends, user]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="relative w-full h-full">
            {/* Page Content */}
            {children}

            {/* Fixed Friends Button */}
            {isOpen ? (
                <div className="w-[20%] fixed bottom-0 right-2 z-49 justify-end">
                    <Friends setShowFriends={setOpen}/>
                </div>
            ) : (
                <button
                    className="bg-red-600 rounded-full p-3 fixed bottom-5 right-5 z-49"
                    onClick={() => setOpen(true)}
                >
                    <LiaUserFriendsSolid color="white" size={45}/>
                </button>
            )}
        </div>
    );
}
