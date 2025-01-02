import React from 'react';
import Image from "next/image";
// import {UserProfileInfo} from "@/types";
//
//
// type Props = {
//     user?: UserProfileInfo
// }

function ProfileImages() {
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
            <div className={`absolute bottom-0 left-32 transform -translate-x-1/2 translate-y-1/2 w-64 h-64`}>
                <Image
                    src={'https://cdn.pixabay.com/photo/2023/12/22/01/37/woman-8463055_1280.jpg'}

                    alt="profile"
                    fill
                    priority
                    className={`object-cover rounded-full duration-700 ease-in-out`}
                    sizes="(max-width: 16px) 100vw, (max-width: 16px) 50vw, 25vw"

                />

            </div>
        </div>
    );
}

export default ProfileImages;