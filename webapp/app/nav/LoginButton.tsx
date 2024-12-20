'use client'

import React from 'react';
import {useRouter} from "next/navigation";

function LoginButton() {
    const router = useRouter();

    const handleClick = () => {
        router.push('/account/login');
    }

    return (
        <div>
            <button onClick={handleClick}
                    className={`class="text-white bg-red-600 hover:bg-red-800 focus:outline-none focus:ring-0
                     focus:ring-red-300 font-medium rounded-full text-md px-5 py-2.5 
                     text-center me-2 dark:bg-red-600 dark:hover:bg-red-700 "`}
            >
                <span className={`text-white`}>Login</span>
            </button>
        </div>
    )

}

export default LoginButton;