'use client'

import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {UserProfileInfo} from "@/types";
import {getSearchResults} from "@/app/actions/searchActions";
import toast from "react-hot-toast";
import Friend from "@/app/friends/Friend";
import {useRouter} from "next/navigation";

type Props = {
    searchText: string;
    setSearchText: (text: string) => void;
    isVisible: boolean;
}

const SearchField = forwardRef(({ searchText, setSearchText, isVisible }: Props, ref) => {
    const [isSearching, setIsSearching] = useState(true);
    const [users, setUsers] = useState<UserProfileInfo[]>([]);
    const router = useRouter();

    useImperativeHandle(ref, () => ({
        focusFirstUser: () => {
            if (users && users.length > 0) {
                router.push(`/account/profile/${users[0].profileId}`);
            }
        },
    }));

    useEffect(() => {
        const getSearchRes = async () => {
            const data = await getSearchResults(searchText);

            if (data.error) {
                toast.error(data.error);
            } else {
                setUsers(data);
                setIsSearching(false);
            }
        };

        getSearchRes();
    }, [searchText]);

    return (
        <div
            className={`absolute top-full left-0 min-h-[100px] w-full bg-white rounded-b-xl z-40 transition-opacity duration-300 ${
                isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
        >
            {isVisible && (
                <>
                    {isSearching ? (
                        <div className="flex items-center justify-center pt-6">Searching...</div>
                    ) : users.length === 0 ? (
                        <div className="flex items-center justify-center pt-6">No matches</div>
                    ) : (
                        users.map((user) => (
                            <div key={user.profileId} onClick={() => setSearchText('')}>
                                <Friend key={user.profileId} user={user} showMessageIcon={false} />
                            </div>
                        ))
                    )}
                </>
            )}
        </div>
    );
});

SearchField.displayName = 'SearchField';

export default SearchField;