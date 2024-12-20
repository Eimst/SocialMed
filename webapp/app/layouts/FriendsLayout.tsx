'use client';

import React from 'react';
import { useFriendStore } from '@/hooks/useFriendStore';
import { LiaUserFriendsSolid } from 'react-icons/lia';
import Friends from '@/app/components/Friends';
import {useUserStore} from "@/hooks/useUserStore";

export default function FriendsLayout({ children }: { children: React.ReactNode }) {
    const setOpen = useFriendStore((state) => state.setOpen);
    const isOpen = useFriendStore((state) => state.isOpen);
    const user = useUserStore((state) => state.user);

    return (
        <div className="relative w-full h-full">
            {/* Page Content */}
            {children}

            {/* Fixed Friends Button */}
            {isOpen ? (
                <div className="w-[20%] fixed bottom-0 right-2 z-50 justify-end">
                    <Friends setShowFriends={setOpen} />
                </div>
            ) : (
                <button
                    className="bg-red-600 rounded-full p-3 fixed bottom-5 right-5 z-50"
                    onClick={() => setOpen(true)}
                >
                    <LiaUserFriendsSolid color="white" size={45} />
                </button>
            )}
        </div>
    );
}
