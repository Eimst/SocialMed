'use client'

import React, {useState} from 'react';
import Image from "next/image";

type Props = {
    imageUrl: string;
}

const ProfileImage = ({imageUrl}: Props) => {
    return (
        <div className={`relative w-14 h-14`}>
        <Image
            src={imageUrl}
            alt='image'
            fill
            priority
            className={`
                object-cover group-hover:text-opacity-75 duration-700 ease-in-out rounded-full 
            `}
            sizes="(max-width: 16px) 100vw, (max-width: 16px) 50vw, 25vw"
        />
        </div>
    );
};

export default ProfileImage;