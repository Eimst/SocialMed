'use client'

import React, {useEffect, useState} from 'react';
import Search from "@/app/nav/Search";
import Logo from "@/app/nav/Logo";
import UserActions from "@/app/nav/UserActions";
import LoginButton from "@/app/nav/LoginButton";
import {useUserStore} from "@/hooks/useUserStore";
import toast from "react-hot-toast";
import {getUserInfo} from "@/app/actions/userActions";


function NavBar() {
    const [isLoading, setIsLoading] = useState(true);
    const user = useUserStore((state) => (state.user));

    useEffect(() => {
        const getUser = async () => {
            try {
                await getUserInfo();
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }

        }
        getUser();
    }, []);

    if (isLoading) {
        return (<></>);
    }


    return (
        <header className="sticky top-0 z-50 flex justify-between
        bg-white p-5 items-center text-gray-800 shadow-md">
            <Logo/>
            <Search/>
            {
                user ? (<UserActions user={user}/>)
                    : (<LoginButton/>)
            }

        </header>
    );
}

export default NavBar;