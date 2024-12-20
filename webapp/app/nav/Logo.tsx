

import React from 'react';
import {FaUserFriends} from "react-icons/fa";
import Link from "next/link";

function Logo() {
    return (
        <div className="cursor-pointer flex items-center gap-2 text-3xl font-semibold text-red-600">
            <FaUserFriends size={34}/>
            <Link href="/">
                SocialMed
            </Link>
        </div>
    );
}

export default Logo;